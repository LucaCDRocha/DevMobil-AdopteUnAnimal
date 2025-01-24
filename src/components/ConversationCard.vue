<script setup>
	import { computed } from "vue";
	import { RouterLink, useRouter } from "vue-router";
	import { transformImageData } from "@/utils/imageUtils";

	const router = useRouter();

	const props = defineProps({
		card: Object,
		forSpa: Boolean,
	});

	const imageSrc = computed(() => transformImageData(props.card.pet_id.images[0]));
</script>

<template>
	<RouterLink
		class="card card-side bg-base-100 w-full hover:bg-primary hover:bg-opacity-25 pl-2 indicator"
		:to="'/chats/' + props.card._id">
		<div class="avatar card-side self-center">
			<div class="w-16 h-16 rounded-full">
				<img :src="imageSrc" alt="pet image" />
			</div>
		</div>
		<div class="card-body p-3 items-start">
			<h2>
				<span class="text-lg font-bold">
					{{ forSpa ? card.user_id.firstName : card.pet_id.nom }}
				</span>
				<span class="text-sm"> - {{ forSpa ? card.pet_id.nom : card.pet_id.spa_id.nom }} </span>
			</h2>
			<p class="text-sm text-start" v-if="card.messages.length > 0">
				{{ card.messages[card.messages.length - 1].content }}
			</p>
		</div>
		<span
			class="indicator-item indicator-start left-10 indicator-bottom badge"
			:class="{
				'badge-info': card.status === 'pending',
				'badge-error': card.status === 'rejected' || card.status === 'unavailable',
				'badge-success': card.status === 'accepted',
			}"
			>{{
				card.status === "pending"
					? "En attente"
					: card.status === "accepted"
					? "Accepté"
					: card.status === "rejected"
					? "Refusé"
					: "Indisponible"
			}}
		</span>
	</RouterLink>
	<div class="divider"></div>
</template>

<style scoped></style>
