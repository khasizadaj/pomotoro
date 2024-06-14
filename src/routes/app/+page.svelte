<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	let timer = 2;

	const prettyTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = timer % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};

	$: prettifiedTime = prettyTime(timer);

	let timerId: any;
	$: timerIsDone = false;

	const startTimer = () => {
		timerIsDone = false;
		timerId = setInterval(() => {
			timer--;
			if (timer === 0) {
				resetTimer();
			}
			prettifiedTime = prettyTime(timer);
		}, 1000);
	};

	const stopTimer = () => {
		clearInterval(timerId);
	};

	const resetTimer = () => {
		clearInterval(timerId);
		timer = 15 * 60;
		timerIsDone = true;
		prettifiedTime = prettyTime(timer);
	};
</script>

<div class="h-screen w-screen flex flex-col items-center justify-center relative text-center">
	<h1 class="mb-6 text-3xl md:text-7xl font-semibold">{prettifiedTime}</h1>
	<div class="flex gap-4">
		<Button on:click={startTimer}>Start</Button>
		<Button on:click={stopTimer} variant="secondary">Stop</Button>
		<Button on:click={resetTimer} variant="destructive">Reset</Button>
	</div>
	{#if timerIsDone}
		<div class="absolute bottom-0 left-x-full right-x-1/2 bg-white px-12 py-2">
			<p class="text-2xl text-gray-950">Time's up! Good job!</p>
		</div>
	{/if}
</div>
