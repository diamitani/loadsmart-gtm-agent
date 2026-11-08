import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { strToU8, zipSync } from "fflate";
import { detectMime, ingestFile, kindOf, ooxmlText } from "@/lib/ingest";

const fx = (n: string) => new Uint8Array(fs.readFileSync(path.join(import.meta.dirname, "fixtures", n)));

describe("type detection", () => {
  it("maps extensions to kinds", () => {
    expect(kindOf(detectMime("deck.PPTX"))).toBe("pptx");
    expect(kindOf(detectMime("call.m4a"))).toBe("media");
    expect(kindOf(detectMime("demo.mp4"))).toBe("media");
    expect(kindOf(detectMime("shot.webp"))).toBe("image");
    expect(kindOf(detectMime("x.bin", "application/octet-stream"))).toBe("unknown");
  });
});

describe("free in-process parsers (real files)", () => {
  it("PDF text layer via unpdf", async () => {
    const r = await ingestFile({ name: "case-study.pdf", bytes: fx("case-study.pdf") });
    expect(r.method).toBe("pdf-text");
    expect(r.pages).toBe(1);
    expect(r.text).toContain("Bright Smiles Group cut scheduling time");
  });

  it("Word via mammoth", async () => {
    const r = await ingestFile({ name: "company.docx", bytes: fx("company.docx") });
    expect(r.method).toBe("docx");
    expect(r.text).toContain("multi-location dental groups");
  });

  it("PowerPoint slides + speaker notes via fflate", async () => {
    const r = await ingestFile({ name: "deck.pptx", bytes: fx("deck.pptx") });
    expect(r.method).toBe("ooxml");
    expect(r.text).toContain("Practice operations managers");
    expect(r.text).toContain("[notes] Lead with no-show reduction");
  });

  it("Excel cells via fflate", async () => {
    const r = await ingestFile({ name: "accounts.xlsx", bytes: fx("accounts.xlsx") });
    expect(r.text).toContain("Account\tLocations");
    expect(r.text).toContain("Bright Smiles Group\t7");
  });

  it("Excel shared-strings format (files saved by Microsoft Excel)", () => {
    const zip = zipSync({
      "xl/sharedStrings.xml": strToU8('<sst><si><t>Account</t></si><si><r><t>Globex </t></r><r><t>Corp</t></r></si></sst>'),
      "xl/worksheets/sheet1.xml": strToU8('<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c></row><row r="2"><c r="A2" t="s"><v>1</v></c><c r="B2"><v>12</v></c></row></sheetData></worksheet>'),
    });
    expect(ooxmlText(zip, "xlsx")).toBe("--- sheet 1 ---\nAccount\nGlobex Corp\t12");
  });

  it("image OCR via tesseract.js (no model key)", async () => {
    const r = await ingestFile({ name: "pricing.png", bytes: fx("pricing.png") });
    expect(r.method).toBe("ocr");
    expect(r.text).toMatch(/Pricing Sheet/i);
    expect(r.text).toMatch(/unlimited locations/i);
  }, 120_000);

  it("scanned PDF without a model or Docling explains how to enable OCR", async () => {
    await expect(ingestFile({ name: "scanned.pdf", bytes: fx("scanned.pdf") })).rejects.toThrow(/scanned PDF.*DOCLING_URL/);
  });

  it("rejects unsupported types with a helpful message", async () => {
    await expect(ingestFile({ name: "x.exe", bytes: new Uint8Array([1]), mime: "application/x-msdownload" })).rejects.toThrow(/unsupported file type/);
  });

  it("audio without a transcription endpoint explains the free options", async () => {
    delete process.env.TRANSCRIBE_BASE_URL;
    await expect(ingestFile({ name: "call.mp3", bytes: new Uint8Array(10) })).rejects.toThrow(/TRANSCRIBE_BASE_URL.*Speaches|faster-whisper/);
  });
});

describe("self-hostable open-source services (mock servers)", () => {
  let server: http.Server;
  let base = "";
  const seen: { url?: string; body: string; auth?: string }[] = [];

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        seen.push({ url: req.url, body, auth: req.headers.authorization });
        res.setHeader("content-type", "application/json");
        if (req.url === "/v1/audio/transcriptions") {
          res.end(JSON.stringify({ text: "hello", segments: [{ start: 0, text: " Thanks for taking the call." }, { start: 65, text: " Our no-show rate is the problem." }] }));
        } else if (req.url === "/v1/convert/file") {
          res.end(JSON.stringify({ status: "success", document: { md_content: "# Converted by Docling\n\n| a | b |" } }));
        } else {
          res.statusCode = 404;
          res.end("{}");
        }
      });
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
    base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  });
  afterAll(() => {
    server.close();
    delete process.env.TRANSCRIBE_BASE_URL;
    delete process.env.DOCLING_URL;
  });

  it("transcribes audio/video through an OpenAI-compatible Whisper endpoint with timestamps", async () => {
    process.env.TRANSCRIBE_BASE_URL = `${base}/v1`;
    process.env.TRANSCRIBE_API_KEY = "k";
    const r = await ingestFile({ name: "discovery-call.mp4", bytes: new Uint8Array(2048) });
    expect(r.method).toBe("transcript");
    expect(r.text).toBe("[0:00] Thanks for taking the call.\n[1:05] Our no-show rate is the problem.");
    const req = seen.find((s) => s.url === "/v1/audio/transcriptions")!;
    expect(req.auth).toBe("Bearer k");
    expect(req.body).toContain('name="model"');
    expect(req.body).toContain("whisper-large-v3-turbo");
    expect(req.body).toContain('filename="discovery-call.mp4"');
  });

  it("uses Docling for documents when DOCLING_URL is set", async () => {
    process.env.DOCLING_URL = base;
    const r = await ingestFile({ name: "company.docx", bytes: fx("company.docx") });
    expect(r.method).toBe("docling");
    expect(r.text).toContain("Converted by Docling");
    const req = seen.find((s) => s.url === "/v1/convert/file")!;
    expect(req.body).toContain('name="to_formats"');
    expect(req.body).toContain('name="do_ocr"');
  });

  it("falls back to the built-in parser if Docling fails", async () => {
    process.env.DOCLING_URL = `${base}/broken`;
    const r = await ingestFile({ name: "company.docx", bytes: fx("company.docx") });
    expect(r.method).toBe("docx");
    expect(r.warnings[0]).toMatch(/Docling failed/);
  });
});
