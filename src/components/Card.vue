<script setup>
	import { computed } from 'vue';
	import { transformImageData } from "@/utils/imageUtils";

	const props = defineProps({
		card: Object,
	});
	const imageSrc = computed(() => transformImageData(props.card.images[0]));
</script>

<template>
	<div class="card w-full h-full bg-base-100 shadow-xl rounded-lg overflow-hidden">
		<img
			:src="imageSrc"
			alt="Card image"
			class="w-full h-2/3 object-cover" />
		<div class="p-4 flex flex-col">
			<div class="flex flex-wrap justify-end gap-2 mb-2">
				<span v-for="tag in card.tags" :key="tag.nom" class="badge">{{ tag.nom }}</span>
			</div>
			<h3 class="text-lg font-bold">{{ card.nom }}</h3>
			<p class="text-gray-600">{{ card.description }}</p>
		</div>
	</div>
</template>

<style scoped>
</style>
