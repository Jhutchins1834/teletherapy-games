import { NextResponse } from 'next/server';
import { getClient } from '@/lib/claude';
import { buildPrompt } from '@/lib/word-bank/prompt';
import type { LevelKey } from '@/lib/setup-menu/types';

export async function POST(request: Request) {
  try {
    const { sound, position, level, wordCount } = await request.json();

    if (!sound || !position || !level || !wordCount) {
      return NextResponse.json(
        { error: 'Missing required fields: sound, position, level, wordCount' },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(sound, position, level as LevelKey, Number(wordCount));
    const client = getClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the JSON response
    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed.words) || parsed.words.length === 0) {
      return NextResponse.json(
        { error: 'Invalid response from Claude' },
        { status: 502 },
      );
    }

    // Validate every item is a string
    const words = parsed.words.filter(
      (w: unknown): w is string => typeof w === 'string',
    );

    return NextResponse.json({ words });
  } catch (err) {
    console.error('Word generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate words' },
      { status: 500 },
    );
  }
}
