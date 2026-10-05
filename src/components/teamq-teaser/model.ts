// The TeamQ teaser's model: the eleven inputs, the demo team's baseline, and
// the scoring.
//
// Ported from the simulator, github.com/jerzybala/samuh-dashboard, at commit
// 53eb9f8360376bf647aa0e5954d76d535c54d4ac. Jerzy's maths, our file. Nothing
// here is tuned, simplified or approximated.
//
// What is ported, and what is not:
//
//   teamQ()  PORTED. team.py, compute_teamq(): a SHAP-weighted, normalized
//            average of the eleven factors, scaled 0 to 100. Closed form.
//            Checked against the Railway app's /api/predict-batch for the
//            baseline and for one moved slider: identical to every decimal.
//
//   score()  NOT PORTED. MHQ and productive days come from two trained
//            LightGBM models (models_west/mhq_model.pkl and
//            unproductive_days_model.pkl), run on every row of the team and
//            averaged (samuh/simulate.py, prediction.py). That is not a
//            closed-form calculation, so it is not approximated here. It
//            stays a stub until we decide how to reach the real models.
//
// See CLAUDE.md rule 4: this demonstrates how TeamQ thinks. It is not a
// TeamQ result for the visitor's team.

export interface Factor {
  /** the simulator's feature name, and the key in a lead's `answers` */
  id: string;
  /** exactly as the simulator shows it */
  label: string;
  group: "environment" | "lifestyle";
  min: number;
  max: number;
  step: number;
}

/** From data/feature_config.json. The simulator steps every input by 0.1,
 *  because in team mode a slider is the team's average, not one answer. */
export const FACTORS: Factor[] = [
  { id: "work_control_time", label: "Work-Life Balance", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "work_control_job", label: "Job Security", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "work_amount", label: "Manageable Workload", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "work_purpose", label: "Pride & Purpose", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "work_learning", label: "Learning & Growth", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "work_colleagues", label: "Relationship with Colleagues", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "work_manager", label: "Relationship with Manager", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "work_informed", label: "Flow of Information", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "work_recognition", label: "Reward & Recognition", group: "environment", min: 1, max: 9, step: 0.1 },
  { id: "exercise_freq_ord", label: "Exercise", group: "lifestyle", min: 1, max: 5, step: 0.1 },
  { id: "UPF_freq_ord", label: "Ultra-Processed Food", group: "lifestyle", min: 1, max: 5, step: 0.1 },
];

/** What the two lifestyle scales mean, from config.py. Index 0 is 1. */
export const LIFESTYLE_LABELS: Record<string, string[]> = {
  exercise_freq_ord: ["Rarely/Never", "Less than once a week", "Once a week", "Few days a week", "Everyday"],
  // inverted: the survey asks how often, and the scale runs from most often
  // (1) to least often (5), so higher is healthier
  UPF_freq_ord: ["Several times a day", "Once a day", "Several days a week", "A few times a month", "Rarely/Never"],
};

/** The demo team: per-factor averages of the 18 rows in
 *  "Reference material/Simulator Dummy Data (1).csv", rounded to the step the
 *  way team.py compute_team_averages() rounds them. Computed once. The CSV
 *  is not shipped. Each value names the CSV column it came from, mapped by
 *  config.py CEN_COLUMN_MAP. All eleven mapped; none were guessed. */
export const BASELINE: Record<string, number> = {
  // "Please rate how much control and flexibility you have over your time
  // (e.g. to leave work to take care of a personal matter)". Raw mean 7.2778
  work_control_time: 7.3,
  // "Please rate how safe and secure you feel in your job". Raw mean 6.8889
  work_control_job: 6.9,
  // "Please rate how you feel about the amount of work you have to do". Raw mean 4.7222
  work_amount: 4.7,
  // "Please rate how you feel about the nature of your work". Raw mean 8.0000
  work_purpose: 8.0,
  // "Please rate how you feel about learning and growth opportunities at work". Raw mean 7.5556
  work_learning: 7.6,
  // "Please rate the nature of your social relationships with your work colleagues". Raw mean 6.0556
  work_colleagues: 6.1,
  // "Please rate the nature of your relationship with your manager or supervisor". Raw mean 7.6111
  work_manager: 7.6,
  // "Please rate how informed you feel about what is going on in your team". Raw mean 5.9444
  work_informed: 5.9,
  // "Please rate how you perceive your work is valued and recognized". Raw mean 6.3333
  work_recognition: 6.3,
  // "How regularly do you engage in physical exercise (30 minutes or more)?"
  // Text answers mapped by config.py EXERCISE_TEXT_TO_ORD. Raw mean 4.1667
  exercise_freq_ord: 4.2,
  // "How often do you eat processed, packaged, or fast food that is not made
  // from fresh ingredients?" Text answers mapped by config.py UPF_TEXT_TO_ORD,
  // which inverts them: "Several times a day" is 1, "Rarely/never" is 5.
  // Raw mean 4.2222
  UPF_freq_ord: 4.2,
};

// The CSV also has "Please rate how much control and flexibility you have
// over how you do your work". The simulator does not use it (see
// docs/flexibility_over_work_gap.md in samuh-dashboard), so neither do we.

/** models_west/shap_weights.json, the simulator's default model source */
const SHAP_WEIGHTS: Record<string, number> = {
  work_control_time: 1.87222,
  work_control_job: 4.499651,
  work_amount: 4.803994,
  work_purpose: 12.692871,
  work_learning: 4.784616,
  work_colleagues: 9.727239,
  work_manager: 0.059643,
  work_informed: 2.024194,
  work_recognition: 9.165092,
  exercise_freq_ord: 8.624633,
  UPF_freq_ord: 8.44791,
};

/** The TeamQ composite, 0 to 100. A line-for-line port of team.py
 *  compute_teamq() at 6033349bf0dcf7f84b542dde4e53c0d5836481ac. */
export function teamQ(values: Record<string, number>): number {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const factor of FACTORS) {
    const value = values[factor.id];
    if (value === undefined) continue;
    const weight = SHAP_WEIGHTS[factor.id] ?? 0;
    if (weight === 0) continue;
    const { min, max } = factor;
    let norm = max !== min ? (value - min) / (max - min) : 0.5;
    norm = Math.max(0, Math.min(1, norm));
    weightedSum += weight * norm;
    weightTotal += weight;
  }
  if (weightTotal === 0) return 0;
  return (weightedSum / weightTotal) * 100;
}

/** True once score() returns the simulator's own numbers. While it is false
 *  the teaser renders no number anywhere. */
export const MODEL_VERIFIED: boolean = false;

/** STUB. TeamQ is real, but MHQ and productive days need the LightGBM
 *  models, and nothing is shown until all three are. See the note at the top
 *  of this file. */
export function score(values: Record<string, number>): { teamQ: number; mhq: number; days: number } {
  void values;
  throw new Error("score() is not ported: MHQ and productive days need the simulator's LightGBM models");
}
