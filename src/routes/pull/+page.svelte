<script lang="ts">
  import { writable } from 'svelte/store';
  import { pullCards } from '$lib/api';
  import type { TarotCard } from '$lib/types';

  const intention = writable<string>('');
  let cards: TarotCard[] = [];

  const handlePull = async () => {
    const data = await pullCards($intention);
    cards = data.cards.map((card: any) => ({
      id: card.id,
      name: card.name,
      deck: card.deck,
      deckName: card.deckName,
      image: `/deck${card.deck}/${card.id}.jpg`,
      description: `Description of ${card.name}`
    }));
  };
</script>

<main>
  <h1>New Little LiuYao Pull</h1>
  <input type="text" bind:value={$intention} placeholder="Optional Intention" />
  <button on:click={handlePull}>Pull 3 Cards</button>

  {#if cards.length > 0}
    <div class="card-container">
      {#each cards as card}
        <div class="card">
          <img src={card.image} alt={card.name} />
          <p><b>{card.deckName}:</b> {card.name}</p>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  .card-container {
    display: flex;
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .card {
    text-align: center;
  }
  .card img {
    width: 150px;
    height: 250px;
    border-radius: 8px;
  }
</style>

