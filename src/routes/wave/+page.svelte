<script lang="ts">
	import SequencerLayout from '$lib/components/SequencerLayout.svelte';
	import WaveSequencer from '$lib/components/WaveSequencer.svelte';
	import { ui } from '$lib/stores/ui';
	import { onMount } from 'svelte';

	onMount(() => {
		ui.setView('wave');
	});
</script>

<SequencerLayout>
	<WaveSequencer />
</SequencerLayout>