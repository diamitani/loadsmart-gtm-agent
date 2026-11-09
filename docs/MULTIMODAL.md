# Reading documents, images, audio and video

Upload anything in **Knowledge** (or the 📎 in chat), paste a link, or ask the Architect to *"read this: https://…"* (`read_document` tool). Everything becomes searchable text the build pipeline cites.

## What reads what — and what it costs

| You give it | How it's read | Cost |
|---|---|---|
| PDF with text | **unpdf** (Mozilla pdf.js, serverless build) | $0, built in |
| Word `.docx` | **mammoth** | $0, built in |
| PowerPoint `.pptx` (slides + speaker notes) / Excel `.xlsx` (all sheets) | **fflate** unzip + OOXML parsing | $0, built in |
| Image / screenshot (LinkedIn profiles, slides, whiteboards, pricing pages) | **tesseract.js** OCR — or the model's **vision** when a key is set (understands layout and visuals, not just text) | $0 / model tokens |
| Scanned PDF | Model vision, or **Docling** | model tokens / $0 self-hosted |
| Audio & video (sales calls, webinars, demos, voice notes) | **Whisper** via any OpenAI-compatible endpoint → timestamped transcript | $0 self-hosted or Groq free tier |
| Web page | Built-in HTML reader | $0 |

Every knowledge item is labelled with how it was read (e.g. *[Extracted via OCR (tesseract.js)]*), so you always know how much to trust it.

**Size limits:** uploads up to **4 MB** (a Vercel limit); links up to **25 MB** (the Whisper limit). For long recordings, upload the audio track only — an hour of speech at 32 kbps mono is about 15 MB:

```bash
ffmpeg -i recording.mp4 -vn -ac 1 -b:a 32k recording.mp3
```

## Free upgrades you can self-host (scale without per-use fees)

Both run with Docker on any small server (a $5–10/month VPS, or free tiers such as Oracle Cloud Always Free), or on your own computer with a tunnel.

### Docling — scans, tables, complex layouts (IBM, MIT licence)

```bash
docker run -d -p 5001:5001 quay.io/docling-project/docling-serve
```

Then set `DOCLING_URL=http://<your-server>:5001`. Enably uses Docling first for PDFs and Office files and falls back to the built-in parsers if it's unreachable.

### Speaches — Whisper transcription (MIT licence, OpenAI-compatible)

```bash
docker run -d -p 8000:8000 ghcr.io/speaches-ai/speaches:latest-cpu
```

Then set `TRANSCRIBE_BASE_URL=http://<your-server>:8000/v1` and `TRANSCRIBE_MODEL=Systran/faster-whisper-small` (check the Speaches README for current image tags and models).

**No server?** Groq's free tier hosts Whisper: `TRANSCRIBE_BASE_URL=https://api.groq.com/openai/v1`, `TRANSCRIBE_API_KEY=<groq key>`, `TRANSCRIBE_MODEL=whisper-large-v3-turbo` (free-tier rate limits apply).

## Privacy

Built-in parsers and OCR run inside your app — files never leave it. Vision sends the file to your model provider; Docling and Whisper send it to the server you configure. Set `ENABLY_VISION=off` to keep images on the free local OCR path.

## Code

`lib/ingest/index.ts` (routing + parsers), `lib/agent/fetch-url.ts` (URL ingestion with SSRF protection and a streaming 25 MB cap), `tests/ingest.test.ts` (real-file tests).
