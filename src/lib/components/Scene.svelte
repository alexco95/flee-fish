<script lang="ts">
	import { T } from '@threlte/core';
	import PlayerFish from './PlayerFish.svelte';
	import { Grid, transitions } from '@threlte/extras';
	import { onMount, onDestroy } from 'svelte';
	import { gamePaused } from '$lib/stores/store';
	import Shark from './predators/Shark.svelte';
	import Jellyfish from './predators/Jellyfish.svelte';
	import Plankton from './consumables/Plankton.svelte';

	let predators: any[] = [];
	let consumables: any[] = [];
	const predatorTypes = [Shark, Jellyfish];
	const consumableTypes = [Plankton];
	let predatorsInterval: number;
	let consumablesInterval: number;

	transitions();

	function addPredator(): void {
		if (!$gamePaused) {
			const PredatorComponent = predatorTypes[Math.floor(Math.random() * predatorTypes.length)];
			predators = [...predators, PredatorComponent];
		}
	}

	function addConsumable(): void {
		if (!$gamePaused) {
			const ConsumableComponent =
				consumableTypes[Math.floor(Math.random() * consumableTypes.length)];
			consumables = [...consumables, ConsumableComponent];
		}
	}

	function startIntervals(): void {
		predatorsInterval = setInterval(addPredator, 2000);
		consumablesInterval = setInterval(addConsumable, 5000);
	}

	function clearIntervals(): void {
		clearInterval(predatorsInterval);
		clearInterval(consumablesInterval);
	}

	function handleVisibilityChange(): void {
		gamePaused.set(document.hidden);

		if (document.hidden) {
			clearIntervals();
		} else {
			startIntervals();
		}
	}

	onMount(() => {
		startIntervals();
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			clearIntervals();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});

	onDestroy(() => {
		clearIntervals();
		document.removeEventListener('visibilitychange', handleVisibilityChange);
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
