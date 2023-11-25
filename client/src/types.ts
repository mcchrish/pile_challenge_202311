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
