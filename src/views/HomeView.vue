<script setup>
	import { ref } from "vue";
	import SwipeableCard from "@/components/SwipeableCard.vue";

	const cards = ref([
		{
			_id: "1",
			name: "Card 1",
			description: "Description 1",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "1",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "2",
			name: "Card 2",
			description: "Description 2",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "2",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "3",
			name: "Card 3",
			description: "Description 3",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "3",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "4",
			name: "Card 4",
			description: "Description 4",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "4",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "5",
			name: "Card 5",
			description: "Description 5",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "5",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "6",
			name: "Card 6",
			description: "Description 6",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "6",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "7",
			name: "Card 7",
			description: "Description 7",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "7",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "8",
			name: "Card 8",
			description: "Description 8",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "8",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "9",
			name: "Card 9",
			description: "Description 9",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "9",
			likes_count: 0,
			dislikes_count: 0,
		},
		{
			_id: "10",
			name: "Card 10",
			description: "Description 10",
			tags: ["tag_id"],
			img: "https://placecats.com/200/300",
			spa_id: "10",
			likes_count: 0,
			dislikes_count: 0,
		},
	]);

	const swipe = (direction) => {
		const currentCardIndex = 0;
		const currentCard = document.querySelector(`.swipeable-card-${currentCardIndex}`);
		const nextCard = document.querySelector(`.swipeable-card-${currentCardIndex + 1}`);
		if (currentCard) {
			currentCard.style.transition = "transform 0.5s ease";
			currentCard.style.transform = direction === "left" ? "translate(-100vw, 0)" : "translate(100vw, 0)";
      if (nextCard) {
        nextCard.style.transition = "transform 0.5s ease";
        nextCard.style.transform = "translate(0, 0)";
      }
			setTimeout(() => {
        if (nextCard) {
          nextCard.style.transition = "";
        }
        cards.value.splice(currentCardIndex, 1);
			}, 500);
		}
	};
</script>

<template>
	<div class="flex flex-col gap-8 justify-end items-center w-full h-full overflow-hidden pb-4">
		<div class="stack relative w-80 h-full pt-8">
			<SwipeableCard v-for="(card, index) in cards" :key="card._id" :card="card" :index="index" @swipe="swipe" />
		</div>
		<div class="flex justify-between mt-1 w-72 z-50">
			<button @click="swipe('left')" class="btn btn-lg btn-error btn-circle">
				<span class="material-symbols-outlined fill align-middle text-3xl">close</span>
			</button>
			<button @click="swipe('right')" class="btn btn-lg btn-success btn-circle">
				<span class="material-symbols-outlined fill align-middle text-3xl">favorite</span>
			</button>
		</div>
	</div>
</template>

<style scoped>
</style>
