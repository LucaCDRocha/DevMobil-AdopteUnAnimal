<script setup>
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import { getUserIdFromToken } from "../../utils/token.js";
	import { ref, computed } from "vue";
	import ConversationCard from "@/components/ConversationCard.vue";

	const userId = getUserIdFromToken(localStorage.getItem("token"));
	const cards = ref([]);
	const adoptionsCrud = useFetchApiCrud(`users/${userId}/adoptions`);
	const { isLoading } = adoptionsCrud;

	const fetchAdoptions = async () => {
		const { data, error } = await adoptionsCrud.readAll({
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
		if (!error) {
			cards.value = data;
		}
	};

	const filterStatus = ref("all");

	const filteredCards = computed(() => {
		if (filterStatus.value === "all") {
			return cards.value;
		}
		return cards.value.filter(card => card.status === filterStatus.value);
	});

	const setFilter = (status) => {
		filterStatus.value = status;
	};

	fetchAdoptions();
</script>

<template>
	<div v-if="isLoading" class="flex justify-center items-center h-full w-full">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
	<div v-else class="flex flex-col w-full items-center h-full overflow-scroll p-4">
		<h1 class="text-2xl font-bold text-center my-4">
			Vous avez {{ cards.length }} conversation{{ cards.length > 1 ? "s" : "" }}
		</h1>

		<div class="flex justify-center my-4">
			<button @click="setFilter('all')" :class="{ 'btn-primary': filterStatus === 'all' }" class="btn mx-2">Tous</button>
			<button @click="setFilter('pending')" :class="{ 'btn-primary': filterStatus === 'pending' }" class="btn mx-2">En attente</button>
			<button @click="setFilter('accepted')" :class="{ 'btn-primary': filterStatus === 'accepted' }" class="btn mx-2">Accepté</button>
			<button @click="setFilter('rejected')" :class="{ 'btn-primary': filterStatus === 'rejected' }" class="btn mx-2">Refusé</button>
		</div>

		<div v-if="filteredCards.length === 0" class="text-center text-base-300">
			Aucune conversation trouvée pour ce statut.
		</div>
		<div v-else class="flex flex-col md:w-1/2 w-full">
			<ConversationCard v-for="card in filteredCards" :key="card._id" :card="card" />
		</div>
	</div>
</template>

<style scoped>
/* No additional styles needed as daisyUI classes are used */
</style>
