<script lang="ts">
	import { Grid3x3, Circle, Activity, Box } from 'lucide-svelte';
	import { ui, currentView } from '$lib/stores/ui';
	import type { ViewType } from '$lib/stores/ui';

	const views: { id: ViewType; name: string; icon: any; path: string }[] = [
		{ id: 'grid', name: 'Grid', icon: Grid3x3, path: '/grid' },
		{ id: 'circular', name: 'Circular', icon: Circle, path: '/circular' },
		{ id: 'wave', name: 'Wave', icon: Activity, path: '/wave' },
		{ id: '3d', name: '3D', icon: Box, path: '/3d' }
	];

	function handleViewChange(view: ViewType, path: string) {
		ui.setView(view);
		// Navigate to the view's route
		window.location.href = path;
	}
</script>

<div class="view-switcher">
	{#each views as view}
		<button
			onclick={() => handleViewChange(view.id, view.path)}
			class="view-btn"
			class:active={$currentView === view.id}
			title={view.name}
			aria-label="Switch to {view.name} view"
		>
			<svelte:component this={view.icon} class="w-5 h-5" />
		</button>
	{/each}
</div>

<style>
	.view-switcher {
		display: flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background: #2a2a2a;
		border-radius: 0.5rem;
		border: 1px solid #3a3a3a;
	}

	.view-btn {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		color: #888;
		cursor: pointer;
		transition: all 0.15s;
	}

	.view-btn:hover {
		background: #333;
		color: #e5e5e5;
	}

	.view-btn.active {
		background: var(--primary, #6366f1);
		color: white;
	}

	.view-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
</style>