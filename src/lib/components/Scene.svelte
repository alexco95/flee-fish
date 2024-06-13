<script lang="ts">
	import { T } from '@threlte/core';
	import PlayerFish from './PlayerFish.svelte';
	import { Grid, transitions } from '@threlte/extras';
	import { onMount, onDestroy } from 'svelte';
	import { Game } from '$lib/models/Game';

	let predators = [];
	let consumables = [];

	let game: Game;

	$: if (game) {
		game.predators.subscribe((value) => {
			predators = value;
		});

		game.consumables.subscribe((value) => {
			consumables = value;
		});
	}

	transitions();

	onMount(() => {
		game = new Game();

		document.addEventListener('visibilitychange', game.handleVisibilityChange.bind(game));

		return () => {
			game.clearIntervals();
			document.removeEventListener('visibilitychange', game.handleVisibilityChange.bind(game));
		};
	});

	onDestroy(() => {
		game.clearIntervals();
		document.removeEventListener('visibilitychange', game.handleVisibilityChange.bind(game));
	});
</script>

<T.AmbientLight intensity={0.5} />
<T.PointLight position={[10, 10, 10]} />

<PlayerFish />

<!-- <T.PerspectiveCamera position={[0, -3, -3]} makeDefault fov={50}>
	<OrbitControls enableDamping />
</T.PerspectiveCamera> -->

{#each predators as predator}
	<svelte:component this={predator} />
{/each}

{#each consumables as consumable}
	<svelte:component this={consumable} />
{/each}

<T.DirectionalLight intensity={0.8} position={[5, 10, 0]} />
<T.AmbientLight intensity={0.2} />

<Grid
	position={[0, -0.001, 0]}
	cellColor="#ffffff"
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={25}
	cellSize={2}
/>
