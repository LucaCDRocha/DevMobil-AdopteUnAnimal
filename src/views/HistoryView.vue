<script setup>
	import { ref, onMounted } from "vue";
	import { getUserIdFromToken } from "@/utils/token";
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import HistoryCard from "@/components/HistoryCard.vue";
	import { getAuthHeaders } from "@/utils/authHeaders";

	const userId = getUserIdFromToken(localStorage.getItem("token"));
	const likes = ref([]);
	const dislikes = ref([]);
	const petCrudLikes = useFetchApiCrud(`users/${userId}/likes`);
	const petCrudDislikes = useFetchApiCrud(`users/${userId}/dislikes`);
	const petCrud = useFetchApiCrud("pets");
	const isLoading = ref(false);
	const isLoadingMoreLikes = ref(false);
	const isLoadingMoreDislikes = ref(false);
	const showVerifMessage = ref(false);
	const showVerifMessagePet = ref(null);
	const nomPet = ref("");

	const currentPageLikes = ref(1);
	const totalPagesLikes = ref(1);
	const totalLikes = ref(0);
	const pageSize = 4;

	const currentPageDislikes = ref(1);
	const totalPagesDislikes = ref(1);
	const totalDislikes = ref(0);

	const fetchHistory = async (pageLikes = 1, pageDislikes = 1) => {
		const {
			data: likesData,
			error: likesError,
			resHeaders: likesHeaders,
		} = await petCrudLikes.readAll(getAuthHeaders(), { page: pageLikes, pageSize });
		if (!likesError) {
			likesData.forEach((pet) => {
				if (!likes.value.some((like) => like._id === pet._id)) {
					likes.value.push(pet);
				}
			});
			totalLikes.value = parseInt(likesHeaders["pagination-total-likes"]);
			totalPagesLikes.value = parseInt(likesHeaders["pagination-total-pages"]);
		}

		const {
			data: dislikesData,
			error: dislikesError,
			resHeaders: dislikesHeaders,
		} = await petCrudDislikes.readAll(getAuthHeaders(), { page: pageDislikes, pageSize });
		if (!dislikesError) {
			dislikesData.forEach((pet) => {
				if (!dislikes.value.some((dislike) => dislike._id === pet._id)) {
					dislikes.value.push(pet);
				}
			});
			totalDislikes.value = parseInt(dislikesHeaders["pagination-total-dislikes"]);
			totalPagesDislikes.value = parseInt(dislikesHeaders["pagination-total-pages"]);
		}

		isLoading.value = false;
		isLoadingMoreLikes.value = false;
		isLoadingMoreDislikes.value = false;
	};

	const loadMoreLikes = async () => {
		if (currentPageLikes.value < totalPagesLikes.value) {
			isLoadingMoreLikes.value = true;
			currentPageLikes.value += 1;
			await fetchHistory(currentPageLikes.value, currentPageDislikes.value);
		}
	};

	const loadMoreDislikes = async () => {
		if (currentPageDislikes.value < totalPagesDislikes.value) {
			isLoadingMoreDislikes.value = true;
			currentPageDislikes.value += 1;
			await fetchHistory(currentPageLikes.value, currentPageDislikes.value);
		}
	};

	const deleteLike = async () => {
		showVerifMessage.value = false;
		const petId = showVerifMessagePet.value._id;
		likes.value = likes.value.filter((pet) => pet._id !== petId);
		await petCrud.del(`${petId}/like`, getAuthHeaders());
		totalLikes.value -= 1;
		totalPagesLikes.value = Math.ceil(totalLikes.value / pageSize);
		if (likes.value.length === 0 && currentPageLikes.value > 1) {
			currentPageLikes.value -= 1;
			await fetchHistory(currentPageLikes.value, currentPageDislikes.value);
		} else {
			await fetchHistory(currentPageLikes.value, currentPageDislikes.value);
		}
	};

	const deleteDislike = async (petId) => {
		dislikes.value = dislikes.value.filter((pet) => pet._id !== petId);
		await petCrud.del(`${petId}/dislike`, getAuthHeaders());
		totalDislikes.value -= 1;
		totalPagesDislikes.value = Math.ceil(totalDislikes.value / pageSize);
		if (dislikes.value.length === 0 && currentPageDislikes.value > 1) {
			currentPageDislikes.value -= 1;
			await fetchHistory(currentPageLikes.value, currentPageDislikes.value);
		} else {
			await fetchHistory(currentPageLikes.value, currentPageDislikes.value);
		}
	};

	const showModal = (pet) => {
		nomPet.value = pet.nom;
		showVerifMessagePet.value = pet;
		showVerifMessage.value = true;
	};
	const closeModal = () => {
		showVerifMessage.value = false;
	};

	onMounted(() => {
		fetchHistory(currentPageLikes.value, currentPageDislikes.value);
	});
