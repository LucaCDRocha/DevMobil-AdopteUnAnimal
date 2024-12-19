<script setup>
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import { getUserIdFromToken } from "../../utils/token.js";
import { ref } from "vue";
import SmallCard from "@/components/ConversationCard.vue";
import ConversationCard from "@/components/ConversationCard.vue";

const userId = getUserIdFromToken(localStorage.getItem("token"));
// const likes = ref([]);
const cards = ref([]);
const adoptionsCrud = useFetchApiCrud(`/adoptions`);
// const petCrud = useFetchApiCrud('pets');
const { isLoading } = adoptionsCrud;

const fetchAdoptions = async () => {
  const { data, error } = await adoptionsCrud.readAll({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });
  if (!error) {
    cards.value = data;
    console.log(data);
    // console.log(cards.value[0].messages[0].content); 
    // afficher le dernier message dans la console
    // console.log(cards.value[0].messages[cards.value[0].messages.length - 1].content);

  }
};

fetchAdoptions();


// const deleteLike = async (petId) => {
//     likes.value = likes.value.filter(pet => pet._id !== petId);
// 	await petCrud.del(`${petId}/like`, {
// 		Authorization: `Bearer ${localStorage.getItem("token")}`,
// 	});
// };
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
      Vous avez {{ cards.length }} conversation.s
    </h1>

    <div class="flex flex-col md:w-1/2 w-full gap-4">
      <ConversationCard
        v-for="(card, index) in cards"
        :key="card._id"
        :card="card"
        :index="index"
      />
    </div>
  </div>

</template>

<style scoped></style>





<!-- <script setup>
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import { ref, onMounted } from "vue";
import ConversationCard from "@/components/ConversationCard.vue";

const adoptionsInfo = ref([]);
const msgCrud = useFetchApiCrud('adoptions');

const fetchMsgs = async () => {
    const token = localStorage.getItem("token");

    const { data, error } = await msgCrud.readAll({
        Authorization: `Bearer ${token}`,
    });

    if (error) {
        console.log("Failed to fetch messages");
    } else {
        adoptionsInfo.value = data;
    }
};

onMounted(() => {
    fetchMsgs();
});

console.log(adoptionsInfo);
</script>

<template>
  <div>
    <div v-for="adoption in adoptionsInfo" :key="adoption.id" class="mb-4">
      <ConversationCard :card="adoption" :lastMessage="adoption.lastMessage" />
    </div>
  </div>
</template>

<style scoped>
/* Add styles if needed */
</style> -->