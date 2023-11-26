// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BankAccount, GetBankAccountsQueryParams, FormValues } from "../types";

interface GetBankAccountsResponse {
  accounts: BankAccount[];
  totalBalances: number;
}

type SepaTransferInput = Omit<FormValues, "sourceAccount"> & {
  sourceId: string;
};

// Define a service using a base URL and expected endpoints
export const pileApi = createApi({
  reducerPath: "pileApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/" }),
  endpoints: (build) => ({
    getBankAccounts: build.query<
      GetBankAccountsResponse,
      GetBankAccountsQueryParams
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value) searchParams.set(key, value);
        }
        return `bank-accounts?${searchParams.toString()}`;
      },
    }),
    sepaBankTransfer: build.mutation<SepaTransferInput, SepaTransferInput>({
      query: (input) => ({
        url: `sepa-bank-transfer`,
        method: "POST",
        body: input,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetBankAccountsQuery, useSepaBankTransferMutation } = pileApi;
