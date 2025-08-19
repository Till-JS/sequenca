<script lang="ts">
	import { sequencer, currentPattern, currentStep, isPlaying } from '$lib/stores/sequencer';
	import { onMount } from 'svelte';
	import { Volume2, VolumeX, ZoomIn, ZoomOut } from 'lucide-svelte';

	const trackColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
	let zoom = 1;
	let containerEl: HTMLDivElement;
	let scrollPosition = 0;

	onMount(() => {
		sequencer.init();
	});

	function handleStepClick(trackIndex: number, stepIndex: number) {
		sequencer.toggleStep(trackIndex, stepIndex);
	}

	function handleMute(trackIndex: number) {
		sequencer.toggleTrackMute(trackIndex);
	}

	function handleSolo(trackIndex: number) {
		sequencer.toggleTrackSolo(trackIndex);
	}

	function zoomIn() {
		zoom = Math.min(zoom * 1.2, 3);
	}

	function zoomOut() {
		zoom = Math.max(zoom / 1.2, 0.5);
	}

	$: stepWidth = 60 * zoom;
	$: trackHeight = 60;

	// Auto-scroll to current step when playing
	$: if ($isPlaying && containerEl) {
		const targetScroll = $currentStep * stepWidth - containerEl.clientWidth / 2;
		if (Math.abs(containerEl.scrollLeft - targetScroll) > stepWidth) {
			containerEl.scrollTo({
				left: targetScroll,
				behavior: 'smooth'
			});
		}
	}
</script>

{#if $currentPattern}
	<div class="wave-container">
		<div class="zoom-controls">
			<button onclick={zoomOut} class="zoom-btn" aria-label="Zoom out">
				<ZoomOut class="w-4 h-4" />
			</button>
			<span class="zoom-level">{Math.round(zoom * 100)}%</span>
			<button onclick={zoomIn} class="zoom-btn" aria-label="Zoom in">
				<ZoomIn class="w-4 h-4" />
			</button>
		</div>

		<div class="wave-sequencer-wrapper">
			<div class="track-headers">
				{#each $currentPattern.tracks as track, trackIndex}
					<div class="track-header" style="--track-color: {trackColors[trackIndex]}">
						<div class="track-info">
							<div class="track-indicator"></div>
							<span class="track-name">{track.name}</span>
						</div>
						<div class="track-controls">
							<button
								onclick={() => handleMute(trackIndex)}
								class="control-btn"
								class:active={track.muted}
								aria-label={track.muted ? 'Unmute' : 'Mute'}
							>
								{#if track.muted}
									<VolumeX class="w-4 h-4" />
								{:else}
									<Volume2 class="w-4 h-4" />
								{/if}
							</button>
							<button
								onclick={() => handleSolo(trackIndex)}
								class="control-btn solo"
								class:active={track.solo}
								aria-label={track.solo ? 'Unsolo' : 'Solo'}
							>
								S
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="wave-scroll-container" bind:this={containerEl}>
				<div class="wave-grid" style="width: {16 * stepWidth}px">
					<!-- Grid lines -->
					<div class="grid-lines">
						{#each Array(16) as _, i}
							<div 
								class="grid-line" 
								style="left: {i * stepWidth}px; width: {stepWidth}px"
								class:beat={i % 4 === 0}
							>
								<span class="step-number">{i + 1}</span>
							</div>
						{/each}
					</div>

					<!-- Playhead -->
					{#if $isPlaying}
						<div 
							class="playhead" 
							style="left: {$currentStep * stepWidth + stepWidth / 2}px"
						></div>
					{/if}

					<!-- Tracks -->
					{#each $currentPattern.tracks as track, trackIndex}
						<div class="wave-track" style="top: {trackIndex * trackHeight}px">
							{#each track.steps as step, stepIndex}
								<button
									onclick={() => handleStepClick(trackIndex, stepIndex)}
									ontouchstart={(e) => { e.preventDefault(); handleStepClick(trackIndex, stepIndex); }}
									class="wave-step"
									class:active={step.active}
									class:current={$currentStep === stepIndex && $isPlaying}
									style="
										left: {stepIndex * stepWidth}px;
										width: {stepWidth - 4}px;
										background: {step.active ? trackColors[trackIndex] : 'transparent'};
									"
									aria-label="Step {stepIndex + 1}"
								>
									{#if step.active}
										<div class="wave-visual">
											<div class="wave-bar" style="height: {step.velocity * 100}%"></div>
										</div>
									{/if}
								</button>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.wave-container {
		width: 100%;
		max-width: 1200px;
		background: #1a1a1a;
		border-radius: 0.75rem;
		padding: 1rem;
	}

	.zoom-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		justify-content: flex-end;
	}

	.zoom-btn {
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

	.zoom-btn:hover {
		background: #333;
		border-color: #444;
		color: #e5e5e5;
	}

	.zoom-level {
		font-size: 0.875rem;
		color: #888;
		min-width: 50px;
		text-align: center;
	}

	.wave-sequencer-wrapper {
		display: flex;
		gap: 0;
		background: #0a0a0a;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid #2a2a2a;
	}

	.track-headers {
		flex-shrink: 0;
		width: 150px;
		background: #1a1a1a;
		border-right: 2px solid #2a2a2a;
	}

	.track-header {
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		border-bottom: 1px solid #2a2a2a;
	}

	.track-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.track-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--track-color);
	}

	.track-name {
		font-size: 0.75rem;
		color: #e5e5e5;
	}

	.track-controls {
		display: flex;
		gap: 0.25rem;
	}

	.control-btn {
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.25rem;
		color: #888;
		font-size: 0.625rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.15s;
	}

	.control-btn:hover {
		background: #333;
		border-color: #444;
	}

	.control-btn.active {
		background: #dc2626;
		border-color: #ef4444;
		color: white;
	}

	.control-btn.solo.active {
		background: #f59e0b;
		border-color: #fbbf24;
	}

	.wave-scroll-container {
		flex: 1;
		overflow-x: auto;
		overflow-y: hidden;
		position: relative;
	}

	.wave-grid {
		position: relative;
		height: 240px;
	}

	.grid-lines {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}

	.grid-line {
		position: absolute;
		top: 0;
		bottom: 0;
		border-left: 1px solid #2a2a2a;
	}

	.grid-line.beat {
		border-left-color: #3a3a3a;
	}

	.step-number {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.625rem;
		color: #666;
	}

	.playhead {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: white;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
		pointer-events: none;
		z-index: 10;
	}

	.wave-track {
		position: absolute;
		height: 60px;
		width: 100%;
		border-bottom: 1px solid #2a2a2a;
	}

	.wave-step {
		position: absolute;
		height: 56px;
		top: 2px;
		border: 1px solid #3a3a3a;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.15s;
		padding: 0;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		overflow: hidden;
		-webkit-tap-highlight-color: transparent;
	}

	.wave-step:hover {
		border-color: #444;
		filter: brightness(1.1);
	}

	.wave-step.current {
		border-color: white;
		box-shadow: 0 0 0 1px white;
	}

	.wave-visual {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 4px;
	}

	.wave-bar {
		width: 60%;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 2px;
		min-height: 4px;
	}

	@media (max-width: 768px) {
		.track-headers {
			width: 100px;
		}

		.track-name {
			font-size: 0.625rem;
		}
	}
</style>