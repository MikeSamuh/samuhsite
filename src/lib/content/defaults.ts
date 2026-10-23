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
      partnerLine: "Partnered with\nSapien Labs",
      navCta: "Explore TeamQ",
    },
    footer: {
      line: "High performance *without* the cost to people.",
      about: "Organizational and high-performance consulting. We work with teams on the conditions they work in.",
      talkHeading: "Talk to us",
      bookCall: "Book a call",
      cta: "Get started",
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
        { quote: "Sample testimonial. Two or three sentences in the client’s own words about what changed for the team, and what it felt like to work this way.", who: "Name", role: "Role, Organization" },
        { quote: "A second sample. Long enough to show how a real quote wraps at this size, short enough to read in one breath.", who: "Name", role: "Role, Organization" },
        { quote: "A third sample, so the arrows and the dots have somewhere to go.", who: "Name", role: "Role, Organization" },
      ],
    },
  },

  home: {
    hero: {
      eyebrow: "Organizational and high-performance consulting",
      title: "High performance *without* the cost to people.",
      lede: "",
      ctaPrimary: "Explore TeamQ",
      ctaSecondary: "Talk to us",
    },
    thesis: {
      text: "Most teams ~leak performance through their environment, not their effort~. Samuh finds where yours is leaking, and gives you the practices to close it.",
    },
    dictionary: {
      word: "Samuh",
      pronunciation: "/səˈmuː/",
      origin: "noun · Sanskrit समूह, samūha",
      definition: "A group of people who come together *for a purpose larger than themselves.*",
    },
    focus: {
      eyebrow: "What makes us different",
      titleOthers: "Where *others* focus",
      titleWe: "Where *we* focus",
      titleAll: "We consider all aspects",
      levels: [
        { name: "Team", label: "Where people experience their work life", note: "Where Samuh works. Goals, feedback, rituals: where capacity is won or lost." },
        { name: "Individual", label: "Where organizations invest", note: "Hiring, coaching, training: one person at a time." },
        { name: "Organization", label: "Where organizations look", note: "Strategy, structure, culture: the whole at once." },
      ],
      capacities: [
        { name: "Cognitive", note: "Judgment and focus that hold under load." },
        { name: "Relational", note: "Trust, feedback and how decisions get made." },
        { name: "Emotional", note: "Energy, and the will to keep going." },
        { name: "Physical", note: "The stamina the other three depend on." },
      ],
    },
    tool: {
      kicker: "TeamQ",
      title: "Find out where your team is leaking",
      pitch: "",
      cta: "Get your team’s assessment",
    },
    cards: {
      kicker: "Which team are you?",
      title: "Metaphor cards",
      question: "How does this relate to your team?",
      thanks: "Shared, thank you. A person reads these. If this one hit home, *talk to us*.",
      share: "Share anonymously",
      view: "View responses",
      back: "Back to the card",
      next: "View another card",
      items: [
        { name: "In a labyrinth with different maps", line: "Everyone is moving. Nobody is on the same page.", image: "/metaphor/maze.png" },
        { name: "Bottom of the mountain", line: "The summit is agreed. The route is not.", image: "/metaphor/mountain.png" },
      ],
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
        { q: "How do you work with a team?", a: "Three ways. Self-guided, where the team works through the material on its own. Supported, which adds periodic calls with us. Guided, where we deliver in person. The team process is the method in all three, and organization-wide work layers on top of it." },
        { q: "What does it cost?", a: "It depends on the way you work with us and the number of teams. Talk to us and we will put a number on it." },
        { q: "How do we start?", a: "With a TeamQ assessment of your team, which shows where it leaks and what to move first. Explore TeamQ, or write to us and we will take it from there." },
      ],
    },
    start: {
      title: "What could stronger performance look like for your team?",
      sub: "",
      placeholder: "How many people are on your team?",
      startLabel: "Start",
      ctaPrimary: "Explore TeamQ",
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
        { name: "Calina Mircea", role: "Co-Founder & Methodology Lead", bio: "Systemic coach, learning and leadership expert.", photo: "/team/calina-mircea.webp" },
        { name: "Mike Gabour", role: "Co-Founder & CTO", bio: "Global analytics strategy and design leader.", photo: "/team/mike-gabour.webp" },
        { name: "Dr. Tara Thiagarajan", role: "Chief Scientific Advisor", bio: "Founder, Sapien Labs. Ph.D., Stanford.", photo: "/team/tara-thiagarajan.webp" },
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
      ctaPrimary: "Explore TeamQ",
      ctaSecondary: "Ways to engage",
    },
  },

  solutions: {
    head: {
      kicker: "Three ways to engage",
      title: "Same process, three levels of support.",
      lede: "One methodology, the team process, delivered with as much or as little of us in the room as the team needs. Organization-wide work layers on top of it.",
    },
    tiers: {
      kicker: "Side by side",
      title: "The three tiers",
      items: [
        { tag: "Tier 01", name: "Self-guided", what: "Fully automated. The team works through the material on its own.", who: "Teams with a strong leader who want the method without the meetings, and organizations rolling it out across many teams.", get: "The team process, the baseline and the re-measure, and the material to run one ritual for ninety days." },
        { tag: "Tier 02", name: "Supported", what: "Self-guided plus periodic support calls from the Samuh team.", who: "Teams that want a second pair of eyes at the moments that matter: choosing the practice, and the check-in at day 45.", get: "Everything in Self-guided, with scheduled calls to read the data together and keep the ritual on track." },
        { tag: "Tier 03", name: "Guided", what: "In person. The Samuh team delivers the work hands on.", who: "Leadership teams and mission-critical teams where the stakes justify having us in the room.", get: "Confidential interviews, a facilitated day one, coaching for two ritual keepers every two weeks, and the close." },
      ],
      rowWhat: "What it is",
      rowWho: "Who it is for",
      rowGet: "What you get",
      rows: [
        { label: "Support calls", a: "Not included", b: "Scheduled", c: "Ongoing" },
        { label: "In-person delivery", a: "Not included", b: "Not included", c: "Included" },
        { label: "TeamQ baseline and re-measure", a: "Included", b: "Included", c: "Included" },
        { label: "Ritual keeper coaching", a: "Self-directed", b: "At check-ins", c: "Every two weeks" },
      ],
      note: "Organization-wide engagements layer on top of the team process, not beside it.",
    },
    carte: {
      kicker: "À la carte",
      title: "Or take one piece at a time.",
      lede: "Not every team is ready for a full sprint. Each part of the work stands on its own, so you can start where the need is and add the rest when it is earned.",
      ask: "Ask about this",
      items: [
        { tag: "Builds belief", name: "Immersive keynote", what: "A session that reframes team performance through the science of capacity, with an experience of one foundational team practice.", who: "Leadership offsites, summits and all-hands, where belief has to come before anything else.", format: "60 to 90 minutes. In person or virtual." },
        { tag: "Builds belief", name: "Executive lab", what: "A working session on the science of capacity to perform, and why the team is the central point of impact.", who: "Senior teams exploring the frontier before committing a team to a sprint.", format: "Half a day, in person." },
        { tag: "Builds capability", name: "Leadership workshop", what: "Insights, assessment and an experience of the high-performance practices that strengthen the conditions for team performance.", who: "Groups of leaders who run teams and want the practices, not only the argument.", format: "One day, in person." },
        { tag: "Measures", name: "Discovery and TeamQ baseline", what: "Confidential one-to-one interviews and a TeamQ baseline, read back to the team as evidence rather than opinion.", who: "A team that wants to see itself clearly before deciding what, if anything, to change.", format: "About one month." },
        { tag: "Builds team performance", name: "Ritual co-creation day", what: "The team reviews its findings, agrees what better looks like, and designs the one practice it will own.", who: "Teams that already have a baseline and want to turn it into a practice.", format: "One day, facilitated, in person." },
        { tag: "Builds team performance", name: "Ritual keeper coaching", what: "Two team members are coached to refine and embed the ritual inside the team's regular work.", who: "Teams running a practice that want it to hold past the first month.", format: "Every two weeks, virtual, for ninety days." },
        { tag: "Measures", name: "Check-in and re-measure", what: "A day-45 check-in to adjust the practice, then a day-90 re-measure with TeamQ against the team's own baseline, and the close.", who: "Teams that ran the practice on their own and want the change measured.", format: "Two 90-minute virtual sessions." },
        { tag: "Builds systemic capability", name: "Organization capacity map", what: "OrgQ shows where capacity is leaking across many teams and where the biggest gains may come from, then a repeatable system for rolling the team process out.", who: "CHROs, CEOs and transformation leaders working across a multi-team organization.", format: "Scoped per organization." },
      ],
      note: "Every piece runs on the same foundation: measurement first, practices the team owns, change inside the flow of work. The sprint in the tiers above is Discovery, the co-creation day, the coaching and the re-measure, assembled.",
    },
    talk: {
      kicker: "Talk to us",
      title: "Tell us which one, and where to reach you",
      button: "Talk to us",
      note: "A person replies. Tagged {tier}, so we come prepared.",
      thanks: "Thank you. We’ll be in touch about {tier}.",
      wait: "Read about the team process while you wait",
    },
    voices: {
      kicker: "Trust before proof",
      title: "What teams say",
    },
  },

  contact: {
    head: {
      kicker: "Contact",
      title: "Let’s talk, human to human.",
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
export type ContactContent = SiteContent["contact"];
export type TeamQContent = SiteContent["teamq"];
export type InsightsContent = SiteContent["insights"];
