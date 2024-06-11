<script lang="ts">
	import { health } from '$lib/stores/healthStore';
	import { onMount } from 'svelte';

	let healthValue = 100;

	onMount(() => {
		const unsubscribe = health.subscribe((value) => {
			healthValue = value;
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<div class="health-bar-container">
	<div class="health-bar" style="width: {healthValue}%;"></div>
</div>

<style>
	.health-bar-container {
		position: absolute;
		top: 10px;
		left: 10px;
		width: 100px;
		height: 20px;
		background-color: #1549ab;
		border-radius: 10px;
		border: 2px solid rgb(0, 0, 130);
	}

	.health-bar {
		height: 100%;
		background-color: rgb(9, 255, 0);
		border-radius: 10px;
		transition: width 0.3s;
	}
</style>
