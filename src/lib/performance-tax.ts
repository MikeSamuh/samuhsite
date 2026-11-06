// The performance tax at three team environments, for the home page's
// fourth beat. From the client's sheet "Copy of Samuh Graph Base File",
// MHQ Raw Data Graph, rows 4, 8 and 13 (Wilfred, 6 Nov 2026): the MHQ
// score window, the total days lost plus unproductive per person per
// month (absenteeism plus presenteeism at 0.3), and the annual loss per
// person, which is that month's share of a $115,000 fully loaded payroll
// cost (the sheet's A20). Per person, never the org-wide column, which
// assumes 43,000 employees. Rounded only in the display, never here.
// TODO(content): the source line for the days (the sheet does not name it)

export interface TaxStep {
  /** the sheet's row, for the trail back */
  row: number;
  /** the MHQ score window, as the sheet writes it */
  window: string;
  /** the window's low and high, for the meter */
  from: number;
  to: number;
  /** total days lost plus unproductive, per person, per month */
  days: number;
  /** the annual loss per person, in dollars */
  perPerson: number;
}

export const FULLY_LOADED_COST = 115000;

export const TAX_STEPS: TaxStep[] = [
  { row: 4, window: "-50 to -25", from: -50, to: -25, days: 12.69, perPerson: 48645 },
  { row: 8, window: "50 to 75", from: 50, to: 75, days: 5.61, perPerson: 21505 },
  { row: 13, window: "175 to 200", from: 175, to: 200, days: 1.17, perPerson: 4485 },
];

export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const days = (n: number) => n.toFixed(1);
