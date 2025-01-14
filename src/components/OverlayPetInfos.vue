<script setup>
import { ref, computed } from "vue";
import { transformImageData } from "@/utils/imageUtils";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  pet: Object,
  forSpa: Boolean,
});

const emits = defineEmits(["close", "delete"]);

const currentImageIndex = ref(0);

const imageSrc = computed(() => transformImageData(props.pet.images[currentImageIndex.value]));
const showVerifMessage = ref(false);
const showVerifMessagePet = ref(null);
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

const showModal = () => {
		showVerifMessage.value = true;
	};
	const closeModal = () => {
		showVerifMessage.value = false;
	};

</script>

<template>
  <dialog class="modal modal-open" @click.self="$emit('close')">
    <div class="modal-box max-w-2xl">
      <div class="mb-4">
        <h3 class="font-bold text-2xl">{{ pet.nom }}</h3>
      </div>
      <div class="relative w-full h-64 mb-2 flex justify-center items-center">
        <button
          @click="prevImage"
          class="btn btn-circle opacity-80 mx-2 absolute left-0 z-10 text-2xl"
        >
          ‹
        </button>
        <img
          :src="imageSrc"
          alt="Pet image"
          class="w-full h-full object-cover rounded-lg"
        />
        <button
          @click="nextImage"
          class="btn btn-circle opacity-80 mx-2 absolute right-0 z-10 text-2xl align-middle text-center"
        >
          ›
        </button>
      </div>
      <div class="flex justify-center items-center mb-4">
        <div class="px-2 py-1 rounded">
          {{ currentImageIndex + 1 }} / {{ pet.images.length }}
        </div>
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
      <div  v-if="forSpa"> 
        <div class="modal-action mt-4 sticky bottom-0 justify-center">
        <button @click="showModal" class="btn btn-link w-1/3">
          Supprimer l'animal
        </button>
      </div>
      <div class="modal-action mt-4 sticky bottom-0 justify-center">
        <button @click="$emit('close')" class="btn btn-primary w-full">
          Fermer
        </button>
      </div>
    </div>
     
      <div class="modal-action mt-4 sticky bottom-0 justify-center" v-else>
        <button @click="$emit('close')" class="btn btn-primary w-full">
          Fermer
        </button>
      </div>
    </div>
  </dialog>

  <dialog v-show="showVerifMessage" class="modal modal-open">
    <div class="modal-box text-center">
      <h3 class="text-lg font-bold my-4">
        Êtes-vous sûr de vouloir supprimer {{ pet.nom }} ?
      </h3>
      <p>Cette action supprimera toutes les discussions par rapport à cet animal.</p>
      <div class="modal-action">
        <button @click="$emit('delete')" class="btn btn-error">Oui</button>
        <button @click="closeModal" class="btn">Non</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.modal-box {
  padding: 1.5rem;
}
</style>
