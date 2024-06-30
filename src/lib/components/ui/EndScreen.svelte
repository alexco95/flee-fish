<script lang="ts">
	import { survivalTime } from '$lib/stores/store';
	import { get } from 'svelte/store';

	let time = get(survivalTime);

	const funnyMessages = [
		'Better luck next time!',
		'Fish out of water!',
		'You swam like a champ!',
		"Don't be koi, try again!",
		"You're a reel winner!"
	];

	const message = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
</script>

<div class="menu">
	<h1 class="title">Game Over</h1>
	<div class="details">
		<p>You survived for <span class="highlight">{time} seconds</span></p>
		<p>{message}</p>
	</div>
	<button on:click={() => location.reload()}>RESTART</button>
</div>

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

	.details {
		margin: 20px;
		font-size: 2em;
	}

	.highlight {
		color: #ffd700;
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
