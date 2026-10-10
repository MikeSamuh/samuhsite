// The TeamQ teaser's inputs: the ten factors and the demo team's baseline.
//
// Follows the SAMUH dashboard, github.com/jerzybala/samuh-dashboard at
// commit 53eb9f8, the v2 dashboard in samuh/ and static_samuh/: the survey
// questions it reads, the 1 to 9 scale it shows every factor on, lifestyle
// included, and the models it scores with. This file is safe to send to the
// browser. The scoring is not here: it lives in src/lib/teaser/score.ts and
// runs on the server, behind /api/teaser.
//
// See CLAUDE.md rule 4: the teaser demonstrates how TeamQ thinks, on a demo
// team. It is not a TeamQ result for the visitor's team.

export interface Factor {
  /** the model's feature name, and the key in a lead's `answers` */
  id: string;
  /** the dashboard's label: samuh/data_loader.py WORK_FACTOR_LABELS and
   *  samuh/optimize.py LIFESTYLE_LABELS */
  label: string;
  group: "environment" | "lifestyle";
  min: number;
  max: number;
  step: 1;
}

/** Every factor on the dashboard's 1 to 9 scale, in whole steps. The two
 *  lifestyle questions have five answers in the survey; the dashboard shows
 *  them on the same axis as the work factors, 1, 3, 5, 7 and 9 being the
 *  five answers (static_samuh/js/samuh.js, 2v - 1), and so does this. */
export const FACTORS: Factor[] = [
  { id: "work_control_time", label: "Flexibility over Time", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_amount", label: "Workload", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_purpose", label: "Pride & Purpose", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_learning", label: "Learning & Growth", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_colleagues", label: "Relationship with Colleagues", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_manager", label: "Relationship with Manager", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_informed", label: "Flow of Information", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_recognition", label: "Reward & Recognition", group: "environment", min: 1, max: 9, step: 1 },
  { id: "exercise_freq_ord", label: "Exercise", group: "lifestyle", min: 1, max: 9, step: 1 },
  { id: "UPF_freq_ord", label: "Healthy Diet", group: "lifestyle", min: 1, max: 9, step: 1 },
];

// The survey behind the sample also asks about flexibility over how people
// do their work, and about sleep. The dashboard shows both but its models
// take neither, so a slider for either would move nothing. Left out. Job
// Security, which the models do take, is no longer asked: the dashboard
// holds it at its default (data/feature_config.json), and so does
// score.ts.

/** The dashboard's group headings, samuh.js. */
export const GROUP_LABELS: Record<Factor["group"], string> = {
  environment: "Work Environment",
  lifestyle: "Lifestyle Factors",
};

/** The five answers behind each lifestyle slider, at 1, 3, 5, 7 and 9
 *  (samuh/data_loader.py EXERCISE_ORD and UPF_ORD). */
export const LIFESTYLE_ANSWERS: Record<string, string[]> = {
  exercise_freq_ord: ["Rarely or never", "Less than once a week", "Once a week", "A few days a week", "Every day"],
  // the survey asks how often people eat processed, packaged or fast food;
  // the dashboard turns the answer round so that higher is healthier
  UPF_freq_ord: ["Several times a day", "Once a day", "A few times a week", "A few times a month", "Rarely or never"],
};

/** The one-line reading aid under each lifestyle slider. */
export const LIFESTYLE_HINTS: Record<string, string> = {
  exercise_freq_ord: "1 is rarely or never, 9 is every day",
  UPF_freq_ord: "How rarely people eat ultra-processed food. 1 is several times a day, 9 is rarely or never",
};

/** The demo team's averages: the 20 rows of the dashboard repo's
 *  training/data/sample/new_sample_20.csv, one mean per factor, on the 1 to
 *  9 scale. Computed once; the CSV is not shipped. Each names the CSV
 *  column it came from, mapped by samuh/data_loader.py WORK_FACTOR_MAP and
 *  LIFESTYLE_MAP. All ten mapped; none were guessed. The dashboard shows
 *  these as the bar lengths on its factors chart. */
export const BASELINE_AVERAGES: Record<string, number> = {
  // "Please rate how much control and flexibility you have over your time
  // (e.g. to leave work to take care of a personal matter)"
  work_control_time: 5.3,
  // "Please rate how you feel about the amount of work you have to do"
  work_amount: 5.95,
  // "Please rate how you feel about the nature of your work"
  work_purpose: 6.2,
  // "Please rate how you feel about learning and growth opportunities at work"
  work_learning: 5.65,
  // "Please rate the nature of your social relationships with your work colleagues"
  work_colleagues: 6.15,
  // "Please rate the nature of your relationship with your manager or supervisor"
  work_manager: 5.95,
  // "Please rate how informed you feel about what is going on in your team"
  work_informed: 6.0,
  // "Please rate how you perceive your work is valued and recognized"
  work_recognition: 5.9,
  // "How regularly do you engage in physical exercise (30 minutes or more)?"
  // Answers mapped to 1 to 5 by EXERCISE_ORD, mean 2.7, shown as 2v - 1
  exercise_freq_ord: 4.4,
  // "How often do you eat processed, packaged, or fast food that is not made
  // from fresh ingredients?" Answers mapped to 1 to 5 by UPF_ORD, which
  // inverts them so that "Rarely/Never" is 5; mean 3.65, shown as 2v - 1
  UPF_freq_ord: 6.3,
};

/** Where every input starts and where Reset returns to: the averages above
 *  rounded to the slider's whole step. */
export const BASELINE: Record<string, number> = {
  work_control_time: 5,
  work_amount: 6,
  work_purpose: 6,
  work_learning: 6,
  work_colleagues: 6,
  work_manager: 6,
  work_informed: 6,
  work_recognition: 6,
  exercise_freq_ord: 4,
  UPF_freq_ord: 6,
};

/** How many people are in the demo team. */
export const TEAM_SIZE = 20;

/** How many factors the model moves when it shows the factors optimized. */
export const OPTIMIZER_MOVES = 3;

/** True because the scoring behind /api/teaser returns the dashboard's own
 *  numbers: see the check recorded in src/lib/teaser/score.ts. If that ever
 *  stops being so, set this false and the teaser renders no number anywhere. */
export const MODEL_VERIFIED: boolean = true;
