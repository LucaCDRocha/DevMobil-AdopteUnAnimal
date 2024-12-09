<script setup>
	import { ref } from "vue";
	import SwipeableCard from "@/components/SwipeableCard.vue";
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";

	const cards = ref([]);
	const petCrud = useFetchApiCrud("pets");
	const { isLoading, readAll, swipe, resetLikes } = petCrud;

	const fetchPets = async () => {
		const { data, error } = await readAll({
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
		if (!error) {
			cards.value = data;
		}
	};

	fetchPets();

	const handleSwipe = async (direction, cardId) => {
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

			await swipe(cardId, direction, {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			});
		}
	};
</script>

<template>
	<div v-if="isLoading" class="flex justify-center items-center h-full w-full">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
	<div v-else class="flex flex-col gap-8 justify-end items-center w-full h-full overflow-hidden pb-4">
			<div v-if="cards.length === 0" class="flex justify-center items-center h-full w-full text-center text-xl">
				Plus d'animaux à adopter.
			</div>
			<div v-else class="stack relative w-80 h-full pt-8">
				<SwipeableCard
					v-for="(card, index) in cards"
					:key="card._id"
					:card="card"
					:index="index"
					@swipe="(direction) => handleSwipe(direction, card._id)" />
			</div>
			<div v-if="cards.length > 0" class="flex justify-between mt-1 w-72 z-50">
				<button @click="handleSwipe('left')" class="btn btn-lg btn-error btn-circle">
					<span class="material-symbols-outlined fill align-middle text-3xl">close</span>
				</button>
				<button @click="handleSwipe('right')" class="btn btn-lg btn-success btn-circle">
					<span class="material-symbols-outlined fill align-middle text-3xl">favorite</span>
				</button>
			</div>
	</div>
</template>

<style scoped></style>
