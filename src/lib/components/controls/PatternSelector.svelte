<script lang="ts">
	import { sequencer, currentPattern } from '$lib/stores/sequencer';
	import { Plus, Copy, Trash2, Edit2, Save, X } from 'lucide-svelte';
	
	let patterns: any[] = [];
	let editingId: string | null = null;
	let editingName = '';
	let showNewDialog = false;
	let newPatternName = '';

	$: if ($sequencer) {
		patterns = $sequencer.patterns;
	}

	function handlePatternChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		sequencer.loadPattern(target.value);
	}

	function handleNew() {
		showNewDialog = true;
		newPatternName = `Pattern ${patterns.length + 1}`;
	}

	function confirmNew() {
		if (newPatternName.trim()) {
			sequencer.createNewPattern(newPatternName.trim());
			showNewDialog = false;
			newPatternName = '';
		}
	}

	function cancelNew() {
		showNewDialog = false;
		newPatternName = '';
	}

	function handleDuplicate() {
		if ($currentPattern) {
			sequencer.duplicatePattern($currentPattern.id);
		}
	}

	function handleDelete() {
		if ($currentPattern && patterns.length > 1) {
			if (confirm(`Delete "${$currentPattern.name}"?`)) {
				sequencer.deletePattern($currentPattern.id);
			}
		}
	}

	function startEditing() {
		if ($currentPattern) {
			editingId = $currentPattern.id;
			editingName = $currentPattern.name;
		}
	}

	function saveEdit() {
		if (editingId && editingName.trim()) {
			sequencer.renamePattern(editingId, editingName.trim());
			editingId = null;
		}
	}

	function cancelEdit() {
		editingId = null;
		editingName = '';
	}

	function handleSave() {
		sequencer.savePattern();
	}
</script>

<div class="pattern-selector">
	{#if showNewDialog}
		<div class="new-dialog">
			<input
				type="text"
				bind:value={newPatternName}
				placeholder="Pattern name"
				class="name-input"
				onkeydown={(e) => {
					if (e.key === 'Enter') confirmNew();
					else if (e.key === 'Escape') cancelNew();
				}}
			/>
			<button onclick={confirmNew} class="icon-btn confirm" aria-label="Create">
				<Save class="w-4 h-4" />
			</button>
			<button onclick={cancelNew} class="icon-btn cancel" aria-label="Cancel">
				<X class="w-4 h-4" />
			</button>
		</div>
	{:else if editingId}
		<div class="edit-dialog">
			<input
				type="text"
				bind:value={editingName}
				class="name-input"
				onkeydown={(e) => {
					if (e.key === 'Enter') saveEdit();
					else if (e.key === 'Escape') cancelEdit();
				}}
			/>
			<button onclick={saveEdit} class="icon-btn confirm" aria-label="Save">
				<Save class="w-4 h-4" />
			</button>
			<button onclick={cancelEdit} class="icon-btn cancel" aria-label="Cancel">
				<X class="w-4 h-4" />
			</button>
		</div>
	{:else}
		<select
			value={$currentPattern?.id}
			onchange={handlePatternChange}
			class="pattern-select"
		>
			{#each patterns as pattern}
				<option value={pattern.id}>{pattern.name}</option>
			{/each}
		</select>
		
		<div class="pattern-actions">
			<button onclick={handleNew} class="icon-btn" title="New Pattern">
				<Plus class="w-4 h-4" />
			</button>
			<button onclick={handleDuplicate} class="icon-btn" title="Duplicate Pattern">
				<Copy class="w-4 h-4" />
			</button>
			<button onclick={startEditing} class="icon-btn" title="Rename Pattern">
				<Edit2 class="w-4 h-4" />
			</button>
			<button onclick={handleSave} class="icon-btn save" title="Save Pattern">
				<Save class="w-4 h-4" />
			</button>
			<button 
				onclick={handleDelete} 
				class="icon-btn delete" 
				title="Delete Pattern"
				disabled={patterns.length <= 1}
			>
				<Trash2 class="w-4 h-4" />
			</button>
		</div>
	{/if}
</div>

<style>
	.pattern-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.pattern-select {
		padding: 0.5rem 1rem;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.5rem;
		color: #e5e5e5;
		font-size: 0.875rem;
		min-width: 150px;
		cursor: pointer;
	}

	.pattern-select:hover {
		background: #333;
		border-color: #444;
	}

	.pattern-select:focus {
		outline: none;
		border-color: var(--primary, #6366f1);
	}

	.pattern-actions {
		display: flex;
		gap: 0.25rem;
	}

	.icon-btn {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.375rem;
		color: #888;
		cursor: pointer;
		transition: all 0.15s;
	}

	.icon-btn:hover:not(:disabled) {
		background: #333;
		border-color: #444;
		color: #e5e5e5;
	}

	.icon-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.icon-btn.save {
		color: #10b981;
	}

	.icon-btn.save:hover {
		background: #10b981;
		color: white;
	}

	.icon-btn.delete {
		color: #ef4444;
	}

	.icon-btn.delete:hover:not(:disabled) {
		background: #ef4444;
		color: white;
	}

	.icon-btn.confirm {
		color: #10b981;
	}

	.icon-btn.confirm:hover {
		background: #10b981;
		color: white;
	}

	.icon-btn.cancel {
		color: #ef4444;
	}

	.icon-btn.cancel:hover {
		background: #ef4444;
		color: white;
	}

	.new-dialog,
	.edit-dialog {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.name-input {
		padding: 0.5rem;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.375rem;
		color: #e5e5e5;
		font-size: 0.875rem;
		min-width: 150px;
	}

	.name-input:focus {
		outline: none;
		border-color: var(--primary, #6366f1);
	}
</style>