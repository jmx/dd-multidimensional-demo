export type AccountDimension = Record<string, string>;

export type Account = {
  number: string;
  name: string;
  dimensions: AccountDimension;
};

export const accounts: Account[] = [
  {
    number: "1406",
    name: "Abziehbare Vorsteuer 19 %",
    dimensions: {
      class: "asset",
      vat: "19",
      type: "input-tax"
    }
  },
  {
    number: "3806",
    name: "Umsatzsteuer 19 %",
    dimensions: {
      class: "liability",
      vat: "19",
      type: "output-tax"
    }
  },
  {
    number: "6300",
    name: "Sonstige betriebliche Aufwendungen",
    dimensions: {
      class: "expense",
      category: "operating",
      vat: "19"
    }
  },
  {
    number: "1800",
    name: "Bank",
    dimensions: {
      class: "asset",
      instrument: "cash"
    }
  },
  {
    number: "4400",
    name: "Revenue",
    dimensions: {
      class: "revenue",
      channel: "sales",
      vat: "19"
    }
  },
  {
    number: "6815",
    name: "Bürobedarf",
    dimensions: {
      class: "expense",
      category: "office",
      vat: "19"
    }
  },
  {
    number: "0670",
    name: "Geringwertige Wirtschaftsgüter",
    dimensions: {
      class: "asset",
      category: "equipment",
      vat: "19"
    }
  },
  {
    number: "6262",
    name: "Abschreibungen auf aktivierte GWG",
    dimensions: {
      class: "expense",
      category: "depreciation"
    }
  }
];

export const accountOptions = accounts.map((account) => ({
  value: account.number,
  label: `${account.number} – ${account.name}`
}));

export const accountMap = new Map(accounts.map((account) => [account.number, account]));
