import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify from "fastify";
import fs from "node:fs/promises";
import { isAccountsData } from "./is-accounts-data.js";

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();

server.route({
  method: "GET",
  url: "/bank-accounts",
  async handler(request) {
    const file = await fs.readFile("data/accounts.json");
    const data = JSON.parse(file.toString());
    if (!isAccountsData(data)) {
      throw new Error("Invalid accounts data");
    }
    const filtersAccounts = data.data.filter((account) => {
      const { max_balance, min_balance, search } = request.query;
      if (max_balance && account.balances.available.value > max_balance) {
        return false;
      } else if (
        min_balance &&
        account.balances.available.value < min_balance
      ) {
        return false;
      } else if (
        search &&
        !(
          account.IBAN.toLowerCase().includes(search) ||
          account.name.toLowerCase().includes(search) ||
          account.country.toLowerCase().includes(search)
        )
      ) {
        return false;
      }

      return true;
    });
    const totalBalances = filtersAccounts.reduce(
      (total, account) => total + account.balances.available.value,
      0,
    );
    return {
      data: {
        accounts: filtersAccounts,
        totalBalances,
      },
    };
  },
  schema: {
    querystring: {
      type: "object",
      properties: {
        max_balance: { type: "number", multipleOf: 0.01 },
        min_balance: { type: "number", multipleOf: 0.01 },
        search: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              totalBalances: { type: "number" },
              accounts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    IBAN: { type: "string" },
                    balances: {
                      type: "object",
                      properties: {
                        available: {
                          type: "object",
                          properties: {
                            value: { type: "number" },
                            currency: { type: "string", enum: ["EUR"] },
                          },
                        },
                      },
                    },
                    country: { type: "string", enum: ["DEU"] },
                    createdAt: { type: "string" },
                    id: { type: "string" },
                    name: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

server.route({
  method: "POST",
  url: "/sepa-bank-transfer",
  async handler(request) {
    console.log("Transfer request:", request.body);
    return request.body;
  },
  schema: {
    body: {
      type: "object",
      properties: {
        sourceId: { type: "string" },
        amount: { type: "number", multipleOf: 0.01 },
        recipientName: { type: "string" },
        targetIban: { type: "string" },
        targetBic: { type: "string" },
        reference: { type: "string" },
      },
      required: [
        "sourceId",
        "amount",
        "recipientName",
        "targetIban",
        "targetBic",
      ],
    },
  },
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
