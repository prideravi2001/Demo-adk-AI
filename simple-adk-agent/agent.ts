import 'dotenv/config';
import { LlmAgent } from '@google/adk';

export const rootAgent = new LlmAgent({
  name: 'weather_time_agent',
  model: 'gemini-2.5-flash-lite',
  description: 'Agent to answer questions.',
  instruction: 'You are a helpful agent who can answer user questions.',
});