// The dashboard's scoring, run on our server for the TeamQ teaser.
//
// A copy of github.com/jerzybala/samuh-dashboard at commit 53eb9f8: the v2
// dashboard in samuh/, with the "Western Countries" models (models_west, its
// default), on the demonstration team only. Jerzy's maths, our file. Nothing
// is tuned, simplified or approximated.
//
//   models.json   the two LightGBM models, mhq_model.pkl and
//                 unproductive_days_model.pkl, exported tree for tree with
//                 booster.dump_model() at commit 53eb9f8
//   TEAM          the 20 rows of training/data/sample/new_sample_20.csv as
//                 samuh/data_loader.py reads them: the eight work answers,
//                 the two lifestyle answers on the survey's 1 to 5, and what
//                 each person reported for MHQ and days lost
//   score()       what /api/samuh/simulate does (samuh/simulate.py): shift
//                 every row by the slider's distance from the team average,
//                 clip, predict each row, average, and take the change from
//                 the unshifted team. The change is added to what the team
//                 measured, the dashboard's rule for every headline figure
//                 (docs/metrics_and_anchoring.md: target = observed + Δ)
//
// Checked against the dashboard's own code on 10 Oct 2026: the
// apply_team_deltas and predict_targets_batch that samuh.simulate runs, on
// the same rows, with the team averages held at BASELINE, on 37 slider
// settings (the baseline, every factor at each end, both lifestyle factors
// at each end together, every factor at its best, a half-step lifestyle
// move, and 12 random). The MHQ and productive-day changes differed by less
// than 1e-13, which is floating point summation order. The three moves
// bestForProductiveDays picks matched samuh.optimize's sweep over the same
// factors, to the same change in days.
//
// Server only. The models and the team rows are never sent to the browser.
// Import this from a route handler or a server component, nowhere else.

import { BASELINE, FACTORS, type Factor } from "@/components/teamq-teaser/model";
import models from "./models.json";

interface Tree {
  /** split feature index, per internal node */
  f: number[];
  /** split threshold: go left when the value is <= it */
  t: number[];
  /** left and right child. Zero or more is a node, negative is leaf -(n + 1) */
  l: number[];
  r: number[];
  /** leaf values */
  v: number[];
  root: number;
}

/** The models take eleven inputs (models.json "features"). Job Security is
 *  the one the survey no longer asks. The dashboard feeds its default, 5
 *  (data/feature_config.json, via samuh/optimize.py _extract_v1_team), so
 *  this does too, at the position the models expect it. */
const JOB_SECURITY = { index: 1, value: 5 };

const LIFESTYLE = new Set(["exercise_freq_ord", "UPF_freq_ord"]);

/** A slider value as the models take it: the two lifestyle sliders' 1 to 9
 *  back to the survey's 1 to 5 (samuh.js _lifeDispToOrd). */
const toModel = (factor: Factor, value: number) => (LIFESTYLE.has(factor.id) ? (value + 1) / 2 : value);

/** The range the models were trained on, per factor. */
const modelBounds = (factor: Factor): [number, number] => (LIFESTYLE.has(factor.id) ? [1, 5] : [factor.min, factor.max]);

interface Member {
  /** answers in FACTORS order, lifestyle on the survey's 1 to 5 */
  a: number[];
  /** "Overall MHQ" */
  mhq: number;
  /** days unable to work plus days with reduced output, in the past month */
  lost: number;
}

/** One row per team member. */
const TEAM: Member[] = [
  { a: [6, 8, 4, 5, 8, 8, 7, 7, 4, 3], mhq: 54.2, lost: 4 },
  { a: [5, 5, 5, 5, 5, 5, 9, 9, 4, 4], mhq: -46.9, lost: 23 },
  { a: [8, 8, 8, 7, 8, 7, 8, 8, 5, 5], mhq: 30.2, lost: 0 },
  { a: [7, 6, 8, 8, 8, 8, 7, 6, 4, 4], mhq: 128.5, lost: 0 },
  { a: [4, 7, 8, 9, 4, 4, 4, 8, 1, 3], mhq: -15.4, lost: 0 },
  { a: [6, 6, 7, 5, 4, 5, 3, 2, 4, 5], mhq: 58.4, lost: 2 },
  { a: [4, 7, 7, 3, 4, 5, 4, 1, 1, 3], mhq: 143.0, lost: 30 },
  { a: [3, 5, 5, 6, 8, 6, 7, 8, 4, 4], mhq: 121.7, lost: 0 },
  { a: [7, 5, 5, 2, 4, 5, 5, 4, 3, 3], mhq: -16.3, lost: 30 },
  { a: [4, 5, 5, 4, 5, 5, 5, 5, 4, 4], mhq: 135.4, lost: 8 },
  { a: [5, 9, 8, 8, 7, 5, 7, 8, 5, 3], mhq: 129.3, lost: 2 },
  { a: [8, 8, 6, 6, 9, 7, 7, 5, 2, 3], mhq: 154.9, lost: 2 },
  { a: [5, 8, 6, 1, 7, 5, 5, 5, 2, 3], mhq: 137.6, lost: 28 },
  { a: [5, 9, 9, 9, 9, 9, 9, 9, 1, 5], mhq: 152.9, lost: 2 },
  { a: [5, 6, 7, 7, 8, 8, 8, 7, 2, 5], mhq: 139.9, lost: 6 },
  { a: [4, 1, 3, 4, 2, 1, 3, 3, 1, 3], mhq: -71.0, lost: 29 },
  { a: [3, 5, 3, 3, 5, 4, 3, 4, 1, 4], mhq: 106.8, lost: 5 },
  { a: [8, 5, 7, 5, 9, 9, 7, 8, 1, 4], mhq: 154.4, lost: 0 },
  { a: [4, 1, 4, 7, 4, 4, 5, 4, 1, 3], mhq: -38.5, lost: 38 },
  { a: [5, 5, 9, 9, 5, 9, 7, 7, 4, 2], mhq: 91.6, lost: 0 },
];

