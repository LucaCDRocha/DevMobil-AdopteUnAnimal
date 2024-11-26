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

	const swipe = (direction) => {
		const currentCardIndex = cards.value.length - 1;
		const currentCard = document.querySelector(`.swipeable-card-${currentCardIndex}`);
		if (currentCard) {
			currentCard.style.transition = 'transform 0.5s ease';
			currentCard.style.transform = direction === "left" ? 'translate(-100vw, 0)' : 'translate(100vw, 0)';
			setTimeout(() => {
				cards.value.splice(currentCardIndex, 1);
			}, 500);
		}
	};
</script>

<template>
	<div class="flex flex-col gap-8 justify-end items-center w-full h-full overflow-hidden">
		<div class="relative w-80 h-96">
			<SwipeableCard v-for="(card, index) in cards" :key="card._id" :card="card" :index="index" @swipe="swipe" />
		</div>
		<div class="flex justify-around m-4 w-full">
			<button @click="swipe('left')" class="btn btn-lg btn-error btn-circle">
				<span class="material-symbols-outlined fill align-middle text-3xl">close</span>
			</button>
			<button @click="swipe('right')" class="btn btn-lg btn-success btn-circle">
				<span class="material-symbols-outlined fill align-middle text-3xl">favorite</span>
			</button>
		</div>
	</div>
</template>

<style scoped></style>