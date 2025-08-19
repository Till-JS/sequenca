<script lang="ts">
	import SequencerLayout from '$lib/components/SequencerLayout.svelte';
	import { ui } from '$lib/stores/ui';
	import { onMount } from 'svelte';

	onMount(() => {
		ui.setView('3d');
	});
</script>

<SequencerLayout>
	<div class="coming-soon">
		<h2>3D View</h2>
		<p>Coming Soon!</p>
		<p class="hint">This view will feature a rotating cube with 6 patterns on each face.</p>
	</div>
</SequencerLayout>

<style>
	.coming-soon {
		text-align: center;
		padding: 4rem 2rem;
		background: #1a1a1a;
		border-radius: 0.75rem;
		border: 2px dashed #3a3a3a;
		max-width: 600px;
	}

	h2 {
		font-size: 2rem;
		font-weight: bold;
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 1rem;
	}

	p {
		color: #888;
		margin-bottom: 0.5rem;
	}

	.hint {
		font-size: 0.875rem;
		color: #666;
	}
</style>