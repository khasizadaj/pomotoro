<script lang="ts">
	import { Check, LapTimer, PieChart, Square } from '$lib/icons/';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	// let timer = 2;

	const timerTypes = [
		{
            id: 0,
			type: 'pomodoro',
			length: 3
		},
		{
            id: 1,
			type: 'shortBreak',
			length: 2
		},
		{
            id: 2,
			type: 'longBreak',
			length: 5
		}
	];
	let currentToro = {
		id: 1,
		name: 'Working on Pomodoro',
		isActive: true,
		isFinished: false,
		currentTimer: {
			type: 0, // pomodoro, shortBreak, longBreak
			remainingTime: 3 // in seconds
		},
		nextTimer: 1,
		numberOfPomodoros: 2,
		finishedPomodoros: 0
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
			nextTimer: 1,
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
			name: 'Working on Something',
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

	let runDetails = {
		timerId: 0,
		currentToro: currentToro
	};

	const prettyTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};

	$: prettifiedTime = prettyTime(runDetails.currentToro.currentTimer.remainingTime);

	let timerId: any;
	$: timerIsDone = false;

	const startTimer = () => {
		timerIsDone = false;
		runDetails['timerId'] = setInterval(() => {
			runDetails.currentToro.currentTimer.remainingTime--;
			if (runDetails.currentToro.currentTimer.remainingTime === 0) {
				resetTimer();
			}
			prettifiedTime = prettyTime(runDetails.currentToro.currentTimer.remainingTime);
		}, 1000);
	};

	const stopTimer = () => {
		clearInterval(timerId);
	};

	const resetTimer = () => {
		clearInterval(runDetails['timerId']);
		let timer = getTimerDetails(runDetails['currentToro'].nextTimer);
		timerIsDone = true;
		prettifiedTime = prettyTime(timer.length);

        runDetails.currentToro.currentTimer = {
            type: timer.id,
            remainingTime: timer.length
        };

        if (timer?.type == "pomodoro") {
            if ((runDetails.currentToro.finishedPomodoros + 1) % 4 === 0) {
                runDetails.currentToro.nextTimer = 2;
            } else {
                runDetails.currentToro.nextTimer = 1;
            }
        }

        else if (timer?.type == "shortBreak" || timer?.type == "longBreak") {
            runDetails.currentToro.finishedPomodoros++;
            runDetails.currentToro.nextTimer = 0;
        }

        if (runDetails.currentToro.finishedPomodoros === runDetails.currentToro.numberOfPomodoros) {
            runDetails.currentToro.isActive = false;
            runDetails.currentToro.isFinished = true;
        }

        console.log('Run Details:', runDetails);
        console.log('Current timer:', getTimerDetails(runDetails['currentToro'].currentTimer.type)?.type);
        console.log('Next timer:', getTimerDetails(runDetails['currentToro'].nextTimer)?.type);
        runDetails = runDetails;
	};

	const getTimerDetails = (id: number) => {
		let timer = timerTypes.find((timer) => timer.id === id);
		return timer;
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
			{#if !runDetails.currentToro.isActive}
				<div class="mt-4">
					<Drawer.Title class="mb-1">Pick thy Toro to work on!</Drawer.Title>
					<Drawer.Description>
						You can choose one from the list. Click on drawer!
					</Drawer.Description>
				</div>
			{:else}
				<div class="mt-4">
					<h2 class="text-xl mb-1">
						{runDetails.currentToro.name}
					</h2>
					<div class="flex gap-1 justify-center">
						{#each Array(runDetails.currentToro.numberOfPomodoros) as _, i}
							{#if i < runDetails.currentToro.finishedPomodoros}
								<div class="relative w-[15px] h-[15px]">
									<Square class="bg-emerald-700 absolute top-0 left-0" />
									<Check class="text-white absolute top-0 left-0" />
								</div>
							{:else if i == runDetails.currentToro.finishedPomodoros}
								<Square class="text-emerald-700" />
								{#if (runDetails.currentToro.finishedPomodoros + 1) % 4 === 0}
									<LapTimer class="text-orange-600" />
								{:else}
									<PieChart class="text-orange-300" />
								{/if}
							{:else}
								<Square />
							{/if}
						{/each}
					</div>
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
