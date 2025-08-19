<script lang="ts">
	import { Trash } from 'lucide-svelte';
	import { sequencer } from '$lib/stores/sequencer';

	function handleClear() {
		if (confirm('Clear all steps in current pattern?')) {
			sequencer.clearPattern();
		}
	}
</script>

<button
	onclick={handleClear}
	class="clear-btn"
	title="Clear Pattern"
	aria-label="Clear Pattern"
>
	<Trash class="w-4 h-4" />
	<span>Clear</span>
</button>

<style>
	.clear-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.5rem;
		color: #888;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}

	.clear-btn:hover {
		background: #dc2626;
		border-color: #ef4444;
		color: white;
	}
</style>