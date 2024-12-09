<script setup>
import { ref, onMounted } from "vue";
import { getUserIdFromToken } from "@/utils/token";
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import SmallCard from "@/components/SmallCard.vue";

const userId = getUserIdFromToken(localStorage.getItem("token"));
const likes = ref([]);
const dislikes = ref([]);
const petCrudLikes = useFetchApiCrud(`users/${userId}/likes`);
const petCrudDislikes = useFetchApiCrud(`users/${userId}/dislikes`);
const petCrud = useFetchApiCrud('pets');

const fetchHistory = async () => {
	const { data: likesData, error: likesError } = await petCrudLikes.readAll({
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	}, 'likes');
	if (!likesError) {
		likes.value = likesData;
	}

	const { data: dislikesData, error: dislikesError } = await petCrudDislikes.readAll({
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	}, 'dislikes');
	if (!dislikesError) {
		dislikes.value = dislikesData;
	}
};

const deleteLike = async (petId) => {
    likes.value = likes.value.filter(pet => pet._id !== petId);
	await petCrud.del(`${petId}/like`, {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	});
};

const deleteDislike = async (petId) => {
    dislikes.value = dislikes.value.filter(pet => pet._id !== petId);
	await petCrud.del(`${petId}/dislike`, {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	});
};

onMounted(() => {
	fetchHistory();
});
</script>

<template>
	<div class="flex flex-col items-center w-full h-full overflow-scroll p-4">
		<h1 class="text-2xl font-bold text-center my-4">Historique des likes et dislikes</h1>
		<div class="w-full md:w-1/2">
			<h2 class="text-xl font-semibold my-2">Likes</h2>
			<div class="flex flex-col gap-4">
				<SmallCard v-for="(card, index) in likes" :key="card._id" :card="card" :index="index" @click="deleteLike(card._id)" />
			</div>
		</div>
		<div class="w-full md:w-1/2 mt-8">
			<h2 class="text-xl font-semibold my-2">Dislikes</h2>
			<div class="flex flex-col gap-4">
				<SmallCard v-for="(card, index) in dislikes" :key="card._id" :card="card" :index="index" @click="deleteDislike(card._id)" />
			</div>
		</div>
	</div>
</template>

<style scoped></style>