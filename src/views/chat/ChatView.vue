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
const newMsg = ref("");
const adoptionsCrud = useFetchApiCrud(`/adoptions/${id.value}`);
const { isLoading } = adoptionsCrud;

const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
    console.log("Connected to WebSocket server");
    socket.send(JSON.stringify({ type: "authenticate", userId, adoptionId: id.value }));
};

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    chat.value.messages.push(message);
};

const fetchChats = async () => {
    const { data, error } = await adoptionsCrud.readAll({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (!error) {
        chat.value = data;
        console.log(chat.value);
    }
};

fetchChats();

const send = async (e) => {
    e.preventDefault();
    const message = {
        content: newMsg.value,
        user_id: userId,
        date: new Date()
    };
    socket.send(JSON.stringify({ adoptionId: id.value, message }));
    newMsg.value = "";
};

</script>
<template>
    <div class="flex flex-col w-full items-start h-full overflow-scroll p-4">
        <button class="btn btn-square absolute" @click="$router.go(-1)">
            <span class="material-symbols-outlined">arrow_back</span>
        </button>

        <div v-if="isLoading" class="flex justify-center items-center h-full w-full">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else class="flex flex-col w-full items-center mt-3">
            <p class="mb-6" v-if="chat.pet_id">
                <span class="text-lg font-bold">
                    {{ chat.pet_id.nom }}
                </span>
                <span class="text-sm">
                    - {{ chat.pet_id.spa_id.nom }}
                </span>
            </p>

            <div class="w-full" v-if="chat.messages">
                <ChatBubble v-for="(msg, index) in chat.messages" class="mb-2" :key="chat._id" :message="msg"
                    :index="index" :isMe="msg.user_id === userId" />
            </div>

        </div>
        <form @submit="send" class="absolute bottom-20 left-0 flex justify-center items-end w-full p-4">
            <input type="text" v-model="newMsg" placeholder="Votre message" class="input input-bordered w-full" />
            <button type="submit" class="btn btn-primary ml-2">Envoyer</button>
        </form>
    </div>
</template>
