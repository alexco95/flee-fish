<script lang="ts">
	import { T } from '@threlte/core';
	import PlayerFish from './PlayerFish.svelte';
	import Predator from './Predator.svelte';
	import { Grid, OrbitControls } from '@threlte/extras';
	import { onMount } from 'svelte';

	let predators: any[] = [];

	function addPredator() {
		predators = [...predators, {}];
	}

	onMount(() => {
		const interval = setInterval(addPredator, 2000);
		return () => clearInterval(interval);
	});
</script>

<T.AmbientLight intensity={0.5} />
<T.PointLight position={[10, 10, 10]} />

<PlayerFish />

{#each predators as predator}
	<Predator />
{/each}

<!-- <T.PerspectiveCamera makeDefault position={[-10, 10, 10]} fov={15}>
	<OrbitControls enableDamping target={[0, 0, 0]} />
</T.PerspectiveCamera> -->

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
