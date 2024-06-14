<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	let timer = 2;

	const timerTypes = {
		0: {
			type: 'pomodoro',
			length: 25 * 60
		},
		1: {
			type: 'shortBreak',
			length: 5 * 60
		},
		2: {
			type: 'longBreak',
			length: 15 * 60
		}
	};
	let currentToro = {
		id: 1,
		name: 'Working on Pomodoro',
		isActive: true,
		isFinished: false,
		currentTimer: {
			type: 0, // pomodoro, shortBreak, longBreak
			remainingTime: 12 * 60 // in seconds
		},
		nextTimer: 'shortBreak',
		numberOfPomodoros: 5,
		finishedPomodoros: 2
	};
	let toros = [
		{
			id: 1,
			name: 'Working on Pomodoro',
			isActive: true,
			isFinished: false,
			currentTimer: {
				type: 0, // pomodoro, shortBreak, longBreak
				remainingTime: 12 * 60 // in seconds
			},
			nextTimer: 'shortBreak',
			numberOfPomodoros: 5,
			finishedPomodoros: 2
		},
		{
			id: 2,
			name: 'Working on DnD Character Builder',
			isActive: false,
			isFinished: false,
			currentTimer: {
				type: 0,
				remainingTime: 12 * 60
			},
			nextTimer: 'shortBreak',
			numberOfPomodoros: 4,
			finishedPomodoros: 2
		},
		{
			id: 3,
			name: 'Working on DnD Character Builder',
			isActive: false,
			isFinished: true,
			currentTimer: {
				type: 0,
				remainingTime: 0
			},
			nextTimer: null,
			numberOfPomodoros: 4,
			finishedPomodoros: 4
		}
	];

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
		timer = 3;
		timerIsDone = true;
		prettifiedTime = prettyTime(timer);
	};

	const updateToro = (event: MouseEvent, id: number) => {
		event.stopImmediatePropagation();
		toros.forEach((toro) => {
			if (toro.id === id) {
				if (toro.isFinished) {
					toro.isFinished = false;
				} else {
					toro.isFinished = true;
				}
			}
			if (toro.isActive) {
				currentToro = toro;
			}
		});
		toros = toros;
	};
</script>

<div class="h-screen w-screen flex flex-col items-center justify-center relative text-center">
	<h1 class="mb-6 text-3xl md:text-7xl font-semibold">{prettifiedTime}</h1>
	<div class="flex gap-4">
		<Button on:click={startTimer}>Start</Button>
		<Button on:click={stopTimer} variant="secondary">Stop</Button>
		<Button on:click={resetTimer} variant="destructive">Reset</Button>
	</div>
	<Drawer.Root>
		<Drawer.Trigger
			class="w-2/3 p-5 bg-background border rounded-md rounded-b-none absolute bottom-0 left-x-full -translete-x-full"
			><div class="mx-auto h-2 w-[100px] rounded-full bg-muted"></div>
			{#if currentToro.isFinished}
				<div class="mt-4">
					<Drawer.Title class="mb-1">
						Pick thy Toro to work on!
					</Drawer.Title>
					<Drawer.Description>
						You can choose one from the list. Click on drawer!
					</Drawer.Description>
				</div>
			{:else}
				<div class="mt-4">
					<h2 class="text-xl">
						{currentToro.name}
						{#if currentToro.isFinished}✅{:else}🔳{/if}
					</h2>
					<p>
						[{currentToro.finishedPomodoros}/{currentToro.numberOfPomodoros}]
					</p>
				</div>
			{/if}
		</Drawer.Trigger>
		<Drawer.Content class="w-2/3 m-auto">
			<Drawer.Header>
				<Drawer.Title>Toros</Drawer.Title>
				<Drawer.Description>These are tasks that waits to be done :)</Drawer.Description>
			</Drawer.Header>
			<Drawer.Header class="text-left">
				{#each toros as toro}
					<div>
						<input
							type="checkbox"
							name="toro-checkbox-{toro.id}"
							id=""
							on:change={(e) => {
								updateToro(e, toro.id);
							}}
							bind:checked={toro.isFinished}
						/>
						<label class="text-base font-bold" for="toro-checkbox-{toro.id}">
							{toro.isFinished}: {toro.name} [{toro.finishedPomodoros}/{toro.numberOfPomodoros}]
						</label>
					</div>
				{/each}
			</Drawer.Header>
		</Drawer.Content>
	</Drawer.Root>
</div>
