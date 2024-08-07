<script lang="ts">
	import { Check, LapTimer, PieChart, Square } from '$lib/icons/';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Database } from '$lib/db';
	import * as Howler from 'howler';

	export let data: any;

	const db: Database = data.db;
	let toros = db.getToros();
	let currentToro = db.getToroByCurrentTimer();
	$: currentToroDetails = db.getRunDetails();

	const prettyTime = (time: number) => {
		if (time < 0) {
			return 'PO:MO:TO:RO';
		}
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};

	$: prettifiedTime = db.getRunDetails()?.remainingTime
		? prettyTime(db.getRunDetails()?.remainingTime)
		: 'PO:MO:TO:RO';

	const startTimer = () => {
		playSound(buttonSoundInstance, 500);
		currentToroDetails = db.getRunDetails();
		if (!currentToroDetails || currentToroDetails.intervalId !== null) {
			return null;
		}
		let start = Date.now();
		currentToroDetails.setStartTime(start);
		const timer = () => {
			let distance = currentToroDetails.remainingTime - (((Date.now() - start) / 1000) | 0);
			if (distance <= 0) {
				resetTimer();
				return;
			}
			// currentToroDetails?.setRemainingTime(distance);
			prettifiedTime = prettyTime(distance);
			console.log("REMAINING: ", distance);
		};
		// we don't want to wait a full second before the timer starts
		timer();	
		let intervalId = setInterval(timer, 1000);
		currentToroDetails.intervalId = intervalId;
		db.setRunDetails(currentToroDetails);
	};

	const pauseTimer = () => {
		playSound(buttonSoundInstance, 500);
		currentToroDetails = db.getRunDetails();
		if (!currentToroDetails || currentToroDetails.intervalId == null) {
			return null;
		}
		clearInterval(currentToroDetails?.intervalId);
		currentToroDetails.setRemainingTime(currentToroDetails.remainingTime - ((Date.now() - currentToroDetails.startTime) / 1000) | 0);
		currentToroDetails.intervalId = null;
		db.setRunDetails(currentToroDetails);
	};

	const resetTimer = () => {
		playSound(endSoundInstance, 2000);
		currentToroDetails = db.getRunDetails();
		clearInterval(currentToroDetails?.intervalId);
		currentToroDetails?.updateDetails(db);
		db.setRunDetails(currentToroDetails);

		prettifiedTime = prettyTime(currentToroDetails.remainingTime);
		console.log(db.getRunDetails());
		currentToro = db.getToroByCurrentTimer();
	};

	import clickSoundMusic from '$lib/assets/click.mp3';
	import endSoundMusic from '$lib/assets/timer_end.mp3';

	let endSoundInstance = new Howler.Howl({
		src: [endSoundMusic]
	});
	let buttonSoundInstance = new Howler.Howl({
		src: [clickSoundMusic]
	});

	const playSound = async (instance: Howl, duration: number) => {
		instance.play();
		setTimeout(() => {
			instance.stop();
		}, duration);
	};
</script>

<div class="relative flex h-screen w-screen flex-col items-center justify-center text-center">
	<h1 class="mb-6 text-3xl font-semibold md:text-7xl">{prettifiedTime}</h1>
	<div class="flex gap-4">
		<Button on:click={startTimer}>Start</Button>
		<Button on:click={pauseTimer} variant="secondary">Pause</Button>
	</div>
	<Drawer.Root>
		<Drawer.Trigger
			class="left-x-full -translete-x-full absolute bottom-0 w-2/3 rounded-md rounded-b-none border bg-background p-5"
			><div class="mx-auto h-2 w-[100px] rounded-full bg-muted"></div>
			{#if !db.getRunDetails()}
				<div class="mt-4">
					<Drawer.Title class="mb-1">Pick thy Toro to work on!</Drawer.Title>
					<Drawer.Description>
						You can choose one from the list. Click on drawer!
					</Drawer.Description>
				</div>
			{:else}
				<div class="mt-4">
					<h2 class="mb-1 text-xl">
						{currentToro?.name}
					</h2>

					<div class="flex justify-center gap-1">
						<!--
							1. It shows completed pomodoros.
							2. If current step is pomodoro it shows what is the type of next break
								(with it's respective color).
							3. If current step is either short or long break, it shows break with green
								color to indicate it's happening now.
						-->
						{#each Array(currentToro?.numberOfPomodoros) as _, i}
							{#if i < currentToro?.finishedPomodoros}
								<div class="relative h-[15px] w-[15px]">
									<Square class="absolute left-0 top-0 bg-emerald-700" />
									<Check class="absolute left-0 top-0 text-white" />
								</div>
							{:else if i == currentToro?.finishedPomodoros}
								{#if currentToroDetails?.type === 0}
									<Square class="text-emerald-700" />
									{#if (currentToro?.finishedPomodoros + 1) % 4 === 0}
										<LapTimer class="text-orange-600" />
									{:else}
										<PieChart class="text-orange-300" />
									{/if}
								{:else if currentToroDetails?.type === 1}
									<PieChart class="text-emerald-700" />
									<Square />
								{:else if currentToroDetails?.type === 2}
									<LapTimer class="text-emerald-700" />
									<Square />
								{/if}
							{:else}
								<Square />
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</Drawer.Trigger>
		<Drawer.Content class="m-auto w-2/3">
			<Drawer.Header>
				<Drawer.Title>Toros</Drawer.Title>
				<Drawer.Description>These are tasks that waits to be done :)</Drawer.Description>
			</Drawer.Header>
			<Drawer.Header class="text-left">
				<ul class="ml-4 list-decimal">
					{#each toros as toro, id}
						<li class="text-base font-bold">
							{toro.isFinished}: {toro.name} [{toro.finishedPomodoros}/{toro.numberOfPomodoros}]
						</li>
					{/each}
				</ul>
			</Drawer.Header>
		</Drawer.Content>
	</Drawer.Root>
</div>
