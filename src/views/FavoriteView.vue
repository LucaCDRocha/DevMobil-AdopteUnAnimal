<script setup>
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import { getUserIdFromToken } from "../utils/token.js";
	import { ref } from "vue";
	import SmallCard from "@/components/SmallCard.vue";
	import OverlayPetInfos from "@/components/OverlayPetInfos.vue";
	import { getAuthHeaders } from "@/utils/authHeaders";
	import router from "@/router/index.js";

	const userId = getUserIdFromToken(localStorage.getItem("token"));
	const likes = ref([]);
	const cards = ref([]);
	const petCrudFavorite = useFetchApiCrud(`users/${userId}/likes`);
	const petCrud = useFetchApiCrud("pets");
	const adoptionCrud = useFetchApiCrud("adoptions");
	const { isLoading } = petCrudFavorite;
	const selectedPet = ref(null);
	const emit = defineEmits(["remove"]);
	const showVerifMessage = ref(false);
	const showVerifMessagePet = ref(null);
	const nomPet = ref("");

	const fetchPets = async () => {
		const { data, error } = await petCrudFavorite.readAll(getAuthHeaders());
		if (!error) {
			cards.value = data;
			cards.value.reverse();
			console.log(cards.value);
		}
	};

	fetchPets();

	const openPetDetails = (pet, event) => {
		if (!event.target.closest(".btn")) {
			selectedPet.value = pet;
		}
	};

	const closePetDetails = () => {
		selectedPet.value = null;
	};

	const deleteLike = async () => {
		showVerifMessage.value = false;
		cards.value = cards.value.filter((c) => c._id !== showVerifMessagePet.value._id);
		likes.value = likes.value.filter((pet) => pet._id !== showVerifMessagePet.value._id);
		await petCrud.del(`${showVerifMessagePet.value._id}/like`, getAuthHeaders());
	};

	const createAdoption = async (pet) => {
		if (pet.adoptionId === null) {
			const newAdoption = await adoptionCrud.create({ pet_id: pet._id }, getAuthHeaders());
			router.push({ name: "chat", params: { id: newAdoption.data._id } });
		} else {
			router.push({ name: "chat", params: { id: pet.adoptionId } });
		}
	};
	const showModal = (pet) => {
		console.log(pet);
		nomPet.value = pet.nom;
		showVerifMessagePet.value = pet;
		showVerifMessage.value = true;
	};
	const closeModal = () => {
		showVerifMessage.value = false;
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
				:forSpa="false"
				@clickFirstButton="showModal(card)"
				@click="(event) => openPetDetails(card, event)"
				@clickChatButton="createAdoption(card)" />
		</div>
	</div>

	<OverlayPetInfos v-if="selectedPet" :pet="selectedPet" @close="closePetDetails" />

	<dialog v-show="showVerifMessage" class="modal modal-open">
		<div class="modal-box text-center">
			<h3 class="text-lg font-bold my-4">Voulez-vous vraiment supprimer le like pour {{ nomPet }} ?</h3>
			<p>La suppression du like entrainera à la suppression de la discussion avec {{ nomPet }}</p>
			<div class="modal-action">
				<div class="btn btn-error self-center mr-5" @click="deleteLike">
					<span>Oui, supprimer</span>
				</div>
				<div class="btn btn-success self-center mr-5" @click="closeModal">
					<span>Non, annuler</span>
				</div>
			</div>
		</div>
	</dialog>
</template>


<style scoped></style>
