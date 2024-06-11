<script lang="ts">
	import { T } from '@threlte/core';
	import PlayerFish from './PlayerFish.svelte';
	import { Grid } from '@threlte/extras';
	import { onMount, onDestroy } from 'svelte';
	import { gamePaused } from '$lib/stores/store';
	import Shark from './predators/Shark.svelte';

	let predators: any[] = [];
	let interval: number;

	function addPredator() {
		if (!$gamePaused) {
			predators = [...predators, {}];
		}
	}

	function startInterval() {
		interval = setInterval(addPredator, 2000);
	}

	function clearPredatorInterval() {
		clearInterval(interval);
	}

	function handleVisibilityChange() {
		gamePaused.set(document.hidden);

		if (document.hidden) {
			clearPredatorInterval();
		} else {
			startInterval();
		}
	}

	onMount(() => {
		startInterval();
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			clearPredatorInterval();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});

	onDestroy(() => {
		clearPredatorInterval();
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
	<Shark />
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
