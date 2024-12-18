<script setup>
	import { ref } from "vue";
	import SwipeableCard from "@/components/SwipeableCard.vue";
	import OverlayPetInfos from "@/components/OverlayPetInfos.vue";
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";

	const cards = ref([]);
	const petCrud = useFetchApiCrud("pets");
	const { isLoading, readAll, swipe } = petCrud;
	const selectedPet = ref(null);

	const tags = ref([]);
	const tagCrud = useFetchApiCrud("tags");
	const { readAll: readAllTags } = tagCrud;
	const selectedTags = ref([]);

	const fetchTags = async () => {
		const { data, error } = await readAllTags({
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
		if (!error) {
			tags.value = data;
			console.log(data);
		}
	};

	const fetchPets = async () => {
		const { data, error } = await readAll(
			{
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			{
				tags: selectedTags.value.map(tag => tag._id).join(","),
			}
		);
		if (!error) {
			cards.value = data;
			console.log(data);
		}
	};

	fetchPets();
	fetchTags();

	const handleSwipe = async (direction, cardId = null) => {
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

			if (cardId) {
				await swipe(cardId, direction, {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				});
			}
		}
	};

	const openPetDetails = (pet, event) => {
		if (!event.target.closest(".btn")) {
			selectedPet.value = pet;
		}
	};

	const closePetDetails = () => {
		selectedPet.value = null;
	};

	const toggleTagSelection = (tag) => {
		const index = selectedTags.value.indexOf(tag);
		if (index === -1) {
			selectedTags.value.push(tag);
		} else {
			selectedTags.value.splice(index, 1);
		}
		fetchPets();
	};

	const clearFilters = () => {
		selectedTags.value = [];
		fetchPets();
	};
</script>

<template>
	<div v-if="isLoading" class="flex justify-center items-center h-full w-full">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
	<div v-else class="flex flex-col gap-8 justify-end items-center w-full h-full overflow-hidden pb-4">
		<div v-if="cards.length === 0" class="flex flex-col justify-center items-center h-full w-full text-xl">
			Plus d'animaux disponibles.
			<button v-if="selectedTags.length" @click="clearFilters" class="btn btn-primary mt-4">Effacer les filtres</button>
		</div>
		<div v-else class="stack relative w-80 h-full pt-8">
			<SwipeableCard
				v-for="(card, index) in cards"
				:key="card._id"
				:card="card"
				:index="index"
				@swipe="(direction) => handleSwipe(direction, card._id)"
				@click="(event) => openPetDetails(card, event)" />
		</div>
		<div v-if="cards.length > 0" class="flex justify-between mt-1 w-72 z-50">
			<button @click="() => handleSwipe('left', cards[0]._id)" class="btn btn-lg btn-error btn-circle">
				<span class="material-symbols-outlined fill align-middle text-3xl">close</span>
			</button>
			<button @click="() => handleSwipe('right', cards[0]._id)" class="btn btn-lg btn-success btn-circle">
				<span class="material-symbols-outlined fill align-middle text-3xl">favorite</span>
			</button>
		</div>
	</div>

	<div v-if="cards.length !== 0" class="dropdown dropdown-top indicator absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50">
		<span v-if="selectedTags.length" class="indicator-item badge badge-accent top-2 right-2">{{
			selectedTags.length
		}}</span>
		<span tabindex="0" role="button" class="btn m-1">Filtre</span>
		<ul
			tabindex="0"
			class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow left-1/2 transform -translate-x-1/2">
			<li v-for="tag in tags" :key="tag._id">
				<div
					@click="() => toggleTagSelection(tag)"
					class="menu-item flex justify-between items-center btn"
					:class="{ 'btn-accent': selectedTags.includes(tag) }">
					<span>{{ tag.nom }}</span>
				</div>
			</li>
		</ul>
	</div>

	<OverlayPetInfos v-if="selectedPet" :pet="selectedPet" @close="closePetDetails" />
</template>

<style scoped></style>
