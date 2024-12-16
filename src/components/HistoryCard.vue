<script setup>
import { computed } from "vue";

const props = defineProps({
  card: Object,
});

const emit = defineEmits(["remove"]);

const handleFavoriteClick = () => {
  emit("remove", props.card);
};
const imageSrc = computed(() => {
  const byteArray = new Uint8Array(props.card.images[0].data.data);
  const binaryString = byteArray.reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ""
  );
  return "data:image/jpeg;base64," + btoa(binaryString);
});
</script>

<template>
<div class="card card-side bg-base-100 shadow-xl w-full ">
	<figure>
		<img :src="imageSrc" alt="Card image" class="w-28 h-28 object-cover" />
	</figure>
	<div class="card-body p-3">
		<h2 class="card-title text-lg font-bold">{{ card.nom }}</h2>
		<p class="text-sm">{{  card.spa_id.nom }}</p>
	</div>
	<div class="btn btn-error self-center mr-5 " @click="handleFavoriteClick">
		<span class="material-symbols-outlined fill align-middle">close</span>
	</div>
	

</div>
</template>

<style scoped>
</style>
