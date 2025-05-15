import type { RequestHandler } from './$types';
import axios from 'axios';
import { supabase } from '$lib/supabase';

// Define names for Deck A, B, and C
const deckANames = ["青龍", "朱雀", "勾陳", "螣蛇", "白虎", "玄武"];
const deckBNames = ["父母", "兄弟", "子孫", "妻財", "官鬼", "世爻"];
const deckCNames = [
  "子", "丑", "寅", "卯",
  "辰", "巳", "午", "未",
  "申", "酉", "戌", "亥"
];

// Define Chinese names for the decks
const deckNames = {
  A: "六神",
  B: "六親",
  C: "地支"
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { intention } = await request.json();

    // Get random card from each deck
    const RANDOM_API = `https://www.random.org/integers/?num=3&min=0&max=11&col=1&base=10&format=plain&rnd=new`;
    const { data } = await axios.get(RANDOM_API);

    const results = data.trim().split('\n').map(Number);

    // Map cards to decks
    const deckA = results[0] % 6;  // From Deck A (0-5)
    const deckB = results[1] % 6;  // From Deck B (0-5)
    const deckC = results[2];      // From Deck C (0-11)

    // Save to database
    await supabase.from('draws').insert([
      {
        deck_a: deckA,
        deck_b: deckB,
        deck_c: deckC,
        intention,
        timestamp: new Date()
      }
    ]);

    // Respond with data, including the names
    return new Response(JSON.stringify({
      cards: [
        { id: deckA, deck: 'A', name: deckANames[deckA], deckName: deckNames.A },
        { id: deckB, deck: 'B', name: deckBNames[deckB], deckName: deckNames.B },
        { id: deckC, deck: 'C', name: deckCNames[deckC], deckName: deckNames.C }
      ]
    }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to pull cards.' }), { status: 500 });
  }
};

