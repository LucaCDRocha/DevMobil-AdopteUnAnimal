<script setup>
	import { useRoute } from "vue-router";
	import { onMounted, onUnmounted, ref } from "vue";
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

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const today = new Date();
		if (date.toDateString() === today.toDateString()) {
			return "Aujourd'hui";
		}
		return date.toLocaleDateString();
	};

	const groupMessagesByDate = (messages) => {
		return messages.reduce((acc, message) => {
			const date = formatDate(message.date);
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(message);
			return acc;
		}, {});
	};

	socket.onmessage = (event) => {
		const message = JSON.parse(event.data);
		chat.value.messages.push(message);
		chat.value.groupedMessages = groupMessagesByDate(chat.value.messages);
		// scroll to bottom
		const chatContainer = document.querySelector(".chat-container");
		setTimeout(() => {
			chatContainer.scrollTo({
				top: chatContainer.scrollHeight,
				behavior: "smooth",
			});
		}, 100);
	};

	const fetchChats = async () => {
		const { data, error } = await adoptionsCrud.readAll({
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
		if (!error) {
			chat.value = data;
			chat.value.groupedMessages = groupMessagesByDate(chat.value.messages);
			console.log(chat.value);
		}
	};

	fetchChats();

	const send = async (e) => {
		e.preventDefault();
		const message = {
			content: newMsg.value,
			user_id: userId,
			date: new Date(),
		};
		socket.send(JSON.stringify({ adoptionId: id.value, message }));
		newMsg.value = "";
	};

	onMounted(() => {
		const chatContainer = document.querySelector(".chat-container");
		console.log(chatContainer);
		setTimeout(() => {
			chatContainer.scrollTo({
				top: chatContainer.scrollHeight,
				behavior: "smooth",
			});
		}, 1000);
	});

	onUnmounted(() => {
		socket.close();
	});
</script>
<template>
	<div class="chat-container flex flex-col w-full items-start h-full overflow-scroll p-4">
		<div class="absolute top-0 left-0 w-full h-fit flex p-2 items-center z-20 bg-base-100">
			<button class="btn btn-square absolute" @click="$router.go(-1)">
				<span class="material-symbols-outlined">arrow_back</span>
			</button>
			<p class="w-full text-center p-2" v-if="chat.pet_id">
				<span class="text-lg font-bold">
					{{ chat.pet_id.nom }}
				</span>
				<span class="text-sm"> - {{ chat.pet_id.spa_id.nom }} </span>
			</p>
		</div>

		<div v-if="isLoading" class="flex justify-center items-center h-full w-full">
			<span class="loading loading-spinner loading-lg"></span>
		</div>

		<div v-else class="flex flex-col w-full items-center mt-3 mb-16">
			<div class="w-full" v-if="chat.groupedMessages">
				<div v-for="(messages, date) in chat.groupedMessages" :key="date" class="w-full">
					<div class="sticky w-fit top-12 left-1/2 -translate-x-1/2 bg-neutral text-center text-neutral-content px-3 py-0.5 rounded-full z-10">{{ date }}</div>
					<ChatBubble
						v-for="(msg, index) in messages"
						class="mb-2 z-0"
						:key="msg._id"
						:message="msg"
						:index="index"
						:isMe="msg.user_id === userId" />
				</div>
			</div>
		</div>
		<form @submit="send" class="absolute bottom-20 translate-y-2 left-0 flex justify-center items-end w-full p-2 bg-base-100 z-20">
			<input type="text" v-model="newMsg" placeholder="Votre message" class="input input-bordered w-full" />
			<button type="submit" class="btn btn-primary ml-2">Envoyer</button>
		</form>
	</div>
</template>
