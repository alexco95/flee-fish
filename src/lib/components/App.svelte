<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { PerfMonitor } from '@threlte/extras';
	import { Debug, World } from '@threlte/rapier';
	import Timer from './Timer.svelte';
</script>

<Timer />
<Canvas>
	<PerfMonitor />
	<World gravity={[0, 0, 0]}>
		<Debug />
		<Scene />
	</World>
</Canvas>
