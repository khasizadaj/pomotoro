<script lang="ts">
	import { Check, LapTimer, PieChart, Square } from '$lib/icons/';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Database, RunDetails } from '$lib/db';

	export let data: any;

	const db: Database = data.db;
	let toros = db.getToros();
	let currentToro = db.getToroByCurrentTimer();

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

	let timerId: any;

	const startTimer = () => {
		let currentToroDetails = db.getRunDetails();
		if (!currentToroDetails || currentToroDetails.intervalId !== null) {
			return null;
		}
		let intervalId = setInterval(() => {
			currentToroDetails.decrement();
			if (currentToroDetails.isFinished()) {
				resetTimer();
				return;
			}
			prettifiedTime = prettyTime(currentToroDetails.remainingTime);
		}, 1000);
		currentToroDetails.intervalId = intervalId;
		db.setRunDetails(currentToroDetails);
	};
	
	const pauseTimer = () => {
		let currentToroDetails = db.getRunDetails();
		if (!currentToroDetails || currentToroDetails.intervalId == null) {
			return null;
		}
		clearInterval(currentToroDetails?.intervalId);
		currentToroDetails.intervalId = null;
		db.setRunDetails(currentToroDetails);
	};

	const resetTimer = () => {
		let currentToroDetails = db.getRunDetails();
		clearInterval(currentToroDetails?.intervalId);
		currentToroDetails?.updateDetails(db);
		db.setRunDetails(currentToroDetails);

		prettifiedTime = prettyTime(currentToroDetails.remainingTime);
		console.log(db.getRunDetails());
		currentToro = db.getToroByCurrentTimer();
	};
</script>

<div class="h-screen w-screen flex flex-col items-center justify-center relative text-center">
	<h1 class="mb-6 text-3xl md:text-7xl font-semibold">{prettifiedTime}</h1>
	<div class="flex gap-4">
		<Button on:click={startTimer}>Start</Button>
		<Button on:click={pauseTimer} variant="secondary">Pause</Button>
	</div>
	<Drawer.Root>
		<Drawer.Trigger
			class="w-2/3 p-5 bg-background border rounded-md rounded-b-none absolute bottom-0 left-x-full -translete-x-full"
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
					<h2 class="text-xl mb-1">
						{currentToro?.name}
					</h2>
					<div class="flex gap-1 justify-center">
						{#each Array(currentToro?.numberOfPomodoros) as _, i}
							{#if i < currentToro?.finishedPomodoros}
								<div class="relative w-[15px] h-[15px]">
									<Square class="bg-emerald-700 absolute top-0 left-0" />
									<Check class="text-white absolute top-0 left-0" />
								</div>
							{:else if i == currentToro?.finishedPomodoros}
								<Square class="text-emerald-700" />
								{#if (currentToro?.finishedPomodoros + 1) % 4 === 0}
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
				<ul class="list-decimal ml-4">
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
