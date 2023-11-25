import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify from "fastify";
import fs from "node:fs/promises";

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();

server.route({
  method: "GET",
  url: "/bank-accounts",
  async handler(request) {
    const file = await fs.readFile("data/accounts.json");
    const data = JSON.parse(file.toString());
    return {
      ...data,
    };
  },
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          data: {
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
});

server.route({
  method: "POST",
  url: "/sepa-bank-transfer",
  async handler(request) {
    console.log("Transfer request:", request.body);
    return request.body;
  },
  schema: {
    querystring: {
      type: "object",
      properties: {
        maxBalance: { type: "number", multipleOf: 0.01 },
        minBalance: { type: "number", multipleOf: 0.01 },
        name: { type: "string" },
      },
    },
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
