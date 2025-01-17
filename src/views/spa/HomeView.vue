<script setup>
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import { getUserIdFromToken } from "../../utils/token.js";
	import { ref } from "vue";
	import SmallCard from "@/components/SmallCard.vue";
	import OverlayPetInfos from "@/components/OverlayPetInfos.vue";
	import { getAuthHeaders } from "@/utils/authHeaders";
	import { useRouter } from "vue-router";
	import ConversationCard from "@/components/ConversationCard.vue";

	const router = useRouter();
	const userId = getUserIdFromToken(localStorage.getItem("token"));
	const spaInformations = useFetchApiCrud(`users/${userId}/spa`);
	const spaName = ref("");
	const pets = ref([]);
	const selectedPet = ref(null);
	const showDiscussions = ref(false);
	const adoptions = ref([]);
	const nomPet = ref("");

	const fetchSpaInformations = async () => {
		const { data, error } = await spaInformations.readAll(getAuthHeaders());
		if (!error) {
			spaInformations.value = data;
			spaName.value = data.nom;
			await fetchSpaPets(data._id); // Fetch pets after spa information is fetched
		}
	};

	const fetchSpaPets = async (spaId) => {
		const { data, error } = await useFetchApiCrud(`spas/${spaId}/pets`).readAll(getAuthHeaders());
		if (!error) {
			pets.value = data;
		}
	};

	const openEdit = (pet) => {
		router.push({ name: "editPet", params: { id: pet._id } });
	};

	fetchSpaInformations();

	const openPetDetails = (pet, event) => {
		if (!event.target.closest(".btn")) {
			selectedPet.value = pet;
		}
	};
	const deletePet = async () => {	
		const { del } = useFetchApiCrud('pets');
  const { error } = await del(selectedPet.value._id, getAuthHeaders());
  if (!error) {
    pets.value = pets.value.filter(pet => pet._id !== selectedPet.value._id);
    selectedPet.value = null;
  } else {
    console.error('Error deleting pet');
  }
	};

	const closePetDetails = () => {
		selectedPet.value = null;
	};

	const fetchAdoptions = async (petID) => {
		const { data, error } = await useFetchApiCrud(`pets/${petID}/adoptions`).readAll(getAuthHeaders());
		if (!error) {
			adoptions.value = data;
		}
	};
	const showModal = async (pet, nom) => {
		nomPet.value = nom;
		await fetchAdoptions(pet._id);
		showDiscussions.value = true;
	};
	const closeModal = () => {
		showDiscussions.value = false;
	};
</script>

<template>
	<div class="flex flex-col w-full items-center h-full overflow-scroll p-4">
		<h1 class="text-xl font-semibold text-center my-2">{{ spaName }}</h1>
		<h2 class="text-lg font-semibold text-center my-2">Vous avez {{ pets.length }} {{pets.length >1 || pets.length ===0 ? " animaux":" animal"}}</h2>
		<div class="flex flex-col md:w-1/2 w-full gap-4">
			<SmallCard
				v-for="(pet, index) in pets"
				:key="pet._id"
				:card="pet"
				:index="index"
				:forSpa="true"
				@clickFirstButton="openEdit(pet)"
				@click="(event) => openPetDetails(pet, event)"
				@clickChatButton="showModal(pet, pet.nom)" />
		</div>
	</div>
	<OverlayPetInfos v-if="selectedPet" :pet="selectedPet" @close="closePetDetails" @delete="deletePet" :forSpa="true" />

	<!-- Success Modal -->
	<dialog v-show="showDiscussions" class="modal modal-open">
		<div class="modal-box text-center">
			<h3 class="text-lg font-bold my-4" v-if="adoptions.length === 0">Il y a aucune discussion pour {{ nomPet }}</h3>
			<h3 class="text-lg font-bold my-4" v-else>
				Il y a {{ adoptions.length }} discussion{{ adoptions.length > 1 ? 's' : '' }} pour {{ nomPet }} :
			</h3>
			<ConversationCard v-for="adoption in adoptions" :key="adoption._id" :card="adoption" :forSpa="true" />
			<div class="modal-action">
				<button @click="closeModal" class="btn">fermer</button>
			</div>
		</div>
	</dialog>
</template>
