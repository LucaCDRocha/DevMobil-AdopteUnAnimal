<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import { getUserIdFromToken } from "../../utils/token.js";
import ChatBubble from "@/components/ChatBubble.vue";

const id = ref(null);
const route = useRoute();
// id de l'adoption
id.value = route.params.id;

const userId = getUserIdFromToken(localStorage.getItem("token"));
const chat = ref([]);
const adoptionsCrud = useFetchApiCrud(`/adoptions/${id.value}`);
const { isLoading } = adoptionsCrud;

const fetchChats = async () => {
    const { data, error } = await adoptionsCrud.readAll({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (!error) {
        chat.value = data;
    }
};

fetchChats();


</script>
<template>
    <div class="flex flex-col w-full items-center h-full overflow-scroll p-4">
        <div v-if="isLoading" class="flex justify-center items-center h-full w-full">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <h2 class="absolut">
            <span class="text-lg font-bold">
                {{ chat.pet_id.nom }}
            </span>
            <span class="text-sm">
                - {{  chat.pet_id.spa_id.nom }}
            </span>
        </h2>

        <div class="w-full">
            <ChatBubble v-for="(msg, index) in chat.messages" :key="chat._id" :message="msg" :index="index"
                :isMe="msg.user_id === userId" />
        </div>

        <div class="absolut flex justify-center items-end h-full w-full">
            <input type="text" placeholder="Votre message" class="input input-bordered w-full max-w-xs" />
        </div>
    </div>
</template>
