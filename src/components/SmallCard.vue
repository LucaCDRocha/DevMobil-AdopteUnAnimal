<script setup>
import { computed } from "vue";

const props = defineProps({
  card: Object,
});

console.log(props.card);

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
		<img :src="imageSrc" alt="Card image" class="w-32 h-full object-cover" />
	</figure>
	<div class="card-body p-3">
		<h2 class="card-title text-lg font-bold">{{ card.nom }}</h2>
		<p class="text-sm">{{  card.spa_id.nom }}</p>
	</div>
	<div class="btn btn-primary self-center mr-5">
		<span class="material-symbols-outlined fill align-middle">chat</span>
	</div>
</div>
</template>

<style scoped>
</style>
