import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: Request) {

const { text } = await generateText({
  model: google('gemini-1.5-pro-latest'),
  prompt: 'Generate a constructive feedback message ',
});

return new Response(text);
}
