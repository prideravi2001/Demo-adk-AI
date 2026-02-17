import 'dotenv/config';
import { FunctionTool, LlmAgent } from '@google/adk';
import { z } from 'zod';

/*
 * Mock Data
 * In a real implementation, these would be replaced with API calls 
 * to monitoring systems, ticketing systems, and on-call schedules.
 */

const deployments: Record<string, string> = {
  payments: 'Production deployment successful. Version 2.1.3',
  auth: 'Deployment in progress. 3/5 pods updated.',
  search: 'Rollback triggered due to failed health checks.',
};

const serviceHealth: Record<string, string> = {
  payments: 'Healthy - All systems operational.',
  auth: 'Degraded - High latency detected.',
  search: 'Critical - Service unavailable.',
};

const onCall: Record<string, string> = {
  platform: 'Anita Sharma',
  payments: 'Rahul Verma',
  auth: 'Sneha Iyer',
};

const tickets: Record<string, string> = {
  'INC-1023': 'Payment API timeout due to DB connection pool exhaustion.',
  'INC-1044': 'Authentication service intermittent 502 errors.',
  'INC-1051': 'Search indexing job failing for large datasets.',
};

/*
 * Tool 1: Deployment Status
 */

const getDeploymentStatus = new FunctionTool({
  name: 'get_deployment_status',
  description: 'Returns deployment status for a given service.',
  parameters: z.object({
    service: z.string().describe('Name of the service'),
  }),
  execute: ({ service }) => {
    const key = service.toLowerCase();
    const result = deployments[key];

    return result
      ? { status: 'success', report: result }
      : { status: 'error', error_message: `Service '${service}' not found.` };
  },
});

/*
 * Tool 2: Service Health
 */

const getServiceHealth = new FunctionTool({
  name: 'get_service_health',
  description: 'Returns health status for a given service.',
  parameters: z.object({
    service: z.string().describe('Name of the service'),
  }),
  execute: ({ service }) => {
    const key = service.toLowerCase();
    const result = serviceHealth[key];

    return result
      ? { status: 'success', report: result }
      : { status: 'error', error_message: `Service '${service}' not found.` };
  },
});

/*
 * Tool 3: On-call Engineer
 */

const getOnCallEngineer = new FunctionTool({
  name: 'get_oncall_engineer',
  description: 'Returns the current on-call engineer for a given team.',
  parameters: z.object({
    team: z.string().describe('Team name'),
  }),
  execute: ({ team }) => {
    const key = team.toLowerCase();
    const result = onCall[key];

    return result
      ? { status: 'success', report: `Current on-call engineer is ${result}.` }
      : { status: 'error', error_message: `Team '${team}' not found.` };
  },
});

/*
 * Tool 4: Ticket Summary
 */

const getTicketSummary = new FunctionTool({
  name: 'get_ticket_summary',
  description: 'Returns summary of an incident ticket.',
  parameters: z.object({
    ticketId: z.string().describe('Incident ticket ID (e.g., INC-1023)'),
  }),
  execute: ({ ticketId }) => {
    const key = ticketId.toUpperCase();
    const result = tickets[key];

    return result
      ? { status: 'success', report: result }
      : { status: 'error', error_message: `Ticket '${ticketId}' not found.` };
  },
});


export const rootAgent = new LlmAgent({
  name: 'devops_assistant',
  model: 'gemini-2.5-flash-lite',
  description: 'DevOps assistant agent for engineering operations.',
  instruction: `
    You are an engineering operations assistant.
    Help users retrieve deployment status, service health,
    on-call engineer information, and incident summaries.
    When relevant, use available tools instead of guessing.
    Be concise and professional.
  `,
  tools: [
    getDeploymentStatus,
    getServiceHealth,
    getOnCallEngineer,
    getTicketSummary,
  ],
});
