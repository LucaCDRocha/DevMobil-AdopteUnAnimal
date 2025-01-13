<script setup>
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import { getUserIdFromToken } from "../../utils/token.js";
	import { ref } from "vue";
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

		<div class="flex flex-col md:w-1/2 w-full">
			<ConversationCard v-for="card in cards" :key="card._id" :card="card" />
		</div>
	</div>
</template>

<style scoped></style>
