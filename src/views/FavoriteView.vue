<script setup>
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import { getUserIdFromToken } from "../utils/token.js";
	import { ref } from "vue";
	import SmallCard from "@/components/SmallCard.vue";
	import OverlayPetInfos from "@/components/OverlayPetInfos.vue";

	const userId = getUserIdFromToken(localStorage.getItem("token"));
	console.log(userId);

	const cards = ref([]);
	const petCrud = useFetchApiCrud(`users/${userId}/likes`);
	const { isLoading } = petCrud;
	const selectedPet = ref(null);

	const fetchPets = async () => {
		const { data, error } = await petCrud.readAll({
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
		if (!error) {
			console.log(data);
			cards.value = data;
		}
	};

	fetchPets();

	const openPetDetails = (pet, event) => {
		if (!event.target.closest(".btn")) {
			console.log(event.target);
			selectedPet.value = pet;
		}
	};

	const closePetDetails = () => {
		selectedPet.value = null;
	};
</script>

<template>
	<div v-if="isLoading" class="flex justify-center items-center h-full w-full">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
	<div v-else class="flex flex-col w-full items-center h-full overflow-scroll p-4">
		<h1 class="text-2xl font-bold text-center my-4">Vous aimez {{ cards.length }} animaux</h1>

		<div class="flex flex-col md:w-1/2 w-full gap-4">
			<SmallCard
				v-for="(card, index) in cards"
				:key="card._id"
				:card="card"
				:index="index"
				@click="(event) => openPetDetails(card, event)"
			/>
		</div>
	</div>

	<OverlayPetInfos v-if="selectedPet" :pet="selectedPet" @close="closePetDetails" />
</template>

<style scoped></style>
