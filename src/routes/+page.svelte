<script lang="ts">
	import App from '$lib/components/App.svelte';
</script>

<div>
	<App />
</div>

<style>
	:global(body) {
		margin: 0;
	}

	div {
		width: 100vw;
		height: 100vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgb(17, 95, 167) 0%, rgb(81, 200, 255) 100%);
	}
</style>
