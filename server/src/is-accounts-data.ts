export function isAccountsData(data: unknown): data is AccountsData {
  return typeof data === "object" && data !== null && "data" in data;
}

interface AccountsData {
  data: BankAccount[];
}

export interface BankAccount {
  [x: string]: unknown;
  id: string;
  IBAN: string;
  balances: {
    available: {
      value: number;
      currency: Currency;
    };
  };
  country: Country;
  createdAt: string;
  name: string;
}

enum Currency {
  EUR = "EUR",
}

enum Country {
  DEU = "DEU",
}
