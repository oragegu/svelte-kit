<script lang="ts">
	import { writable } from 'svelte/store';
	import { pullCards } from '$lib/api';
	import type { TarotCard } from '$lib/types';

	const intention = writable('');
	let cards: (TarotCard & { deckName: string })[] = [];
	let flipped = writable<boolean[]>([]);

	const getDeckName = (deck: 'A' | 'B' | 'C') => {
		return deck === 'A' ? '六神' : deck === 'B' ? '六親' : '地支';
	};

	const handlePull = async () => {
		const data = await pullCards($intention);
		cards = data.cards.map((card: TarotCard) => ({
			...card,
			image: `/deck${card.deck}/${card.id}.jpg`,
			deckName: getDeckName(card.deck)
		}));

		flipped.set(cards.map(() => false));

		// Sequentially flip each card
		for (let i = 0; i < cards.length; i++) {
			await new Promise((r) => setTimeout(r, 500 + i * 500));
			flipped.update((f) => {
				f[i] = true;
				return [...f];
			});
		}
	};
</script>

<main class="flex flex-col items-center justify-center p-6 gap-6">
	<h1 class="text-2xl font-bold">小六爻占 - Little LiuYao Pull</h1>

	<input
		type="text"
		bind:value={$intention}
		placeholder="Optional Intention"
		class="border px-4 py-2 rounded shadow w-72"
	/>

	<button
		on:click={handlePull}
		class="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
	>
		Pull 3 Cards
	</button>

	{#if cards.length}
		<div class="flex gap-6 mt-8">
			{#each cards as card, i}
				<button
					type="button"
					class="relative w-[120px] h-[180px] perspective"
					on:click={() => flipped.update(f => { f[i] = !f[i]; return [...f]; })}
				>
					<div
						class={`absolute inset-0 transition-transform duration-700 ease-in-out transform-style-3d ${
							$flipped[i] ? 'rotate-y-180' : ''
						}`}
					>
						<!-- Back -->
						<div class="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
							☯️
						</div>

						<!-- Front -->
						<div
							class="absolute inset-0 backface-hidden transform rotate-y-180 rounded-lg overflow-hidden border border-gray-300"
						>
							<img src={card.image} alt={card.name} class="w-full h-full object-cover" />
							<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm text-center py-1">
								{card.deckName}: {card.name}
							</div>
						</div>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</main>

<style>
	.perspective {
		perspective: 1000px;
	}
	.transform-style-3d {
		transform-style: preserve-3d;
	}
	.backface-hidden {
		backface-visibility: hidden;
	}
	.rotate-y-180 {
		transform: rotateY(180deg);
	}
</style>

