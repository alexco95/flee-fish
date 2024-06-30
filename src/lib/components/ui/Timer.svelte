<script lang="ts">
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';
	import { gamePaused, survivalTime } from '$lib/stores/store';

	let interval: number;

	onMount(() => {
		const unsubscribe = gamePaused.subscribe((value) => {
			if (value) {
				clearInterval(interval);
			} else {
				startTimer();
			}
		});

		return () => {
			clearInterval(interval);
			unsubscribe();
		};
	});

	function startTimer() {
		clearInterval(interval);
		interval = setInterval(() => {
			survivalTime.update((n) => n + 1);
		}, 1000);
	}
</script>

<div class="timer" transition:blur={{ duration: 500 }}>
	<div class="time">{$survivalTime}</div>
</div>

<style>
	.timer {
		position: absolute;
		top: 1rem;
		right: 50%;
		transform: translateX(50%);
		background: linear-gradient(180deg, #56d5ff, #2395ff);
		border-radius: 15px;
		padding: 10px;
		min-width: 200px;
		border: 3px solid #003e6e;
	}

	.time {
		font-size: 32px;
		font-optical-sizing: auto;
		font-style: normal;
		letter-spacing: 2px;
		color: #ffffff;
		font-weight: 700;
		font-family: 'Fredoka', sans-serif;
		text-align: center;
		-webkit-text-stroke: 2px black;
	}
</style>
