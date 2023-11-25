export interface GetBankAccountsQueryParams {
  max_balance?: number;
  min_balance?: number;
  search?: string;
}

export interface BankAccount {
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

export interface FormValues {
  sourceAccount?: BankAccount;
  amount: number;
  recipientName: string;
  targetIban: string;
  targetBic: string;
  reference?: string;
}
