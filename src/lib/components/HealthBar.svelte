<script lang="ts">
	import { health } from '$lib/stores/healthStore';
	import { onMount } from 'svelte';

	let healthValue = 100;
	let flashColor = '';

	onMount(() => {
		const unsubscribe = health.subscribe((value) => {
			if (value < healthValue) {
				flashColor = 'red';
			} else if (value > healthValue) {
				flashColor = 'green';
			}

			healthValue = value;

			if (flashColor) {
				setTimeout(() => {
					flashColor = '';
				}, 1000);
			}
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<div class="health-bar-container">
	<div class="health-bar {flashColor}" style="width: {healthValue}%;"></div>
</div>

<style>
	.health-bar-container {
		position: absolute;
		top: 10px;
		left: 10px;
		width: 200px;
		height: 20px;
		background-color: #0075db;
		border: 2px solid #00298f;
		border-radius: 10px;
		overflow: hidden;
	}

	.health-bar {
		height: 100%;
		background-color: #5dff48;
		transition:
			width 0.3s,
			background-color 0.3s;
	}

	.red {
		animation: flashRed 1s;
	}

	.green {
		animation: flashGreen 1s;
	}

	@keyframes flashRed {
		0%,
		100% {
			background-color: #5dff48;
		}
		50% {
			background-color: red;
		}
	}

	@keyframes flashGreen {
		0%,
		100% {
			background-color: #5dff48;
		}
		50% {
			background-color: rgb(192, 255, 188);
		}
	}
</style>