</script>

<template>
	<div
		v-if="isLoading && currentPageLikes === 1 && currentPageDislikes === 1"
		class="flex justify-center items-center h-full w-full">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
	<div v-else class="flex flex-col items-center w-full h-full overflow-scroll p-4">
		<h1 class="text-2xl font-bold text-center my-4">Historique</h1>
		<div class="flex flex-col md:w-1/2 w-full gap-4">
			<div class="collapse collapse-arrow pb-5 transition-all duration-700 ease-in-out">
				<input type="checkbox" />
				<div
					class="collapse-title text-xl font-medium bg-success text-success-content rounded-b-2xl mb-4 transition-all duration-700 ease-in-out delay-150">
					Vous aimez {{ totalLikes }} {{ totalLikes > 1 || totalLikes === 0 ? " animaux" : " animal" }}
				</div>
				<div class="collapse-content flex flex-col w-full gap-4 transition-all duration-700 ease-in-out">
					<p v-if="likes.length === 0">
						Vous aimez {{ totalLikes }} {{ totalLikes > 1 || totalLikes === 0 ? " animaux" : " animal" }}
					</p>

					<HistoryCard
						v-for="(card, index) in likes"
						:key="card._id"
						:card="card"
						:index="index"
						@remove="showModal(card)" />
					<div
						v-if="currentPageLikes < totalPagesLikes || isLoadingMoreLikes"
						class="flex justify-center items-center mt-4">
						<button @click="loadMoreLikes" class="btn" :disabled="isLoadingMoreLikes">
							<span v-if="isLoadingMoreLikes" class="loading loading-spinner"></span>
							<span v-else>Charger plus</span>
						</button>
					</div>
				</div>
			</div>
			<div class="collapse collapse-arrow pb-5 transition-all duration-700 ease-in-out">
				<input type="checkbox" />
				<div
					class="collapse-title text-xl font-medium bg-error text-error-content rounded-b-2xl mb-4 transition-all duration-700 ease-in-out delay-150">
					Vous n'avez pas aimé {{ totalDislikes }}
					{{ totalDislikes > 1 || totalDislikes === 0 ? " animaux" : " animal" }}
				</div>

				<div class="collapse-content flex flex-col w-full gap-4 transition-all duration-700 ease-in-out">
					<p v-if="dislikes.length === 0">
						Vous n'avez pas aimé {{ totalDislikes }}
						{{ totalDislikes > 1 || totalDislikes === 0 ? " animaux" : " animal" }}
					</p>
					<HistoryCard
						v-for="(card, index) in dislikes"
						:key="card._id"
						:card="card"
						:index="index"
						@remove="deleteDislike(card._id)" />
					<div
						v-if="currentPageDislikes < totalPagesDislikes || isLoadingMoreDislikes"
						class="flex justify-center items-center mt-4">
						<button @click="loadMoreDislikes" class="btn" :disabled="isLoadingMoreDislikes">
							<span v-if="isLoadingMoreDislikes" class="loading loading-spinner"></span>
							<span v-else>Charger plus</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<button @click="$router.push('/account')" class="btn btn-primary btn-wide fixed bottom-24 shadow-xl">
		Retour au compte
	</button>

	<dialog v-show="showVerifMessage" class="modal modal-open">
		<div class="modal-box text-center">
			<h3 class="text-lg font-bold my-4">Voulez-vous vraiment supprimer le like pour {{ nomPet }} ?</h3>
			<p>
				La suppression du like entrainera la suppression de la discussion avec
				{{ nomPet }}
			</p>
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
