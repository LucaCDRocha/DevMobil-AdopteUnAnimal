<script setup>
import { computed } from "vue";
import { transformImageData } from "@/utils/imageUtils";

const props = defineProps({
	card: Object,
	forSpa: Boolean,
});

const emit = defineEmits(["clickFirstButton", "clickChatButton"]);

const handleClickFirstButton = () => {
	emit("clickFirstButton", props.card);
};
const handleChatButton = () => {
	emit("clickChatButton", props.card);
};

const imageSrc = computed(() => transformImageData(props.card.images[0]));
</script>

<template>
	<div class="card card-side bg-base-100 shadow-xl w-full">
		<figure>
			<img :src="imageSrc" alt="Card image" class="w-28 h-28 object-cover" />
		</figure>
		<div class="card-body p-3">
			<h2 class="card-title text-lg font-bold">{{ card.nom }}<span v-if="card.isAdopted" class="text-success text-sm">Adopté</span></h2>
			<p class="text-sm">{{ card.spa_id.nom }}</p>
		</div>
		<div class="btn btn-error self-center mr-5" @click="handleClickFirstButton">
			<span class="material-symbols-outlined fill align-middle">{{ forSpa ? "edit" : "heart_broken" }}</span>
		</div>
		<div class="btn btn-success self-center mr-5" @click="handleChatButton">
			<span class="material-symbols-outlined fill align-middle">{{ card.adoptionId || forSpa ? 'chat' : 'add_comment' }}</span>
		</div>
	</div>
</template>

<style scoped></style>
