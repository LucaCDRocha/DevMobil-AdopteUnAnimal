<script setup>
	import { ref, onMounted } from "vue";
	import { getUserIdFromToken } from "@/utils/token";
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import HistoryCard from "@/components/HistoryCard.vue";

	const userId = getUserIdFromToken(localStorage.getItem("token"));
	const likes = ref([]);
	const dislikes = ref([]);
	const petCrudLikes = useFetchApiCrud(`users/${userId}/likes`);
	const petCrudDislikes = useFetchApiCrud(`users/${userId}/dislikes`);
	const petCrud = useFetchApiCrud("pets");
	const isLoading = ref(false);

	const fetchHistory = async () => {
		isLoading.value = true;
		const { data: likesData, error: likesError } = await petCrudLikes.readAll(
			{
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			"likes"
		);
		if (!likesError) {
			likes.value = likesData;
			likes.value.reverse();
		}

		const { data: dislikesData, error: dislikesError } = await petCrudDislikes.readAll(
			{
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			"dislikes"
		);
		if (!dislikesError) {
			dislikes.value = dislikesData;
			dislikes.value.reverse();
		}
		isLoading.value = false;
	};

	const deleteLike = async (petId) => {
		likes.value = likes.value.filter((pet) => pet._id !== petId);
		await petCrud.del(`${petId}/like`, {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
	};

	const deleteDislike = async (petId) => {
		dislikes.value = dislikes.value.filter((pet) => pet._id !== petId);
		await petCrud.del(`${petId}/dislike`, {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
	};

	onMounted(() => {
		fetchHistory();
	});
</script>

<template>
	<div v-if="isLoading" class="flex justify-center items-center h-full w-full">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
	<div v-else class="flex flex-col items-center w-full h-full overflow-scroll p-4">
		<h1 class="text-2xl font-bold text-center my-4">Historique</h1>
		<div class="flex flex-col md:w-1/2 w-full gap-4">
			<div class="collapse collapse-arrow pb-5 transition-all duration-700 ease-in-out">
				<input type="checkbox" />
				<div
					class="collapse-title text-xl font-medium bg-success text-success-content rounded-b-2xl mb-4 transition-all duration-700 ease-in-out delay-150">
					Vous avez {{ likes.length }} likes
				</div>
				<div class="collapse-content flex flex-col w-full gap-4 transition-all duration-700 ease-in-out">
					<p v-if="likes.length === 0">Vous avez aimé {{ dislikes.length }} animaux</p>

					<HistoryCard
						v-for="(card, index) in likes"
						:key="card._id"
						:card="card"
						:index="index"
						@click="deleteLike(card._id)" />
				</div>
			</div>
			<div class="collapse collapse-arrow pb-5 transition-all duration-700 ease-in-out">
				<input type="checkbox" />
				<div
					class="collapse-title text-xl font-medium bg-error text-error-content rounded-b-2xl mb-4 transition-all duration-700 ease-in-out delay-150">
					Vous avez {{ dislikes.length }} dislikes
				</div>

				<div class="collapse-content flex flex-col w-full gap-4 transition-all duration-700 ease-in-out">
					<p v-if="dislikes.length === 0">Vous n'avez pas aimé {{ dislikes.length }} animaux</p>
					<HistoryCard
						v-for="(card, index) in dislikes"
						:key="card._id"
						:card="card"
						:index="index"
						@click="deleteDislike(card._id)" />
				</div>
			</div>
		</div>
	</div>
	<button @click="$router.push('/account')" class="btn btn-primary btn-wide fixed bottom-24 shadow-xl">
		Retour au compte
	</button>
</template>

<style scoped></style>
