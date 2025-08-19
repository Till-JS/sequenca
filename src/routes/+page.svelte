<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/grid');
	});
</script>

<div class="loading">
	<h1>Loading Sequencer...</h1>
</div>

<style>
	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #0a0a0a;
		color: #e5e5e5;
	}
</style>
