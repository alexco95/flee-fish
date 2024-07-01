<script lang="ts">
	import { onMount } from 'svelte';

	export let onStart: () => void;
	let isMobile = false;

	function checkIfMobile() {
		const userAgent = navigator.userAgent;
		// Detect iOS, Android, Windows Phone
		if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
			return true;
		}
		return window.innerWidth < 768;
	}

	onMount(() => {
		isMobile = checkIfMobile();
	});
</script>

{#if isMobile}
	<div class="menu">
		<h1 class="title">FLEE FISH</h1>
		<p class="mobile-warning">
			The game is not playable on mobile devices yet. Please use a desktop or laptop.
		</p>
	</div>
{:else}
	<div class="menu">
		<h1 class="title">Welcome to <span class="highlight-title">FLEE FISH</span></h1>
		<div class="instructions">
			<h2>Instructions</h2>
			<p>
				Use the <strong>arrow keys</strong> (or <strong>AWSD</strong>) to move the fish around the
				screen.
			</p>
			<p>
				Avoid the <span class="highlight-red">predators</span> and eat the consumables to increase
				your <span class="highlight-green">health</span>.
			</p>
			<br />
			<p>Survive as long as you can!</p>
		</div>
		<button on:click={onStart}>PLAY</button>
	</div>
{/if}

<style>
	.menu {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		text-align: center;
		z-index: 10;
		font-family: 'Fredoka', sans-serif;
	}

	.title {
		font-size: 4em;
		margin-bottom: 1em;
	}

	.highlight-title {
		color: #ffd700;
	}

	.instructions {
		margin: 20px;
		font-size: 1.5em;
	}

	.mobile-warning {
		font-size: 1.5em;
		color: #ff0000;
		margin: 20px;
	}

	.highlight-green {
		color: #00ff00;
		font-weight: bold;
	}

	.highlight-red {
		color: #ff0000;
		font-weight: bold;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		background: linear-gradient(135deg, #00c6ff, #0072ff);
		color: white;
		border: none;
		border-radius: 5px;
		transition: all 0.3s ease;
		position: relative;
		font-family: 'Fredoka', sans-serif;
		font-weight: bold;
		font-size: 2em;
		margin-top: 3em;
	}

	button:hover {
		background: linear-gradient(135deg, #0072ff, #00c6ff);
		box-shadow: 0 6px 20px rgba(0, 123, 255, 1);
		transform: scale(1.05);
	}

	button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
		width: 200%;
		height: 200%;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		transition: transform 0.5s ease;
	}

	button:active {
		transform: scale(0.95);
		background: linear-gradient(135deg, #005bb5, #00449e);
		box-shadow: 0 4px 10px rgba(0, 123, 255, 0.5);
	}
</style>
