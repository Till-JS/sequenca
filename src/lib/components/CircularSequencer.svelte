<script lang="ts">
	import { sequencer, currentPattern, currentStep, isPlaying } from '$lib/stores/sequencer';
	import { onMount } from 'svelte';
	import { Volume2, VolumeX } from 'lucide-svelte';

	const trackColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
	const centerX = 250;
	const centerY = 250;
	const radiusStep = 30;
	const baseRadius = 60;

	onMount(() => {
		sequencer.init();
	});

	function getStepPosition(stepIndex: number, radius: number) {
		const angle = (stepIndex / 16) * Math.PI * 2 - Math.PI / 2;
		return {
			x: centerX + Math.cos(angle) * radius,
			y: centerY + Math.sin(angle) * radius
		};
	}

	function handleStepClick(trackIndex: number, stepIndex: number) {
		sequencer.toggleStep(trackIndex, stepIndex);
	}

	function handleMute(trackIndex: number) {
		sequencer.toggleTrackMute(trackIndex);
	}

	function handleSolo(trackIndex: number) {
		sequencer.toggleTrackSolo(trackIndex);
	}

	$: playheadAngle = ($currentStep / 16) * 360 - 90;
</script>

{#if $currentPattern}
	<div class="circular-container">
		<svg viewBox="0 0 500 500" class="circular-sequencer">
			<!-- Background circles -->
			{#each $currentPattern.tracks as track, trackIndex}
				<circle
					cx={centerX}
					cy={centerY}
					r={baseRadius + trackIndex * radiusStep}
					fill="none"
					stroke="#2a2a2a"
					stroke-width="1"
				/>
			{/each}

			<!-- Playhead -->
			{#if $isPlaying}
				<line
					x1={centerX}
					y1={centerY}
					x2={centerX}
					y2="50"
					stroke="white"
					stroke-width="2"
					opacity="0.5"
					transform="rotate({playheadAngle} {centerX} {centerY})"
					class="playhead"
				/>
			{/if}

			<!-- Steps -->
			{#each $currentPattern.tracks as track, trackIndex}
				{#each track.steps as step, stepIndex}
					{@const pos = getStepPosition(stepIndex, baseRadius + trackIndex * radiusStep)}
					<circle
						cx={pos.x}
						cy={pos.y}
						r="10"
						fill={step.active ? trackColors[trackIndex % trackColors.length] : '#2a2a2a'}
						stroke={$currentStep === stepIndex && $isPlaying ? 'white' : '#3a3a3a'}
						stroke-width={$currentStep === stepIndex && $isPlaying ? '2' : '1'}
						opacity={step.active ? 0.9 : 1}
						class="step-circle"
						onclick={() => handleStepClick(trackIndex, stepIndex)}
						style="cursor: pointer;"
					/>
				{/each}
			{/each}

			<!-- Center logo/info -->
			<text
				x={centerX}
				y={centerY - 10}
				text-anchor="middle"
				fill="#888"
				font-size="14"
				font-weight="bold"
			>
				{$currentPattern.bpm} BPM
			</text>
			<text
				x={centerX}
				y={centerY + 10}
				text-anchor="middle"
				fill="#666"
				font-size="12"
			>
				Step {$currentStep + 1}/16
			</text>
		</svg>

		<!-- Track controls -->
		<div class="track-controls">
			{#each $currentPattern.tracks as track, trackIndex}
				<div class="track-control" style="--track-color: {trackColors[trackIndex % trackColors.length]}">
					<div class="track-indicator"></div>
					<span class="track-name">{track.name}</span>
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
			{/each}
		</div>
	</div>
{/if}

<style>
	.circular-container {
		display: flex;
		gap: 2rem;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 1rem;
	}

	.circular-sequencer {
		width: min(80vh, 80vw, 600px);
		height: min(80vh, 80vw, 600px);
		background: #1a1a1a;
		border-radius: 50%;
		border: 2px solid #2a2a2a;
		flex-shrink: 0;
	}

	.step-circle {
		transition: all 0.15s;
	}

	.step-circle:hover {
		transform-origin: center;
		filter: brightness(1.2);
	}

	.playhead {
		animation: none;
		transition: transform 0.1s linear;
	}

	.track-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: #1a1a1a;
		padding: 1rem;
		border-radius: 0.75rem;
		border: 1px solid #2a2a2a;
	}

	.track-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background: #2a2a2a;
		border-radius: 0.5rem;
		min-width: 150px;
	}

	.track-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--track-color);
	}

	.track-name {
		flex: 1;
		font-size: 0.875rem;
		color: #e5e5e5;
	}

	.control-btn {
		width: 1.75rem;
		height: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1a1a1a;
		border: 1px solid #3a3a3a;
		border-radius: 0.25rem;
		color: #888;
		font-size: 0.75rem;
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

	@media (max-width: 768px) {
		.circular-container {
			flex-direction: column;
			gap: 1rem;
		}

		.circular-sequencer {
			width: 100%;
			max-width: 400px;
			height: auto;
		}

		.track-controls {
			width: 100%;
			flex-direction: row;
			flex-wrap: wrap;
		}

		.track-control {
			flex: 1;
			min-width: 140px;
		}
	}
</style>