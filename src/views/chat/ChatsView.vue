<script setup>
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import { getUserIdFromToken } from "../../utils/token.js";
import { ref, computed } from "vue";
import ConversationCard from "@/components/ConversationCard.vue";

const userId = getUserIdFromToken(localStorage.getItem("token"));
const cards = ref([]);
const adoptionsCrud = useFetchApiCrud(`users/${userId}/adoptions`);
const { isLoading } = adoptionsCrud;
const hasSpa = localStorage.getItem("hasSpa") === "true";

const fetchAdoptions = async () => {
  const { data, error } = await adoptionsCrud.readAll({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  if (!error) {
    cards.value = data;
  }
};

const filterStatus = ref("all");

const filteredCards = computed(() => {
  if (filterStatus.value === "all") {
    return cards.value;
  }
  return cards.value.filter((card) => card.status === filterStatus.value);
});

const setFilter = (status) => {
  filterStatus.value = status;
};

fetchAdoptions();
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-full w-full">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
  <div
    v-else
    class="flex flex-col w-full items-center h-full overflow-scroll p-4"
  >
    <h1 class="text-2xl font-bold text-center my-4">
      Vous avez {{ cards.length }} conversation{{ cards.length > 1 ? "s" : "" }}
    </h1>
	<details class="dropdown dropdown-bottom dropdown-end indicator">
      <summary tabindex="0" role="button" class="btn m-1">Filtres</summary>
      <ul tabindex="0" class="dropdown-content left-1/2 transform -translate-x-1/2 menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow gap-2">
        <li>
          <div @click="setFilter('all')" class="menu-item flex justify-between items-center btn" :class="{ 'btn-primary': filterStatus === 'all' }">
            <span>Tous</span>
          </div>
        </li>
        <li>
          <div @click="setFilter('pending')" class="menu-item flex justify-between items-center btn" :class="{ 'btn-primary': filterStatus === 'pending' }">
            <span>En attente</span>
          </div>
        </li>
        <li>
          <div @click="setFilter('accepted')" class="menu-item flex justify-between items-center btn" :class="{ 'btn-primary': filterStatus === 'accepted' }">
            <span>Accepté</span>
          </div>
        </li>
        <li>
          <div @click="setFilter('rejected')" class="menu-item flex justify-between items-center btn" :class="{ 'btn-primary': filterStatus === 'rejected' }">
            <span>Refusé</span>
          </div>
        </li>
        <li>
          <div @click="setFilter('unavailable')" class="menu-item flex justify-between items-center btn" :class="{ 'btn-primary': filterStatus === 'unavailable' }">
            <span>Indisponible</span>
          </div>
        </li>
      </ul>
    </details>

    <div v-if="filteredCards.length === 0" class="text-center text-base-300">
      Aucune conversation trouvée pour ce statut.
    </div>
    <div v-else class="flex flex-col md:w-1/2 w-full">
      <ConversationCard
        v-for="card in filteredCards"
        :key="card._id"
        :card="card"
        :for-spa="hasSpa"
      />
    </div>
  </div>
</template>

<style scoped>
/* No additional styles needed as daisyUI classes are used */
</style>
