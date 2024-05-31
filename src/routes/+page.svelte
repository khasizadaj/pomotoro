<script lang="ts">
	import logoOrange from '$lib/assets/logo-orange.svg';
	import logoOrangeSmall from '$lib/assets/logo-orange-small.svg';

	import { Button } from '$lib/components/ui/button/index.js';
	import waveLines from '$lib/assets/wave-lines.svg';
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-1"></div>
	<div class="col-span-10 grid grid-rows-12 h-screen min-h-fit">
		<div class="py-4 flex items-center justify-between row-span-1">
			<div class="h-5 w-max" id="logo">
				<img
					src={logoOrange}
					srcset="{logoOrange}, {logoOrangeSmall} 320w"
					alt="Orange logo which reads POMOTORO"
					class="w-full h-full"
				/>
			</div>
			<div class="flex items-center gap-2">
				<Button href="/login" variant="secondary">Log in</Button>
				<Button href="/signup">Sign up</Button>
			</div>
		</div>
		<div class="row-span-11 relative">
			<div class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 -z-10 w-screen opacity-50">
				<img class="w-full h-full" src={waveLines} alt="4 wavy lines behind hero section" />
			</div>
			<div class="h-full w-full flex flex-col items-center justify-center relative text-center">
				<h1 class="mb-6 text-2xl md:text-5xl font-semibold">value your every minute</h1>
				<p class="mb-8 text-lg md:text-2xl text-muted-foreground">
					increase your productivity with pomodoro technique
				</p>
				<Button size="lg" href="/app">Work with Pomotoro</Button>
			</div>
		</div>
	</div>
	<div class="col-span-1"></div>
</div>
