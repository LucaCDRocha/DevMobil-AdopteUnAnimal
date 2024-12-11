<script setup>
import { ref, computed } from "vue";

import { defineProps, defineEmits } from "vue";

const props = defineProps({
  pet: Object,
});

const emits = defineEmits(["close"]);
console.log(props.pet);

const currentImageIndex = ref(0);

const imageSrc = computed(() => {
  const byteArray = new Uint8Array(
    props.pet.images[currentImageIndex.value].data.data
  );
  const binaryString = byteArray.reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ""
  );
  return "data:image/jpeg;base64," + btoa(binaryString);
});

const nextImage = (event) => {
  event.stopPropagation();
  currentImageIndex.value =
    (currentImageIndex.value + 1) % props.pet.images.length;
};

const prevImage = (event) => {

  event.stopPropagation();
  currentImageIndex.value =
    (currentImageIndex.value - 1 + props.pet.images.length) %
    props.pet.images.length;
	
};

</script>

<template>
  <dialog class="modal modal-open" @click.self="$emit('close')">
    <div class="modal-box max-w-2xl">
      <div class="mb-4">
        <h3 class="font-bold text-2xl">{{ pet.nom }}</h3>
      </div>
      <div class="relative w-full h-64 mb-4">
		
        <img
          :src="imageSrc"
          alt="Pet image"
          class="w-full h-full object-cover"
        />
        <button
          @click="prevImage"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full w-10 h-10"
        >
          ‹
        </button>
        <button
          @click="nextImage"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full w-10 h-10"
        >
          ›
        </button>
      </div>
      <span v-for="tag in pet.tags" class="badge self-end">{{ tag.nom }}</span>
      <div class="flex flex-col gap-2">
        <p class="text-lg">{{ pet.description }}</p>
        <div class="mt-4">
          <p><strong>Age:</strong> {{ pet.age }} ans</p>
          <p><strong>SPA:</strong> {{ pet.spa_id.nom }}</p>
          <p><strong>Likes:</strong> {{ pet.likes_count }}</p>
          <p><strong>Dislikes:</strong> {{ pet.dislikes_count }}</p>
        </div>
      </div>
      <div class="modal-action mt-4 sticky bottom-0 justify-center">
        <button @click="$emit('close')" class="btn btn-primary w-full">
          Fermer
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
