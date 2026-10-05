// The TeamQ teaser's inputs: the eleven factors and the demo team's baseline.
//
// Copied from the simulator, github.com/jerzybala/samuh-dashboard, as it runs
// at workforce-wellbeing-simulator2-production.up.railway.app. This file is
// safe to send to the browser. The scoring is not here: it lives in
// src/lib/teaser/score.ts and runs on the server, behind /api/teaser.
//
// See CLAUDE.md rule 4: the teaser demonstrates how TeamQ thinks, on a demo
// team. It is not a TeamQ result for the visitor's team.

export interface Factor {
  /** the simulator's feature name, and the key in a lead's `answers` */
  id: string;
  /** exactly as the simulator shows it */
  label: string;
  group: "environment" | "lifestyle";
  min: number;
  max: number;
  step: 1;
}

/** The simulator's /api/features-config: labels, ranges and whole steps. */
export const FACTORS: Factor[] = [
  { id: "work_control_time", label: "Work-Life Balance", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_control_job", label: "Job Security", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_amount", label: "Manageable Workload", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_purpose", label: "Pride & Purpose", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_learning", label: "Learning & Growth", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_colleagues", label: "Relationship with Colleagues", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_manager", label: "Relationship with Manager", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_informed", label: "Flow of Information", group: "environment", min: 1, max: 9, step: 1 },
  { id: "work_recognition", label: "Reward & Recognition", group: "environment", min: 1, max: 9, step: 1 },
  { id: "exercise_freq_ord", label: "Exercise", group: "lifestyle", min: 1, max: 5, step: 1 },
  { id: "UPF_freq_ord", label: "Ultra-Processed Food", group: "lifestyle", min: 1, max: 5, step: 1 },
];

/** The simulator's group headings. */
export const GROUP_LABELS: Record<Factor["group"], string> = {
  environment: "Work Environment",
  lifestyle: "Lifestyle Factors",
};

/** What the two lifestyle scales mean, as the simulator lists them. The
 *  first label is 1. */
export const LIFESTYLE_OPTIONS: Record<string, string[]> = {
  exercise_freq_ord: ["Rarely/Never", "Less than once a week", "Once a week", "Few days a week", "Everyday"],
  // inverted: the survey asks how often, and the scale runs from most often
  // (1) to least often (5), so higher is healthier
  UPF_freq_ord: ["Several times a day", "Once a day", "Several days a week", "A few times a month", "Rarely/Never"],
};

/** The simulator's one-line reading aid under each lifestyle input. */
export const LIFESTYLE_HINTS: Record<string, string> = {
  exercise_freq_ord: "Higher = more frequent exercise",
  UPF_freq_ord: "Higher = healthier (less UPF)",
};

/** The demo team's averages: the 18 rows of
 *  "Reference material/Simulator Dummy Data (1).csv", one mean per factor.
 *  Computed once. The CSV is not shipped. Each names the CSV column it came
 *  from, mapped by the simulator's config.py CEN_COLUMN_MAP. All eleven
 *  mapped; none were guessed. The simulator shows these as "Baseline avg". */
export const BASELINE_AVERAGES: Record<string, number> = {
  // "Please rate how much control and flexibility you have over your time
  // (e.g. to leave work to take care of a personal matter)"
  work_control_time: 7.277777777777778,
  // "Please rate how safe and secure you feel in your job"
  work_control_job: 6.888888888888889,
  // "Please rate how you feel about the amount of work you have to do"
  work_amount: 4.722222222222222,
  // "Please rate how you feel about the nature of your work"
  work_purpose: 8.0,
  // "Please rate how you feel about learning and growth opportunities at work"
  work_learning: 7.555555555555555,
  // "Please rate the nature of your social relationships with your work colleagues"
  work_colleagues: 6.055555555555555,
  // "Please rate the nature of your relationship with your manager or supervisor"
  work_manager: 7.611111111111111,
  // "Please rate how informed you feel about what is going on in your team"
  work_informed: 5.944444444444445,
  // "Please rate how you perceive your work is valued and recognized"
  work_recognition: 6.333333333333333,
  // "How regularly do you engage in physical exercise (30 minutes or more)?"
  // Text answers mapped by config.py EXERCISE_TEXT_TO_ORD
  exercise_freq_ord: 4.166666666666667,
  // "How often do you eat processed, packaged, or fast food that is not made
  // from fresh ingredients?" Text answers mapped by config.py UPF_TEXT_TO_ORD,
  // which inverts them: "Several times a day" is 1, "Rarely/never" is 5
  UPF_freq_ord: 4.222222222222222,
};

// The CSV also has "Please rate how much control and flexibility you have
// over how you do your work". The simulator does not use it, so neither do we.

/** Where every input starts and where Reset returns to: the averages above
 *  rounded to the step, exactly as the simulator's /api/upload-csv returns
 *  them in team_averages. */
export const BASELINE: Record<string, number> = {
  work_control_time: 7,
  work_control_job: 7,
  work_amount: 5,
  work_purpose: 8,
  work_learning: 8,
  work_colleagues: 6,
  work_manager: 8,
  work_informed: 6,
  work_recognition: 6,
  exercise_freq_ord: 4,
  UPF_freq_ord: 4,
};

/** How many people are in the demo team. */
export const TEAM_SIZE = 18;

/** True because the scoring behind /api/teaser returns the simulator's own
 *  numbers: see the check recorded in src/lib/teaser/score.ts. If that ever
 *  stops being so, set this false and the teaser renders no number anywhere. */
export const MODEL_VERIFIED: boolean = true;
