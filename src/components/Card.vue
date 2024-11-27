<script setup>
	const props = defineProps({
		card: Object,
	});
</script>

<template>
	<div class="card w-full h-full bg-base-100 shadow-xl rounded-lg overflow-hidden">
		<img :src="card.img" alt="Card image" class="w-full h-2/3 object-cover" />
		<div class="p-4 flex flex-col">
			<span v-for="tag in card.tags" class="badge self-end">{{ tag }}</span>
			<h3 class="text-lg font-bold">{{ card.name }}</h3>
			<p class="text-gray-600">{{ card.description }}</p>
		</div>
	</div>
</template>

<style scoped>
	/* Add styles for card if needed */
</style>
