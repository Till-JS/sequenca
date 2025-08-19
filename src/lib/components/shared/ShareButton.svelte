<script lang="ts">
	import { Share2, Check, Copy } from 'lucide-svelte';
	import { currentPattern } from '$lib/stores/sequencer';
	import { generateShareUrl } from '$lib/utils/compression';

	let copied = false;
	let shareUrl = '';
	let showDialog = false;

	function handleShare() {
		if (!$currentPattern) return;
		
		shareUrl = generateShareUrl($currentPattern);
		showDialog = true;
		copied = false;
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function closeDialog() {
		showDialog = false;
		shareUrl = '';
		copied = false;
	}
</script>

<button
	onclick={handleShare}
	class="share-btn"
	title="Share Pattern"
	aria-label="Share Pattern"
>
	<Share2 class="w-4 h-4" />
	<span>Share</span>
</button>

{#if showDialog}
	<div class="modal-overlay" onclick={closeDialog}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h3 class="modal-title">Share Pattern</h3>
			<p class="modal-text">Copy this URL to share your pattern:</p>
			
			<div class="url-container">
				<input
					type="text"
					value={shareUrl}
					readonly
					class="url-input"
					onclick={(e) => (e.target as HTMLInputElement).select()}
				/>
				<button onclick={copyToClipboard} class="copy-btn">
					{#if copied}
						<Check class="w-4 h-4" />
						<span>Copied!</span>
					{:else}
						<Copy class="w-4 h-4" />
						<span>Copy</span>
					{/if}
				</button>
			</div>

			<button onclick={closeDialog} class="close-btn">Close</button>
		</div>
	</div>
{/if}

<style>
	.share-btn {
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

	.share-btn:hover {
		background: var(--primary, #6366f1);
		border-color: var(--primary, #6366f1);
		color: white;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s;
	}

	.modal {
		background: #1a1a1a;
		border: 1px solid #3a3a3a;
		border-radius: 0.75rem;
		padding: 1.5rem;
		max-width: 500px;
		width: 90%;
		animation: slideUp 0.2s;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: bold;
		color: #e5e5e5;
		margin-bottom: 0.5rem;
	}

	.modal-text {
		color: #888;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.url-container {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.url-input {
		flex: 1;
		padding: 0.5rem;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.375rem;
		color: #e5e5e5;
		font-size: 0.875rem;
		font-family: monospace;
	}

	.url-input:focus {
		outline: none;
		border-color: var(--primary, #6366f1);
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		background: var(--primary, #6366f1);
		border: none;
		border-radius: 0.375rem;
		color: white;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}

	.copy-btn:hover {
		background: color-mix(in srgb, var(--primary, #6366f1) 85%, black);
	}

	.close-btn {
		width: 100%;
		padding: 0.5rem;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.375rem;
		color: #888;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}

	.close-btn:hover {
		background: #333;
		border-color: #444;
		color: #e5e5e5;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>