// Patrick Diamitani's answers to Loadsmart's seven GTM Engineer questions.
// Source: loadsmart_questions_answered_patrick.pdf. Wording is lightly edited for
// readability only. Nothing here is added beyond what the source says.

export type AnswerBlock = { label: string; points: string[] };

export type Answer = {
  n: number;
  title: string;
  headline: string;
  question: string;
  blocks: AnswerBlock[];
  chain?: { redFlag: string; symptom: string; rootCause: string };
};

export const author = {
  name: "Patrick Diamitani",
  role: "GTM Engineer",
  date: "November 2026",
};

export const answers: Answer[] = [
  {
    n: 1,
    title: "Diagnose",
    headline: "It leaks at assignment.",
    question:
      "Where do you expect this program is leaking, and how would you find out? Tell us what you'd check, what a red flag looks like, and how you'd tell a symptom from a root cause.",
    blocks: [
      {
        label: "Where it leaks",
        points: [
          "The assignment step. We don't know if the accounts are lookalikes pulled from data platforms or internal companies that were enriched.",
          "There is no lead scoring system.",
        ],
      },
      {
        label: "How I'd find out",
        points: [
          "Read the initial prompt, code or skill that created this system and sends the list daily.",
          "Check the CRM for any lead scoring fields or activity.",
          "Look for a report.",
        ],
      },
      {
        label: "Red flags",
        points: [
          "Too few options. 20 accounts is too small.",
          "One account list used across multiple product lines. ICP and buyer persona need to come from the product.",
        ],
      },
    ],
    chain: {
      redFlag: "Low open and reply rates",
      symptom: "No meetings",
      rootCause: "Wrong persona or ICP",
    },
  },
  {
    n: 2,
    title: "List and contact quality",
    headline: "Write the ICP first. Then let booked calls and closed deals rank the list.",
    question: "How would you make sure our lists and contact pulls are good now, and get better over time?",
    blocks: [
      {
        label: "Good now",
        points: [
          "First, create a buyer persona, ICP and use case doc.",
          "Enrich the current system.",
          "Rank accounts and contacts by their ICP and buyer persona score.",
        ],
      },
      {
        label: "Better over time",
        points: [
          "Test leads across accounts.",
          "Pull in data from booked calls, closed deals and similar outcomes.",
          "Use it to identify which subject lines, companies and prospect titles work best.",
        ],
      },
    ],
  },
  {
    n: 3,
    title: "Signals",
    headline: "A custom signal skill, fed by the ICP and run daily.",
    question:
      "What signal-based systems have you built, and which would you recommend here? How would you test whether they work?",
    blocks: [
      {
        label: "What I've built",
        points: [
          "Multiple workflows in ZoomInfo and Factors.ai.",
          "Signal systems in Claude Code as skills, and web-based.",
        ],
      },
      {
        label: "What I'd recommend",
        points: [
          "A custom signal skill that takes in the company ICP and buyer persona.",
          "It searches the web for press, LinkedIn posts, podcasts, news, and 10-K and SEC filings.",
          "Align it with a tool that shows who was on your website and who is searching keywords relevant to your category (implement SEO).",
          "Draft a signal lead list daily from SERP API search or LinkedIn, then enrich from there.",
        ],
      },
    ],
  },
  {
    n: 4,
    title: "Measurement",
    headline: "Stop measuring in general. Measure by segment, rep and channel.",
    question: "How would you measure the program, and what would tell you to change strategy?",
    blocks: [
      {
        label: "What's missing today",
        points: [
          "The whole thing is general.",
          "We don't know if time of day works, or how to pull rep activity per channel.",
        ],
      },
      {
        label: "What to measure",
        points: ["ICP", "User persona", "Size segmentation", "Product sales", "And more"],
      },
      {
        label: "How",
        points: [
          "A skill that pulls in daily program data per rep plus Salesforce data and writes a report.",
          "Sent daily to each rep (their own stats and leaderboard) and to the leadership team.",
          "A working dashboard for activity and metrics: opens, replies and more.",
        ],
      },
    ],
  },
  {
    n: 5,
    title: "Working with the pods",
    headline: "Weekly office hours that turn rep workflows into skills.",
    question:
      "How would you collect AE and SDR feedback, turn it into changes, and report findings to Sales, Marketing, and RevOps?",
    blocks: [
      {
        label: "Collect",
        points: [
          "Weekly 1:1s and office hours.",
          "Train reps on AI.",
          "Analyze their needs, their workflows and what they do daily.",
        ],
      },
      {
        label: "Turn into changes",
        points: [
          "Create a plan for reps to build skills that solve those needs.",
          "Or record their work and create individual SOPs and skills for them.",
        ],
      },
      {
        label: "Report",
        points: [
          "Implementation report: what was implemented for each rep.",
          "Improvement report: which key KPIs improved, or didn't.",
          "Incentive report: what we offered, what they wanted, whether they're getting it, and whether the incentive is helping.",
        ],
      },
    ],
  },
  {
    n: 6,
    title: "Tools",
    headline: "Add n8n. Build skills and custom agents. That's about it.",
    question:
      "What would you add or change, and what ROI have you seen? Compare it against the stack we have today (Salesforce, Salesloft, Gong, ZoomInfo, Clay, Apollo, Sales Navigator, Claude).",
    blocks: [
      {
        label: "Keep",
        points: ["Salesforce", "Salesloft", "Gong", "ZoomInfo", "Clay", "Apollo", "Sales Navigator", "Claude"],
      },
      {
        label: "Add",
        points: ["n8n", "Skills and custom agents", "Maybe Claude managed agents"],
      },
    ],
  },
  {
    n: 7,
    title: "Blind spots",
    headline: "Segmentation, the internal database, and 50 per mailbox.",
    question: "What are we not thinking about?",
    blocks: [
      { label: "Segmentation", points: ["What's working across size? Industry? Category?"] },
      { label: "Internal database", points: ["What's already in the database that we can use or enrich?"] },
      { label: "Maximum expansion", points: ["More than 20. Keep the target list, but grow to 50 per mailbox."] },
    ],
  },
];

