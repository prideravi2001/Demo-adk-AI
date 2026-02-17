import 'dotenv/config';
import { GOOGLE_SEARCH, LlmAgent } from '@google/adk';

export const rootAgent = new LlmAgent({
  name: 'search_ai_agent',
  model: 'gemini-2.5-flash',
  description: 'A simple assistant with search capabilities.',
  instruction: 'You are a helpful agent who can answer user questions by searching the web and can also provide latest information.',
  tools: [GOOGLE_SEARCH],
});