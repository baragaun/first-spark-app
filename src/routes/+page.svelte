<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<div
	class="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 text-center"
>
	<h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
		Welcome to First Spark
	</h1>

	<p class="mx-auto max-w-[700px] text-lg text-muted-foreground">
		The future is changing rapidly as it never has before.
	</p>

	<div class="flex flex-wrap items-center justify-center gap-4">
		<Button
			variant="default"
			size="lg"
			class="shadow-lg transition-all hover:scale-105 hover:shadow-primary/25 active:scale-100"
		>
			Get Started
		</Button>
	</div>
</div>
