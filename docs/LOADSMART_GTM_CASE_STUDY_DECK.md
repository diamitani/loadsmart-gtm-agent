# Loadsmart GTM Engineer: Case Answers

Patrick Diamitani · November 2026

The seven questions on Loadsmart's AE/SDR pod program, with my answers. This is the text behind the presentation deck.

---

## 1. Diagnose: it leaks at assignment

*Where do you expect this program is leaking, and how would you find out? Tell us what you'd check, what a red flag looks like, and how you'd tell a symptom from a root cause.*

**Where it leaks**
- The assignment step. We don't know if the accounts are lookalikes pulled from data platforms or internal companies that were enriched.
- There is no lead scoring system.

**How I'd find out**
- Read the initial prompt, code or skill that created this system and sends the list daily.
- Check the CRM for any lead scoring fields or activity.
- Look for a report.

**Red flags**
- Too few options. 20 accounts is too small.
- One account list used across multiple product lines. ICP and buyer persona need to come from the product.

**Telling them apart**

| Red flag | Symptom | Root cause |
| --- | --- | --- |
| Low open and reply rates | No meetings | Wrong persona or ICP |

---

## 2. List and contact quality: write the ICP first, then let booked calls and closed deals rank the list

*How would you make sure our lists and contact pulls are good now, and get better over time?*

**Good now**
- First, create a buyer persona, ICP and use case doc.
- Enrich the current system.
- Rank accounts and contacts by their ICP and buyer persona score.

**Better over time**
- Test leads across accounts.
- Pull in data from booked calls, closed deals and similar outcomes.
- Use it to identify which subject lines, companies and prospect titles work best.

---

## 3. Signals: a custom signal skill, fed by the ICP and run daily

*What signal-based systems have you built, and which would you recommend here? How would you test whether they work?*

**What I've built**
- Multiple workflows in ZoomInfo and Factors.ai.
- Signal systems in Claude Code as skills, and web-based.

**What I'd recommend**
- A custom signal skill that takes in the company ICP and buyer persona.
- It searches the web for press, LinkedIn posts, podcasts, news, and 10-K and SEC filings.
- Align it with a tool that shows who was on your website and who is searching keywords relevant to your category (implement SEO).
- Draft a signal lead list daily from SERP API search or LinkedIn, then enrich from there.

---

## 4. Measurement: stop measuring in general

*How would you measure the program, and what would tell you to change strategy?*

**What's missing today**
- The whole thing is general.
- We don't know if time of day works, or how to pull rep activity per channel.

**What to measure:** ICP, user persona, size segmentation, product sales, and more.

**How**
- A skill that pulls in daily program data per rep plus Salesforce data and writes a report.
- Sent daily to each rep (their own stats and leaderboard) and to the leadership team.
- A working dashboard for activity and metrics: opens, replies and more.

---

## 5. Working with the pods: weekly office hours that turn rep workflows into skills

*How would you collect AE and SDR feedback, turn it into changes, and report findings to Sales, Marketing, and RevOps?*

**Collect**
- Weekly 1:1s and office hours.
- Train reps on AI.
- Analyze their needs, their workflows and what they do daily.

**Turn into changes**
- Create a plan for reps to build skills that solve those needs.
- Or record their work and create individual SOPs and skills for them.

**Report**
- Implementation report: what was implemented for each rep.
- Improvement report: which key KPIs improved, or didn't.
- Incentive report: what we offered, what they wanted, whether they're getting it, and whether the incentive is helping.

---

## 6. Tools: add n8n, build skills and custom agents

*What would you add or change, and what ROI have you seen? Compare it against the stack we have today (Salesforce, Salesloft, Gong, ZoomInfo, Clay, Apollo, Sales Navigator, Claude).*

**Keep:** Salesforce, Salesloft, Gong, ZoomInfo, Clay, Apollo, Sales Navigator, Claude.

**Add:** n8n. Skills and custom agents. Maybe Claude managed agents.

---

## 7. Blind spots

*What are we not thinking about?*

- **Segmentation:** what's working across size? Industry? Category?
- **Internal database:** what's already in the database that we can use or enrich?
- **Maximum expansion:** more than 20. Keep the target list, but grow to 50 per mailbox.
