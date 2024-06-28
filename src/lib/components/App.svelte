<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { PerfMonitor } from '@threlte/extras';
	import { Debug, World } from '@threlte/rapier';
	import Timer from './ui/Timer.svelte';
	import { Pane, Checkbox, Button, Slider } from 'svelte-tweakpane-ui';
	import { godMode, increaseHealth, reduceHealth } from '$lib/stores/healthStore';
	import HealthBar from './ui/HealthBar.svelte';
	import { damageFactor, speedFactor } from '$lib/stores/gameSettingsStore';
	import { gamePaused } from '$lib/stores/store';
	import StartScreen from './ui/StartScreen.svelte';

	let perfMonitorEnabled = false;
	let debugEnabled = false;

	let showStartScreen = true;

	function startGame() {
		showStartScreen = false;
		gamePaused.update(() => false);
	}
</script>

<Pane>
	<Checkbox bind:value={perfMonitorEnabled} label="Perf. Monitor"></Checkbox>
	<Checkbox bind:value={debugEnabled} label="Physics Debug"></Checkbox>
	<Button on:click={() => reduceHealth(5)} label="- Health"></Button>
	<Button on:click={() => increaseHealth(5)} label="+ Health"></Button>
	<Checkbox bind:value={$godMode} label="God Mode"></Checkbox>
	<Slider bind:value={$speedFactor} min={0.1} max={1} step={0.1} label="Predators Speed"></Slider>
	<Slider bind:value={$damageFactor} min={0.1} max={1} step={0.1} label="Damage Factor"
	></Slider></Pane
>
<HealthBar />
<Timer />

<Canvas>
	{#if perfMonitorEnabled}
		<PerfMonitor />
	{/if}
	<World gravity={[0, -9.81 * 0.1, 0]}>
		{#if debugEnabled}
			<Debug />
		{/if}
		<Scene />
	</World>
</Canvas>

{#if showStartScreen}
	<StartScreen onStart={startGame} />
{/if}
