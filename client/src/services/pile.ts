// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BankAccount } from "../types";

interface GetBankAccountsResponse {
  data: BankAccount[];
}

// Define a service using a base URL and expected endpoints
export const pileApi = createApi({
  reducerPath: "pileApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/" }),
  endpoints: (builder) => ({
    getBankAccounts: builder.query<GetBankAccountsResponse, string>({
      query: (name) => {
        return `bank-accounts`;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetBankAccountsQuery } = pileApi;
