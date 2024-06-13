<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { Gizmo, PerfMonitor } from '@threlte/extras';
	import { Debug, World } from '@threlte/rapier';
	import Timer from './Timer.svelte';
	import { Pane, Checkbox, Button } from 'svelte-tweakpane-ui';
	import { increaseHealth, reduceHealth } from '$lib/stores/healthStore';
	import HealthBar from './HealthBar.svelte';

	let perfMonitorEnabled = false;
	let debugEnabled = false;
</script>

<Pane>
	<Checkbox bind:value={perfMonitorEnabled} label="Perf. Monitor"></Checkbox>
	<Checkbox bind:value={debugEnabled} label="Physics Debug"></Checkbox>
	<Button on:click={() => reduceHealth(5)} label="- Health"></Button>
	<Button on:click={() => increaseHealth(5)} label="+ Health"></Button>
</Pane>
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
