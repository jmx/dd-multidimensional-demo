import { accountMap, accounts } from "../data/accounts";
import type { Booking, BookingPosition, JournalEntry, JournalLineItem } from "../types";
import { generateId } from "./id";

function normalizeAmount(position: BookingPosition): number | null {
  if (typeof position.amount === "number" && !Number.isNaN(position.amount)) {
    return position.amount;
  }
  return null;
}

function createLineItem(position: BookingPosition, amount: number): JournalLineItem | null {
  if (!position.accountNumber) return null;
  const account = accountMap.get(position.accountNumber);
  if (!account) return null;

  return {
    id: generateId(),
    amount,
    side: position.side,
    dimensions: {
      ...account.dimensions,
      accountNumber: account.number
    }
  };
}

function findVatAccount(vatValue: string, targetClass: "asset" | "liability") {
  return accounts.find((candidate) => {
    const { dimensions } = candidate;
    return dimensions.vat === vatValue && dimensions.class === targetClass;
  });
}

function applyVatLogic(position: BookingPosition, lineItem: JournalLineItem): JournalLineItem[] {
  const vatValue = lineItem.dimensions.vat;
  const entryClass = lineItem.dimensions.class;

  if (!vatValue || !entryClass || (entryClass !== "expense" && entryClass !== "revenue")) {
    return [lineItem];
  }

  const vatRate = Number(vatValue);
  if (!Number.isFinite(vatRate) || vatRate <= 0) {
    return [lineItem];
  }

  const grossAmount = lineItem.amount;
  const netAmount = Number((grossAmount / (1 + vatRate / 100)).toFixed(2));
  const vatAmount = Number((grossAmount - netAmount).toFixed(2));

  const updatedLineItem: JournalLineItem = {
    ...lineItem,
    amount: netAmount
  };

  const vatClass = entryClass === "expense" ? "asset" : "liability";
  const vatAccount = findVatAccount(vatValue, vatClass);

  const vatLineItem: JournalLineItem = {
    id: generateId(),
    amount: vatAmount,
    side: position.side,
    dimensions: {
      ...lineItem.dimensions,
      class: vatClass,
      accountNumber: vatAccount?.number ?? lineItem.dimensions.accountNumber
    }
  };

  return vatAmount > 0 ? [updatedLineItem, vatLineItem] : [updatedLineItem];
}

export function buildJournalEntries(bookings: Booking[]): JournalEntry[] {
  return bookings
    .map((booking) => {
      const lineItems = booking.positions
        .map((position) => {
          const amount = normalizeAmount(position);
          if (amount === null) return [] as JournalLineItem[];
          const baseLine = createLineItem(position, amount);
          if (!baseLine) return [] as JournalLineItem[];
          return applyVatLogic(position, baseLine);
        })
        .flat();

      if (lineItems.length === 0) {
        return null;
      }

      return {
        id: booking.id,
        date: booking.date,
        reference: booking.reference,
        lineItems
      } satisfies JournalEntry;
    })
    .filter((entry): entry is JournalEntry => entry !== null);
}
