// The simulator's scoring, run on our server for the TeamQ teaser.
//
// A copy of github.com/jerzybala/samuh-dashboard, the code behind
// workforce-wellbeing-simulator2-production.up.railway.app, in team mode with
// the "Western Countries" models (models_west, the simulator's default).
// Jerzy's maths, our file. Nothing is tuned, simplified or approximated.
//
//   models.json   the two LightGBM models, mhq_model.pkl and
//                 unproductive_days_model.pkl, exported tree for tree with
//                 booster.dump_model() at commit 53eb9f8
//   TEAM          the 18 rows of "Simulator Dummy Data (1).csv" as the
//                 simulator's /api/upload-csv parses them
//   score()       what the simulator's /api/predict-batch does: shift every
//                 row by the slider's distance from the team average, clip,
//                 predict each row, average
//
// Checked against the live simulator's /api/predict-batch on 5 Oct 2026, on
// 60 slider settings (the baseline, all factors at each end, each factor at
// each end, and 35 random). TeamQ and TeamP were identical. MHQ and
// unproductive days differed by less than 1e-13, which is floating point
// summation order.
//
// Server only. The models and the team rows are never sent to the browser.
// Import this from a route handler or a server component, nowhere else.

import { BASELINE, FACTORS } from "@/components/teamq-teaser/model";
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

/** One row per team member, columns in FACTORS order. */
const TEAM: number[][] = [
  [7, 3, 5, 3, 5, 4, 5, 2, 4, 5, 4],
  [9, 9, 4, 9, 8, 8, 9, 9, 3, 5, 5],
  [9, 8, 4, 9, 6, 6, 9, 9, 9, 4, 5],
  [8, 8, 5, 9, 9, 9, 9, 6, 8, 5, 5],
  [6, 7, 3, 8, 8, 7, 9, 8, 9, 3, 1],
  [7, 8, 7, 9, 9, 5, 8, 7, 7, 4, 5],
  [8, 9, 8, 9, 9, 8, 8, 8, 9, 5, 5],
  [9, 9, 5, 9, 9, 5, 9, 6, 8, 4, 5],
  [6, 6, 1, 5, 5, 7, 3, 2, 2, 4, 5],
  [8, 3, 1, 6, 7, 5, 5, 2, 2, 4, 4],
  [4, 5, 5, 8, 8, 5, 8, 7, 5, 4, 2],
  [9, 6, 4, 8, 6, 5, 7, 5, 5, 4, 4],
  [8, 9, 7, 8, 7, 6, 8, 7, 8, 4, 5],
  [9, 9, 5, 9, 8, 7, 9, 7, 8, 2, 4],
  [8, 5, 5, 9, 9, 5, 7, 6, 8, 4, 4],
  [5, 7, 6, 8, 7, 5, 8, 8, 6, 5, 4],
  [5, 4, 3, 9, 7, 5, 7, 3, 4, 5, 4],
  [6, 9, 7, 9, 9, 7, 9, 5, 9, 4, 5],
];

/** models_west/shap_weights.json */
const SHAP_WEIGHTS_MHQ: Record<string, number> = {
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

/** models_west/shap_weights_unprod.json */
const SHAP_WEIGHTS_UNPROD: Record<string, number> = {
  work_control_time: 0.551952,
  work_control_job: 0.175111,
  work_amount: 0.250114,
  work_purpose: 0.796553,
  work_learning: 0.089304,
  work_colleagues: 0.28817,
  work_manager: 0.105463,
  work_informed: 0.136283,
  work_recognition: 0.581166,
  exercise_freq_ord: 0.496263,
  UPF_freq_ord: 0.075256,
};

/** The simulator's working days in a month (ui.js, WORKING_DAYS). */
const WORKING_DAYS = 22;

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

/** team.py compute_teamq(): a SHAP-weighted, normalized average, 0 to 100. */
function weightedComposite(values: Record<string, number>, weights: Record<string, number>): number {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const factor of FACTORS) {
    const weight = weights[factor.id] ?? 0;
    if (weight === 0) continue;
    const { min, max } = factor;
    let norm = max !== min ? (values[factor.id] - min) / (max - min) : 0.5;
    norm = Math.max(0, Math.min(1, norm));
    weightedSum += weight * norm;
    weightTotal += weight;
  }
  if (weightTotal === 0) return 0;
  return (weightedSum / weightTotal) * 100;
}

/** team.py apply_team_deltas(): every member moves by the same amount the
 *  slider moved from the team average, and stays on the scale. */
function shiftedTeam(values: Record<string, number>): number[][] {
  return TEAM.map((row) =>
    row.map((answer, column) => {
      const factor = FACTORS[column];
      const delta = values[factor.id] - BASELINE[factor.id];
      if (delta === 0) return answer;
      return Math.max(factor.min, Math.min(factor.max, answer + delta));
    }),
  );
}

const mean = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0) / numbers.length;

export interface TeaserScore {
  /** the simulator's headline composite, 0 to 100: the mean of its TeamQ and
   *  TeamP figures, as ui.js renderTeamQ() shows it */
  teamQ: number;
  /** "Capacity to Perform": the team's mean predicted MHQ */
  mhq: number;
  /** productive days a month: working days less the mean predicted
   *  unproductive days */
  days: number;
}

/** `values` is one number per factor id, each within that factor's range. */
export function score(values: Record<string, number>): TeaserScore {
  const team = shiftedTeam(values);
  const avgMhq = mean(team.map((row) => predict(models.mhq, row)));
  const avgUnprod = mean(team.map((row) => predict(models.unprod, row)));
  const teamq = weightedComposite(values, SHAP_WEIGHTS_MHQ);
  const teamp = weightedComposite(values, SHAP_WEIGHTS_UNPROD);
  return {
    teamQ: (teamq + teamp) / 2,
    mhq: avgMhq,
    days: WORKING_DAYS - avgUnprod,
  };
}

/** The challenge's answer: which `k` factors, moved to which values, give
 *  this team the most productive days. The same search the simulator's
 *  Optimize runs for its productivity goal (optimization.py,
 *  candidate_levels and the lever search): every combination of k factors,
 *  each at its current value, 7 (work factors only) or its maximum. */
export interface Answer {
  values: Record<string, number>;
  levers: { id: string; label: string; value: number }[];
  score: TeaserScore;
}

function candidateLevels(id: string, current: number, max: number): number[] {
  const levels = new Set([current, max]);
  if (id !== "exercise_freq_ord" && id !== "UPF_freq_ord") levels.add(Math.min(Math.max(7, current), max));
  return [...levels];
}

function combinations<T>(items: T[], k: number): T[][] {
  if (k === 0) return [[]];
  return items.flatMap((item, index) =>
    combinations(items.slice(index + 1), k - 1).map((rest) => [item, ...rest]),
  );
}

let cached: Map<number, Answer> | undefined;

export function bestForProductiveDays(k = 3): Answer {
  cached ??= new Map();
  const hit = cached.get(k);
  if (hit) return hit;

  let best: Answer | undefined;
  for (const levers of combinations(FACTORS, k)) {
    const levels = levers.map((factor) => candidateLevels(factor.id, BASELINE[factor.id], factor.max));
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
  cached.set(k, best);
  return best;
}
