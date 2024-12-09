<script setup>
	import { defineProps, defineEmits } from "vue";

	const props = defineProps({
		pet: Object,
	});

	const emits = defineEmits(["close"]);
</script>

<template>
	<dialog class="modal modal-open" @click.self="$emit('close')">
		<div class="modal-box max-w-2xl">
			<div class="mb-4">
				<h3 class="font-bold text-2xl">{{ pet.nom }}</h3>
			</div>
			<div class="flex flex-col gap-2">
				<p class="text-lg">{{ pet.description }}</p>
				<div class="mt-4">
					<p><strong>Age:</strong> {{ pet.age }} ans</p>
					<p><strong>Tags:</strong> {{ pet.tags.map(tag => tag.nom).join(", ") }}</p>
					<p><strong>SPA:</strong> {{ pet.spa_id.nom }}</p>
					<p><strong>Likes:</strong> {{ pet.likes_count }}</p>
					<p><strong>Dislikes:</strong> {{ pet.dislikes_count }}</p>
				</div>
			</div>
			<div class="modal-action mt-4 sticky bottom-0 justify-center">
				<button @click="$emit('close')" class="btn btn-primary w-full">Fermer</button>
			</div>
		</div>
	</dialog>
</template>

<style scoped></style>
