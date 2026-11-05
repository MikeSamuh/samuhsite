// The site's words, page by page. This is what the admin's Content tab
// edits: the defaults here are the copy as it stands in the working draft,
// and whatever the team saves in the admin is merged over them at render
// (src/lib/content/content.ts). Reset in the admin brings a page back here.
//
// Rules carried from CLAUDE.md: nothing here is a figure SAMUH did not
// supply, no em dashes, and the markers *words* (primary colour) and
// ~words~ (secondary) are the only markup, parsed by rich() in sections.tsx.
// The schema that labels each field for the editor is in schema.ts; keep
// the two in step.

import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact-details";
import { REPORT } from "@/lib/report";

export const DEFAULTS = {
  global: {
    brand: {
      partnerLine: "In partnership with\nSapien Labs",
      navCta: "Let’s talk",
    },
    footer: {
      line: "High performance *without* the cost to people.",
      about: "Organizational and high-performance consulting. We work with teams on the conditions they work in.",
      talkHeading: "Talk to us",
      bookCall: "Book a call",
      cta: "Let’s talk",
      reportLabel: "Work Culture Report",
      youtubeLabel: "Human Expansion on YouTube",
      youtubeUrl: "https://www.youtube.com/@HumanExpansion-ACorePurpose",
    },
    contact: {
      email: CONTACT_EMAIL ?? "",
      phone: CONTACT_PHONE ?? "",
    },
    report: {
      tag: "Research · in partnership with Sapien Labs",
      line: "The environment inside a team shapes how much capacity its people can bring to the work. What was previously inferred can now be measured.",
      kicker: REPORT.kicker,
      download: "Download the report",
      onSite: "On sapienlabs.org",
      page: REPORT.page,
      pdf: REPORT.pdf,
    },
    testimonials: {
      items: [
        // Santosh's email, read out in the client's copy review of 2 Nov 2026
        // and agreed there as a testimonial. Title and organization to come
        { quote: "There is some real progress reflected in the findings and honestly it exceeded my expectations. The real value will be in making the behaviors part of how we lead and operate every day. Thank you for your partnership.", who: "Santosh", role: "TODO(content): title, organization", photo: "" },
        { quote: "A second sample. Long enough to show how a real quote wraps at this size, short enough to read in one breath.", who: "Name", role: "Role, Organization", photo: "" },
        { quote: "A third sample, so the arrows and the dots have somewhere to go.", who: "Name", role: "Role, Organization", photo: "" },
      ],
    },
  },

  home: {
    hero: {
      eyebrow: "Organizational and high-performance consulting",
      // the client's words, copy review of 2 Nov 2026 (docs/decisions.md)
      title: "Great team environments sustain high performance.",
      lede: "Samuh uses scientifically validated measures to reveal your team’s hidden performance tax and helps build practices that reduce it.",
      ctaPrimary: "Get started",
      ctaSecondary: "Talk to us",
    },
    thesis: {
      // below the circles since 2 Nov, as the bridge into TeamQ. One colour
      // on the page: no ~cyan~ here
      text: "When the team environment is right, people thrive and results follow. Most teams pay a hidden performance tax instead, through their environment, not their effort. TeamQ shows where yours is.",
    },
    dictionary: {
      word: "Samuh",
      pronunciation: "/səˈmuː/",
      origin: "noun · Sanskrit समूह, samūha",
      definition: "A group of people who come together *for a purpose larger than themselves.*",
    },
    // the client's words, copy review of 2 Nov 2026. "Enterprise" is theirs
    // for that one line (CLAUDE.md rule 6 otherwise). The four capacities
    // went with the Venn
    focus: {
      eyebrow: "The overlooked performance driver",
      titleOthers: "Where *organizations* focus",
      titleWe: "Where *performance* happens",
      // top to bottom, in the order the circles arrive
      levels: [
        { name: "Enterprise", label: "Driving change through enterprise-wide transformations", note: "Often many at a time." },
        { name: "Individual", label: "Managing and rewarding performance", note: "One person at a time." },
        { name: "Team", label: "People reside in organizations but they perform in teams", note: "That’s where goals are set, people collaborate, and results are delivered." },
      ],
    },
    tool: {
      kicker: "TeamQ",
      title: "Find your team’s hidden performance tax",
      pitch: "",
      callout: "Ready to take your free assessment?",
      cta: "Start here",
    },
    voices: {
      kicker: "In their words",
      title: "Testimonials",
    },
    case: {
      kicker: "In practice",
      title: "Case Studies",
      tag: "Case study · Senior leadership team, Fortune 10 healthcare company",
      line: "1 high-performance ritual. 90 days. Measurable change.",
      stats: [
        { n: "+39%", label: "most improved practice" },
        { n: "12/13", label: "team practices improved" },
        { n: "Embedded", label: "a new way of working that has stuck" },
      ],
      cta: "Download the case study",
    },
    faq: {
      kicker: "FAQ",
      title: "Questions we get asked",
      items: [
        { q: "What does SAMUH do?", a: "Organizational and high-performance consulting, in partnership with Sapien Labs. We work with teams on the conditions they work in, so performance rises without the cost to people." },
        { q: "Who is it for?", a: "Teams. Leadership teams in multi-team organizations, team leads, store managers, and founders of fast-growing companies. If people do their work in a team, this applies." },
        { q: "Why the team, and not the individual or the organization?", a: "Because the team is where people experience their work life. Organizations invest in individuals and look at the whole, and the team in between is where capacity is won or lost." },
        { q: "What is TeamQ?", a: "SAMUH’s read on how a team works: what the work is like for the people doing it, how they live outside it, and what that does to their capacity to perform. It is built on Sapien Labs team environment factors." },
        { q: "Is the tool on this page TeamQ?", a: "No. It shows how TeamQ thinks, with a demonstration team and a few factors moving. A TeamQ assessment is done with your own team, and the result is yours." },
        { q: "What is the Sapien Labs partnership?", a: "Sapien Labs is our research partner and the source of the research this site leans on. Their Work Culture Report is the spine of the argument, and the team environment factors we assess come from their work." },
        { q: "Is this about performance or about wellbeing?", a: "Both, at once. People thriving and results thriving reinforce each other rather than trading off. That is the whole point, and the reason we measure the environment instead of pushing on effort." },
        { q: "How do you work with a team?", a: "Measurement first. LeadQ is a free read for the leader, TeamQ measures the whole team, and OrgQ maps capacity across an organization. Then the 90-day cycle, run three ways: DIY, where the team works through it on its own; Supported, which adds calls with us; Guided, where we deliver in person." },
        { q: "What does it cost?", a: "LeadQ is free. TeamQ is $99 per team. OrgQ and the 90-day cycles are priced on the Solutions page, and we will put a number on anything larger." },
        { q: "How do we start?", a: "Take LeadQ. It is free, takes about five minutes, and gives you a first read on your own team before anyone else is involved. From there, TeamQ for the whole team, or a conversation about your organization." },
      ],
    },
    start: {
      title: "What could stronger performance look like for your team?",
      sub: "",
      placeholder: "How many people are on your team?",
      startLabel: "Start",
      ctaPrimary: "Take LeadQ, free",
      ctaSecondary: "Talk to us",
    },
  },

  about: {
    head: {
      kicker: "About",
      title: "A group of people who come together for a purpose larger than themselves.",
      lede: "That is what Samuh means in Sanskrit, and it is the standard the work is held to.",
    },
    believe: {
      kicker: "What we believe",
      title: "Performance is created in teams",
      big: "High performance without the cost to people. Sustained performance, where people thriving and results thriving reinforce each other rather than trading off.",
      p1: "Most organizations invest above the team, in transformations and organization-wide programs, and below it, in individual evaluation and development. The work itself gets done in teams: information flows, trust builds, feedback happens and decisions get made there.",
      p2: "The environment inside a team shapes how much capacity its people can bring to the work. Samuh shows a team where its capacity is leaking, the team chooses one practice to close the gap, and the change is measured.",
    },
    partner: {
      kicker: "In partnership with Sapien Labs",
      title: "The research behind the work",
      p1: "Sapien Labs is the primary partner and the source of the research the site leans on. The Work Culture Report is the research spine, and the intake assessment is built on Sapien Labs team environment factors.",
      p2: "Sapien Labs’ MHQ measures mental wellbeing across aspects of functioning and feeling, gathered through the Global Mind Project. TeamQ reads the team environment through it, so what was previously inferred about a team can now be measured.",
    },
    team: {
      kicker: "The people you would be working with",
      title: "Team",
      members: [
        { name: "Rahul Varma", role: "Co-Founder & CEO", bio: "Former CHRO, Accenture Technology.", photo: "/team/rahul-varma.webp" },
        { name: "Dr. Tara Thiagarajan", role: "Chief Scientific Advisor", bio: "Founder, Sapien Labs. Ph.D., Stanford.", photo: "/team/tara-thiagarajan.webp" },
        { name: "Calina Mircea", role: "Co-Founder & Methodology Lead", bio: "Systemic coach, learning and leadership expert.", photo: "/team/calina-mircea.webp" },
        { name: "Mike Gabour", role: "Co-Founder & CTO", bio: "Global analytics strategy and design leader.", photo: "/team/mike-gabour.webp" },
        { name: "Jake DeBerry", role: "Lead, Enterprise Growth", bio: "CEB/Gartner, Deloitte, NeuroLeadership Institute.", photo: "/team/jake-deberry.webp" },
      ],
      closing: "An interdisciplinary team spanning enterprise transformation, team practice, data science and human performance research.",
    },
    partners: {
      kicker: "Partners",
      title: "Channel partners and coaching teams",
    },
  },

  process: {
    head: {
      kicker: "The methodology across all three tiers",
      title: "The team process.",
      lede: "See the team clearly. Choose the practice together. Ritualize it in the flow of work.",
    },
    stages: {
      items: [
        { verb: "Assess", line: "The team takes its own measure.", body: "Every team member completes TeamQ. From that data, Samuh establishes the team\u2019s performance baseline: where it stands today, so that every change that follows can be measured against it." },
        { verb: "Discover", line: "The team turns the lens on itself.", body: "Through confidential conversations, read alongside the baseline, the team gets a clear read on its own environment: what it is working toward, what already goes well, and what is quietly getting in the way." },
        { verb: "Align", line: "The team agrees on what better looks like.", body: "With that picture in front of it, the team decides what better performance means here, and where one change would do the most for the work and for the people doing it." },
        { verb: "Co-create", line: "Together, we turn moments into practice.", body: "Decisions, feedback, disagreement, change: the moments that shape performance become specific, repeatable practices. The team designs them, tests them, and runs them inside the work it already does." },
      ],
      ctaPrimary: "Get started",
      ctaSecondary: "Ways to engage",
    },
  },

  // Prices are the whiteboard figures from Mike and Jake's session, photographed
  // 2 November 2026, on Wilfred's call. Swap them the moment a figure is
  // confirmed in writing. docs/decisions.md, 2 Nov 2026
  solutions: {
    head: {
      kicker: "Start by measuring",
      title: "Assess yourself, your team, or your organization.",
      lede: "Measurement first, then the practices the team owns. Three measures built with Sapien Labs, and the ways to act on what they show.",
    },
    assess: {
      kicker: "Three measures",
      title: "Pick the one that fits where you are.",
      lede: "",
      rowWho: "Who it is for",
      rowGet: "What you get",
      items: [
        { tag: "You", name: "LeadQ", price: "Free", what: "A first read on your team’s environment, from your own answers. About five minutes.", who: "A leader who wants to see the shape of the problem before involving the team.", get: "A high-level view of where your team environment helps or hinders performance, and what TeamQ would add.", button: "Take LeadQ", door: "leadq" },
        { tag: "Your team", name: "TeamQ", price: "$99 per team", what: "Every team member answers, about five minutes each. Thirteen team environment factors and thirteen team practices.", who: "A leadership team, or any team, that wants evidence rather than opinion.", get: "Your team placed within Sapien Labs’ benchmark, productive days gained or lost each month, and the levers ranked by expected gain. Repeated at day 90 to measure what moved.", button: "Get TeamQ", door: "teamq" },
        { tag: "Your organization", name: "OrgQ", price: "Packages from $10 per person", what: "Every team in scope, one capacity map.", who: "CHROs, CEOs and transformation leaders working across many teams.", get: "Where capacity leaks across the organization and where the biggest gains are. Scoped with us.", button: "Talk to us", door: "orgq" },
      ],
      note: "All three are built on the same technology, developed with Sapien Labs on their MHQ, a validated measure of human capacity drawn from more than 3 million people in 130+ countries.",
    },
    tiers: {
      kicker: "The main work",
      title: "Then the 90-day cycle, with us beside the team.",
      items: [
        { tag: "Tier 01", name: "DIY", what: "Self-guided on the platform. The team works through the cycle on its own.", who: "Teams with a strong leader who want the method without the meetings, and organizations rolling it out across many teams.", get: "The team process, two TeamQ measures a year, and the material to run one ritual for ninety days." },
        { tag: "Tier 02", name: "Supported", what: "DIY plus periodic support calls from the Samuh team.", who: "Teams that want a second pair of eyes at the moments that matter: choosing the practice, and the check-in at day 45.", get: "Everything in DIY, with scheduled calls to read the data together and keep the ritual on track." },
        { tag: "Tier 03", name: "Guided", what: "In person. The Samuh team delivers the work hands on.", who: "Leadership teams and mission-critical teams where the stakes justify having us in the room.", get: "Confidential interviews, a facilitated day one, coaching for two ritual keepers every two weeks, and the close." },
      ],
      rowWhat: "What it is",
      rowWho: "Who it is for",
      rowGet: "What you get",
      ask: "Talk to us about this",
      rows: [
        // TODO(content): the whiteboard reads "$200/cycle" for Guided, which
        // cannot be right beside $20K for Supported. Confirm with Mike or Jake
        { label: "Price", a: "$1K per year, two TeamQ included", b: "$20K per cycle", c: "TODO(content): confirm, the whiteboard reads $200 per cycle" },
        { label: "Support calls", a: "Not included", b: "Scheduled", c: "Ongoing" },
        { label: "In-person delivery", a: "Not included", b: "Not included", c: "Included" },
        { label: "TeamQ baseline and re-measure", a: "Included", b: "Included", c: "Included" },
        { label: "Ritual keeper coaching", a: "Self-directed", b: "At check-ins", c: "Every two weeks" },
      ],
      note: "A cycle is ninety days: one practice, co-created, iterated inside the team’s regular work, and measured again at the end. An organization journey runs the same cycle across a team of teams. Talk to us about that one.",
    },
    talk: {
      kicker: "Talk to us",
      title: "Tell us which one, and where to reach you",
      button: "Talk to us",
      other: "Other",
      note: "A person replies. Tagged {tier}, so we come prepared.",
      thanks: "Thank you. We’ll be in touch about {tier}.",
      wait: "Read about the team process while you wait",
    },
    voices: {
      kicker: "Trust before proof",
      title: "What teams say",
    },
  },

  // /start, the fork behind every Get started button. {door} in the form's
  // words becomes the door's name
  // the email box (Wilfred, 3 Nov 2026): on the home under the tool, on
  // /contact, and under the Solutions cards. The address, a magic link,
  // the platform. {email} in the thank-you becomes the address given
  start: {
    form: {
      label: "Work email",
      placeholder: "you@company.com",
      button: "Begin Free Assessment",
      thanksTitle: "Check your inbox.",
      thanksText: "Your link to LeadQ is on its way to {email}. One click signs you in.",
      talk: "Prefer to talk first?",
      talkLink: "Let’s talk",
    },
  },

  // /contact: the assessment box beside the calendar (Wilfred, 3 Nov 2026)
  contact: {
    head: {
      kicker: "Let’s talk",
      title: "Take the free assessment, or book a time.",
    },
    assess: {
      title: "Take your free assessment",
      line: "LeadQ, about five minutes, for you alone. Enter your work email and we send the link.",
    },
    book: {
      title: "Book a time",
      line: "An intro call with a person at SAMUH. Bring your team in mind; we will say honestly whether this is the right thing for it.",
    },
    aside: {
      title: "Or reach us directly",
    },
  },

  teamq: {
    head: {
      eyebrow: "Explore TeamQ",
      title: "Optimize your team, with science",
      ctaPrimary: "Assess your team",
      ctaSecondary: "Skip to the tool",
    },
    what: {
      kicker: "What is TeamQ",
      title: "A read on how a team works, and how its people live.",
      p1: "TeamQ is how SAMUH reads a team: what the work is like for the people doing it, and what that does to their capacity to perform. It looks at the work environment, and at how people live outside it.",
      p2: "With a real team, this is where the work starts. The team answers for itself, we read the result together, and the team chooses what to work on. Then we measure again. Capacity to perform is measured with the Mental Health Quotient (MHQ), from our partner Sapien Labs.",
      p3: "Below, you can see how different factors could positively or negatively affect a team, using example test case data: a demonstration team of {teamSize}, and eleven factors, nine in the work environment and two in how people live. First, what you are looking at.",
    },
    tour: {
      items: [
        { kicker: "Productive days per month", title: "The headline number.", text: "Of 22 working days in a month, how many this team gets full value from, as the team reported it. It is the number a leader feels first, so it is the one in colour, and it moves as the factors change." },
        { kicker: "Capacity to perform", title: "How far the team is from Thriving.", text: "The team’s average Mental Health Quotient, the measure from our partner Sapien Labs that TeamQ is built on, read on its scale from Distressed to Thriving. The meter runs from -100 to 200 and the needle moves as the factors change. The number says how many points separate this team from Thriving." },
        { kicker: "Work environment", title: "Nine factors, rated 1 to 9.", text: "What the work is like for the people doing it: flexibility, workload, purpose, learning, colleagues, manager, information and recognition. Each slider starts where this team’s average sits today. Drag it to see what happens when the whole team’s experience of that factor improves, or slips." },
        { kicker: "Lifestyle factors", title: "Beyond the team, to the individual.", text: "Two factors from outside work, on the same 1 to 9 scale: exercise, and healthy diet, which is how rarely people eat ultra-processed food. This is what sets SAMUH apart. We do not stop at the team inside the organization. We go to individual habits and rituals, because a team performs with the whole person." },
      ],
    },
    tool: {
      title: "Try it out.",
    },
    ask: {
      title: "Start here to get your team’s TeamQ assessment.",
      thanksTitle: "Thank you.",
      thanksText: "A person at SAMUH will be in touch about your team.",
    },
  },

  insights: {
    head: {
      kicker: "Insights",
      title: "Video, articles and research.",
      lede: "Perspectives based on cutting-edge research, and guided by timeless wisdom. Start with the Human Expansion episodes if the argument is new to you.",
    },
    research: {
      eyebrow: "Research",
      title: "The research we build on.",
    },
    feed: {
      eyebrow: "The feed",
      title: "Video and articles.",
    },
    meta: {
      description: "Perspectives based on cutting-edge research, and guided by timeless wisdom. Video, articles and research from SAMUH, in partnership with Sapien Labs.",
    },
  },
};

export type SiteContent = typeof DEFAULTS;
export type PageKey = keyof SiteContent;
export type GlobalContent = SiteContent["global"];
export type HomeContent = SiteContent["home"];
export type AboutContent = SiteContent["about"];
export type ProcessContent = SiteContent["process"];
export type SolutionsContent = SiteContent["solutions"];
export type StartContent = SiteContent["start"];
export type ContactContent = SiteContent["contact"];
export type TeamQContent = SiteContent["teamq"];
export type InsightsContent = SiteContent["insights"];
