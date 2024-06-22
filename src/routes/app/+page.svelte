<script lang="ts">
	import { Check, LapTimer, PieChart, Square } from '$lib/icons/';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Database, RunDetails } from '$lib/db';

	export let data: any;

	const db: Database = data.db;
	console.log(db.getToros());
	console.log(db.getToroById(1));
	console.log(db.getRunDetails());
	console.log(db.getToroByCurrentTimer());

	let toros = db.getToros();

	const prettyTime = (time: number) => {
		console.log(time);
		console.trace();
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
		if (!currentToroDetails) {
			return null;
		}
		let intervalId = setInterval(() => {
			currentToroDetails.decrement();
			if (currentToroDetails.isFinished()) {
				resetTimerV2();
				return;
			}
			prettifiedTime = prettyTime(currentToroDetails.remainingTime);
		}, 1000);
		currentToroDetails.intervalId = intervalId;
		db.setRunDetails(currentToroDetails);
	};

	const stopTimer = () => {
		clearInterval(timerId);
	};

	const resetTimerV2 = () => {
		let currentToroDetails = db.getRunDetails();
		clearInterval(currentToroDetails?.intervalId);
		// this function should update run details accordingly
		currentToroDetails?.setNext();
		prettifiedTime = prettyTime(currentToroDetails.remainingTime);
		// toro whould be updated here when the timer is finished
		// if (runDetails.currentToro.finishedPomodoros === runDetails.currentToro.numberOfPomodoros) {
		// 	runDetails.currentToro.isActive = false;
		// 	runDetails.currentToro.isFinished = true;
		// }
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
						{db.getToroByCurrentTimer()?.name}
					</h2>
					<div class="flex gap-1 justify-center">
						{#each Array(db.getToroByCurrentTimer()?.numberOfPomodoros) as _, i}
							{#if i < db.getToroByCurrentTimer()?.finishedPomodoros}
								<div class="relative w-[15px] h-[15px]">
									<Square class="bg-emerald-700 absolute top-0 left-0" />
									<Check class="text-white absolute top-0 left-0" />
								</div>
							{:else if i == db.getToroByCurrentTimer()?.finishedPomodoros}
								<Square class="text-emerald-700" />
								{#if (db.getToroByCurrentTimer()?.finishedPomodoros + 1) % 4 === 0}
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
