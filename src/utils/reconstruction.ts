import type { JournalEntry, ReconstructionRow } from "../types";

export function buildReconstructionRows(entries: JournalEntry[]): ReconstructionRow[] {
  return entries.flatMap((entry) =>
    entry.lineItems.map((lineItem) => ({
      id: `${entry.id}-${lineItem.id}`,
      date: entry.date,
      reference: entry.reference,
      accountNumber: lineItem.dimensions.accountNumber,
      debit: lineItem.side === "debit" ? Number(lineItem.amount.toFixed(2)) : null,
      credit: lineItem.side === "credit" ? Number(lineItem.amount.toFixed(2)) : null
    }))
  );
}
