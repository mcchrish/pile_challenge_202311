import { test, expect } from "@playwright/test";

test("bank account filtering", async ({ request }) => {
  const all = await request.get("/bank-accounts");
  expect(all.ok()).toBeTruthy();

  const search = await request.get(
    "/bank-accounts?search=DE03678822021961930232",
  );
  expect(search.ok()).toBeTruthy();

  expect(await search.json()).toEqual({
    accounts: [
      {
        IBAN: "DE03678822021961930232",
        balances: { available: { currency: "EUR", value: 80722.7 } },
        country: "DEU",
        createdAt: "2023-10-31T11:37:57.051Z",
        id: "2fd5e4e0-16e2-4337-b63d-22582d2623f5",
        name: "61tuh",
      },
    ],
    totalBalances: 24835025.97,
  });

  const balanceRange = await request.get(
    "/bank-accounts?min_balance=734917&max_balance=734918",
  );
  expect(balanceRange.ok()).toBeTruthy();

  expect(await balanceRange.json()).toEqual({
    accounts: [
      {
        IBAN: "DE77270284663981982250",
        balances: {
          available: {
            value: 734917.18,
            currency: "EUR",
          },
        },
        country: "DEU",
        createdAt: "2023-10-31T11:37:57.051Z",
        id: "b0c9dcf1-4296-47fa-93ce-6e5dd569a52d",
        name: "9mumk",
      },
    ],
    totalBalances: 24835025.97,
  });
});

test("SEPA bank transfer", async ({ request }) => {
  const data = {
    sourceId: "9513f116-571c-4468-9a90-25cd9e74911a",
    amount: 20.05,
    recipientName: "John Smith",
    targetIban: "DE20214577582752901028",
    targetBic: "REVOLUT12",
    reference: "Ref. 123",
  };
  const res = await request.post("/sepa-bank-transfer", { data });
  expect(res.ok()).toBeTruthy();
  expect(await res.json()).toEqual(data);
});
