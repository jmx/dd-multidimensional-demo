import type { Account } from "./data/accounts";

export type BookingSide = "debit" | "credit";

export type BookingPosition = {
  id: string;
  accountNumber: string | null;
  side: BookingSide;
  amount: number | "";
};

export type Booking = {
  id: string;
  date: string | null;
  reference: string;
  positions: BookingPosition[];
};

export type JournalLineItem = {
  id: string;
  amount: number;
  side: BookingSide;
  dimensions: Account["dimensions"] & { accountNumber: string };
};

export type JournalEntry = {
  id: string;
  date: string | null;
  reference: string;
  lineItems: JournalLineItem[];
};

export type ReconstructionRow = {
  id: string;
  date: string | null;
  reference: string;
  accountNumber: string;
  debit: number | null;
  credit: number | null;
};
