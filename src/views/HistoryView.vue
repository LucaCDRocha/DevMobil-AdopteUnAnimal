<script setup>
import { ref, onMounted } from "vue";
import { getUserIdFromToken } from "@/utils/token";
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import HistoryCard from "@/components/HistoryCard.vue";
import { getAuthHeaders } from "@/utils/authHeaders";

const userId = getUserIdFromToken(localStorage.getItem("token"));
const likes = ref([]);
const dislikes = ref([]);
const petCrudLikes = useFetchApiCrud(`users/${userId}/likes`);
const petCrudDislikes = useFetchApiCrud(`users/${userId}/dislikes`);
const petCrud = useFetchApiCrud("pets");
const isLoading = ref(false);
const showVerifMessage = ref(false);
const showVerifMessagePet = ref(null);
const nomPet = ref("");

const fetchHistory = async () => {
  isLoading.value = true;
  const { data: likesData, error: likesError } = await petCrudLikes.readAll(
    getAuthHeaders()
  );
  if (!likesError) {
    likes.value = likesData;
    likes.value.reverse();
  }

  const { data: dislikesData, error: dislikesError } =
    await petCrudDislikes.readAll(getAuthHeaders());
  if (!dislikesError) {
    dislikes.value = dislikesData;
    dislikes.value.reverse();
  }
  isLoading.value = false;
};

const deleteLike = async () => {
  showVerifMessage.value = false;
  likes.value = likes.value.filter(
    (pet) => pet._id !== showVerifMessagePet.value._id
  );
  await petCrud.del(`${showVerifMessagePet.value._id}/like`, getAuthHeaders());
};

const deleteDislike = async (petId) => {
  dislikes.value = dislikes.value.filter((pet) => pet._id !== petId);
  await petCrud.del(`${petId}/dislike`, getAuthHeaders());
};

const showModal = (pet) => {
  nomPet.value = pet.nom;
  showVerifMessagePet.value = pet;
  showVerifMessage.value = true;
};
const closeModal = () => {
  showVerifMessage.value = false;
};
onMounted(() => {
  fetchHistory();
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-full w-full">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
  <div
    v-else
    class="flex flex-col items-center w-full h-full overflow-scroll p-4"
  >
    <h1 class="text-2xl font-bold text-center my-4">Historique</h1>
    <div class="flex flex-col md:w-1/2 w-full gap-4">
      <div
        class="collapse collapse-arrow pb-5 transition-all duration-700 ease-in-out"
      >
        <input type="checkbox" />
        <div
          class="collapse-title text-xl font-medium bg-success text-success-content rounded-b-2xl mb-4 transition-all duration-700 ease-in-out delay-150"
        >
          Vous aimez {{ likes.length }} {{likes.length >1 || likes.length ===0 ? " animaux":" animal"}}

        </div>
        <div
          class="collapse-content flex flex-col w-full gap-4 transition-all duration-700 ease-in-out"
        >
          <p v-if="likes.length === 0">
            Vous aimez {{ likes.length }} {{likes.length >1 || likes.length ===0 ? " animaux":" animal"}}
          </p>

          <HistoryCard
            v-for="(card, index) in likes"
            :key="card._id"
            :card="card"
            :index="index"
            @remove="showModal(card)"
          />
        </div>
      </div>
      <div
        class="collapse collapse-arrow pb-5 transition-all duration-700 ease-in-out"
      >
        <input type="checkbox" />
        <div
          class="collapse-title text-xl font-medium bg-error text-error-content rounded-b-2xl mb-4 transition-all duration-700 ease-in-out delay-150"
        >
        Vous n'avez pas aimé {{ dislikes.length }} {{dislikes.length >1 || dislikes.length ===0 ? " animaux":" animal"}}

        </div>

        <div
          class="collapse-content flex flex-col w-full gap-4 transition-all duration-700 ease-in-out"
        >
          <p v-if="dislikes.length === 0">
            Vous n'avez pas aimé {{ dislikes.length }} {{dislikes.length >1 || dislikes.length ===0 ? " animaux":" animal"}}
          </p>
          <HistoryCard
            v-for="(card, index) in dislikes"
            :key="card._id"
            :card="card"
            :index="index"
            @remove="deleteDislike(card._id)"
          />
        </div>
      </div>
    </div>
  </div>
  <button
    @click="$router.push('/account')"
    class="btn btn-primary btn-wide fixed bottom-24 shadow-xl"
  >
    Retour au compte
  </button>

  <dialog v-show="showVerifMessage" class="modal modal-open">
    <div class="modal-box text-center">
      <h3 class="text-lg font-bold my-4">
        Voulez-vous vraiment supprimer le like pour {{ nomPet }} ?
      </h3>
      <p>
        La suppression du like entrainera à la suppression de la discussion avec
        {{ nomPet }}
      </p>
      <div class="modal-action">
        <div class="btn btn-error self-center mr-5" @click="deleteLike">
          <span>Oui, supprimer</span>
        </div>
        <div class="btn btn-success self-center mr-5" @click="closeModal">
          <span>Non, annuler</span>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>
