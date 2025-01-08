<script setup>
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import { getUserIdFromToken } from "../../utils/token.js";
import { ref } from "vue";
import SmallCard from "@/components/SmallCard.vue";
import OverlayPetInfos from "@/components/OverlayPetInfos.vue";
import { getAuthHeaders } from "@/utils/authHeaders";
import { useRouter } from 'vue-router';

const router = useRouter();
const userId = getUserIdFromToken(localStorage.getItem("token"));
const spaInformations = useFetchApiCrud(`users/${userId}/spa`);
const spaName = ref("");
const pets = ref([]);
const selectedPet = ref(null);

const fetchSpaInformations = async () => {
  const { data, error } = await spaInformations.readAll(getAuthHeaders());
  if (!error) {
    spaInformations.value = data;
    spaName.value = data.nom;
    console.log(data._id);
    await fetchSpaPets(data._id); // Fetch pets after spa information is fetched
  }
};

const fetchSpaPets = async (spaId) => {
  const { data, error } = await useFetchApiCrud(`spas/${spaId}/pets`).readAll(getAuthHeaders());
  if (!error) {
    pets.value = data;
  }
};

const openEdit =(pet) =>{
  router.push({ name: 'editPet', params: { id: pet._id } });
};

fetchSpaInformations();
const openPetDetails = (pet, event) => {
  if (!event.target.closest(".btn")) {
    selectedPet.value = pet;
  }
};

const closePetDetails = () => {
  selectedPet.value = null;
};
</script>

<template>
  <div class="flex flex-col w-full items-center h-full overflow-scroll p-4">
    <h1 class="text-xl font-semibold text-center my-2">{{ spaName }}</h1>
    <h2 class="text-lg font-semibold text-center my-2">Vous avez {{ pets.length }} animaux</h2>
    <div class="flex flex-col md:w-1/2 w-full gap-4">
      <SmallCard
        v-for="(pet, index) in pets"
        :key="pet._id"
        :card="pet"
        :index="index"
        :forSpa="true"
        @clickFirstButton="openEdit(pet)"
        @click="(event) => openPetDetails(pet, event)" />
    </div>
  </div>
  <OverlayPetInfos v-if="selectedPet" :pet="selectedPet" @close="closePetDetails" />
</template>