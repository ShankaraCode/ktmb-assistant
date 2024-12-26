import OpenAI, { AzureOpenAI } from "openai";

// export const openai = new OpenAI();

export const openai = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_VERSION,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
});
