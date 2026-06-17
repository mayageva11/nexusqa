import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Uses Claude to generate realistic, edge-case-rich test users */
export async function generateTestUsers(count: number): Promise<TestUser[]> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Generate ${count} realistic test users for a SaaS analytics dashboard.
Include edge cases: names with unicode characters, very long emails, special characters in names,
users from different locales. Return ONLY a valid JSON array, no markdown, no explanation.
Schema: [{ "name": string, "email": string, "role": "admin"|"editor"|"viewer", "status": "active"|"inactive", "notes": string }]`,
      },
    ],
  });

  const text = (response.content[0] as Anthropic.TextBlock).text;
  return JSON.parse(text) as TestUser[];
}

/** Analyzes a test failure and suggests the root cause */
export async function analyzeFailure(
  testName: string,
  errorMessage: string
): Promise<FailureAnalysis> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `A Playwright test failed. Analyze this and suggest root cause and fix.
Test: ${testName}
Error: ${errorMessage}

Return ONLY valid JSON, no markdown:
{ "rootCause": string, "severity": "flaky"|"bug"|"env", "suggestedFix": string, "isFlaky": boolean }`,
      },
    ],
  });

  const text = (response.content[0] as Anthropic.TextBlock).text;
  return JSON.parse(text) as FailureAnalysis;
}

/** Converts a user story into a detailed QA test scenario */
export async function generateTestScenario(userStory: string): Promise<TestScenario> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 768,
    messages: [
      {
        role: 'user',
        content: `Convert this user story into a detailed QA test scenario with steps and assertions:
"${userStory}"

Return ONLY valid JSON, no markdown:
{ "title": string, "preconditions": string[], "steps": string[], "assertions": string[], "edgeCases": string[] }`,
      },
    ],
  });

  const text = (response.content[0] as Anthropic.TextBlock).text;
  return JSON.parse(text) as TestScenario;
}

export interface TestUser {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  notes: string;
}

export interface FailureAnalysis {
  rootCause: string;
  severity: 'flaky' | 'bug' | 'env';
  suggestedFix: string;
  isFlaky: boolean;
}

export interface TestScenario {
  title: string;
  preconditions: string[];
  steps: string[];
  assertions: string[];
  edgeCases: string[];
}