/** The dashboard's working days in a month (samuh/overview.py). */
const WORKING_DAYS = 22;

const mean = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0) / numbers.length;

/** What the team measured, as the dashboard's arcs show it
 *  (samuh/overview.py): the mean MHQ, and the working days less the mean
 *  days lost. The figures every change is added to. */
const OBSERVED = {
  mhq: mean(TEAM.map((member) => member.mhq)),
  days: WORKING_DAYS - mean(TEAM.map((member) => member.lost)),
};

function predict(trees: Tree[], row: number[]): number {
  let sum = 0;
  for (const tree of trees) {
    let node = tree.root;
    while (node >= 0) {
      node = row[tree.f[node]] <= tree.t[node] ? tree.l[node] : tree.r[node];
    }
    sum += tree.v[-node - 1];
  }
  return sum;
}

/** A member's answers as a model row: Job Security slotted in at its default. */
function modelRow(answers: number[]): number[] {
  const row = [...answers];
  row.splice(JOB_SECURITY.index, 0, JOB_SECURITY.value);
  return row;
}

/** team.py apply_team_deltas(): every member moves by the same amount the
 *  slider moved from the team average, and stays on the scale. */
function shiftedTeam(values: Record<string, number>): number[][] {
  return TEAM.map((member) =>
    modelRow(
      member.a.map((answer, column) => {
        const factor = FACTORS[column];
        const delta = toModel(factor, values[factor.id]) - toModel(factor, BASELINE[factor.id]);
        if (delta === 0) return answer;
        const [lo, hi] = modelBounds(factor);
        return Math.max(lo, Math.min(hi, answer + delta));
      }),
    ),
  );
}

/** The models' view of the unshifted team: the baseline every change is
 *  measured from. Computed once. */
const base = shiftedTeam(BASELINE);
const BASE_MHQ = mean(base.map((row) => predict(models.mhq, row)));
const BASE_UNPROD = mean(base.map((row) => predict(models.unprod, row)));

export interface TeaserScore {
  /** "Capacity to perform": the team's measured MHQ, plus the predicted change */
  mhq: number;
  /** productive days a month: the team's measured productive days, plus the
   *  predicted change */
  days: number;
}

/** `values` is one number per factor id, each within that factor's range. */
export function score(values: Record<string, number>): TeaserScore {
  const team = shiftedTeam(values);
  const deltaMhq = mean(team.map((row) => predict(models.mhq, row))) - BASE_MHQ;
  const deltaUnprod = mean(team.map((row) => predict(models.unprod, row))) - BASE_UNPROD;
  return {
    mhq: OBSERVED.mhq + deltaMhq,
    days: OBSERVED.days - deltaUnprod,
  };
}

/** The answer to "show me the factors optimized": which `k` factors, moved
 *  to which values, give this team the most productive days. The same
 *  search the dashboard's Optimize runs for its productivity goal
 *  (optimization.py candidate_levels and sweep_levers_team): every
 *  combination of k factors, each at its current value, its maximum, or
 *  7 (work factors only). */
export interface Answer {
  values: Record<string, number>;
  levers: { id: string; label: string; value: number }[];
  score: TeaserScore;
}

/** `cap` is the highest level the search may use; the full scale by default */
function candidateLevels(factor: Factor, current: number, cap: number): number[] {
  const top = Math.min(cap, factor.max);
  const levels = new Set([current, Math.max(current, top)]);
  if (!LIFESTYLE.has(factor.id)) levels.add(Math.min(Math.max(7, current), top));
  return [...levels];
}

function combinations<T>(items: T[], k: number): T[][] {
  if (k === 0) return [[]];
  return items.flatMap((item, index) =>
    combinations(items.slice(index + 1), k - 1).map((rest) => [item, ...rest]),
  );
}

let cached: Map<string, Answer> | undefined;

/** `cap` limits how far any lever may be pushed: the home demo asks for 7,
 *  so it never shows a factor at the ceiling */
export function bestForProductiveDays(k = 3, cap = 9): Answer {
  cached ??= new Map();
  const key = `${k}:${cap}`;
  const hit = cached.get(key);
  if (hit) return hit;

  let best: Answer | undefined;
  for (const levers of combinations(FACTORS, k)) {
    const levels = levers.map((factor) => candidateLevels(factor, BASELINE[factor.id], cap));
    const tuples = levels.reduce<number[][]>(
      (acc, options) => acc.flatMap((tuple) => options.map((option) => [...tuple, option])),
      [[]],
    );
    for (const tuple of tuples) {
      const values = { ...BASELINE };
      levers.forEach((factor, index) => {
        values[factor.id] = tuple[index];
      });
      const scored = score(values);
      if (!best || scored.days > best.score.days) {
        best = {
          values,
          levers: levers
            .map((factor, index) => ({ id: factor.id, label: factor.label, value: tuple[index] }))
            .filter((lever) => lever.value !== BASELINE[lever.id]),
          score: scored,
        };
      }
    }
  }
  if (!best) throw new Error("bestForProductiveDays: nothing searched");
  cached.set(key, best);
  return best;
}
