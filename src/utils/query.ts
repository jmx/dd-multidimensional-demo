import type { JournalEntry, JournalLineItem } from "../types";

export type QueryToken = {
  field: string | null;
  value: string;
};

export type QueryMatch = {
  entry: JournalEntry;
  lineItem: JournalLineItem;
};

function parseToken(raw: string): QueryToken | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const [field, ...rest] = trimmed.split(":");
  if (rest.length === 0) {
    return { field: null, value: field.toLowerCase() };
  }
  return { field: field.toLowerCase(), value: rest.join(":").toLowerCase() };
}

export function parseQuery(input: string): QueryToken[] {
  return input
    .split(/\s+/)
    .map(parseToken)
    .filter((token): token is QueryToken => token !== null);
}

function matchToken(entry: JournalEntry, lineItem: JournalLineItem, token: QueryToken): boolean {
  const { field, value } = token;
  if (!field) {
    const haystack = [
      entry.reference,
      entry.date ?? "",
      lineItem.dimensions.accountNumber,
      ...Object.entries(lineItem.dimensions).map(([key, dimValue]) => `${key}:${dimValue}`)
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(value);
  }

  if (field === "account" || field === "accountnumber") {
    return lineItem.dimensions.accountNumber.toLowerCase().includes(value);
  }

  if (field === "reference") {
    return entry.reference.toLowerCase().includes(value);
  }

  if (field === "date") {
    return (entry.date ?? "").includes(value);
  }

  const dimensionValue = lineItem.dimensions[field as keyof typeof lineItem.dimensions];
  if (dimensionValue) {
    return dimensionValue.toLowerCase().includes(value);
  }

  return false;
}

export function executeQuery(entries: JournalEntry[], queryText: string): QueryMatch[] {
  const tokens = parseQuery(queryText);
  if (tokens.length === 0) {
    return entries.flatMap((entry) => entry.lineItems.map((lineItem) => ({ entry, lineItem })));
  }

  return entries.flatMap((entry) =>
    entry.lineItems
      .filter((lineItem) => tokens.every((token) => matchToken(entry, lineItem, token)))
      .map((lineItem) => ({ entry, lineItem }))
  );
}

export function sumMatches(matches: QueryMatch[]): { debit: number; credit: number } {
  return matches.reduce(
    (accumulator, { lineItem }) => {
      if (lineItem.side === "debit") {
        accumulator.debit += lineItem.amount;
      } else {
        accumulator.credit += lineItem.amount;
      }
      return accumulator;
    },
    { debit: 0, credit: 0 }
  );
}
