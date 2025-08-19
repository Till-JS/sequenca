<script lang="ts">
	import SequencerLayout from '$lib/components/SequencerLayout.svelte';
	import CircularSequencer from '$lib/components/CircularSequencer.svelte';
	import { ui } from '$lib/stores/ui';
	import { onMount } from 'svelte';

	onMount(() => {
		ui.setView('circular');
	});
</script>

<SequencerLayout>
	<CircularSequencer />
</SequencerLayout>