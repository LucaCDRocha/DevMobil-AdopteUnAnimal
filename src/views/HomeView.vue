<script setup>
	import { ref } from "vue";
	import SwipeableCard from "@/components/SwipeableCard.vue";

	const cards = ref([
		{
			_id: "1",
			name: "Card 1",
			description: "Description 1",
			tags: ["tag_id"],
			img: "https://picsum.photos/200/300",
			spa_id: "1",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "2",
			name: "Card 2",
			description: "Description 2",
			tags: ["tag_id"],
			img: "https://picsum.photos/200/300",
			spa_id: "2",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "3",
			name: "Card 3",
			description: "Description 3",
			tags: ["tag_id"],
			img: "https://picsum.photos/200/300",
			spa_id: "3",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "4",
			name: "Card 4",
			description: "Description 4",
			tags: ["tag_id"],
			img: "https://picsum.photos/200/300",
			spa_id: "4",
			likes_count: 0,
			dislikes_count: 0,
		},
	]);
</script>

<template>
	<div class="flex justify-center items-center w-full h-full overflow-hidden">
		<div class="relative w-80 h-96">
			<SwipeableCard v-for="(card, index) in cards" :key="card._id" :card="card" :index="index" />
		</div>
	</div>
</template>

<style scoped></style>
