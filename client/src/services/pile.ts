// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BankAccount,
  GetBankAccountsQueryParams,
  FormValues,
} from "../types";

interface GetBankAccountsResponse {
  data: {
    accounts: BankAccount[];
    totalBalance: number;
  };
}

type SepaTransferInput = Omit<FormValues, 'sourceAccount'> & {sourceId: string}

// Define a service using a base URL and expected endpoints
export const pileApi = createApi({
  reducerPath: "pileApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/" }),
  endpoints: (builder) => ({
    getBankAccounts: builder.query<
      GetBankAccountsResponse,
      GetBankAccountsQueryParams
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          searchParams.set(key, value);
        }
        return `bank-accounts?${searchParams.toString()}`;
      },
    }),
    sepaBankTransfer: builder.mutation<SepaTransferInput, SepaTransferInput>({
      // note: an optional `queryFn` may be used in place of `query`
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
