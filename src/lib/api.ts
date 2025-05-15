// src/lib/api.ts
import axios from 'axios';

export const pullCards = async (intention: string) => {
  try {
    const response = await axios.post('/api/pull', {
      intention
    });
    return response.data;
  } catch (error) {
    console.error('Error pulling cards:', error);
    return { cards: [] };
  }
};

