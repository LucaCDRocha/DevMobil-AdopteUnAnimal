<script setup>
import { computed } from "vue";
import { transformImageData } from "@/utils/imageUtils";

const props = defineProps({
  card: Object,
});

const imageSrc = computed(() => transformImageData(props.card.pet_id.images[0]));

</script>

<template>
<div class="card card-side bg-base-100 w-full ">
	<figure>
		<img :src="imageSrc" alt="Card image" class="w-20 h-20 rounded-full" />
	</figure>
	<div class="card-body p-3">
		<h2>
			<span class=" text-lg font-bold">
				{{ card.pet_id.nom }}
			</span>
			<span class="text-sm">
				- {{  card.pet_id.spa_id.nom }}
			</span>
		</h2> 
		<p class="text-sm">{{  card.messages[card.messages.length - 1].content }}</p>
	</div>
</div>
</template>

<style scoped>
</style>
