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
	const adoptionsCrud = useFetchApiCrud(`adoptions/${id.value}`);
	const adoptionStatus = useFetchApiCrud(`adoptions`);
	const { isLoading } = adoptionsCrud;
	const hasSpa = localStorage.getItem("hasSpa") === "true";

	const socket = new WebSocket(import.meta.env.VITE_WS_URL);

	socket.onopen = () => {
		console.log("Connected to WebSocket server");
		socket.send(
			JSON.stringify({ type: "authenticate", userId, adoptionId: id.value, token: localStorage.getItem("token") })
		);
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
		if (message.type === "statusUpdate") {
			chat.value.status = message.status;
		} else if (message.type === "addMessage") {
			chat.value.messages.push(message);
			chat.value.groupedMessages = groupMessagesByDate(chat.value.messages);
		}
		// scroll to bottom
		const chatContainer = document.querySelector(".chat-container");
		setTimeout(() => {
			chatContainer.scrollTo({
				top: chatContainer.scrollHeight,
				behavior: "smooth",
			});
		}, 100);
	};

	const fetchChat = async () => {
		const { data, error } = await adoptionsCrud.readAll({
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
		if (!error) {
			chat.value = data;
			console.log("chat", chat.value);
			chat.value.groupedMessages = groupMessagesByDate(chat.value.messages);
		}
	};

	fetchChat();

	const sendMessage = async (e) => {
		e.preventDefault();
		const message = {
			content: newMsg.value,
			user_id: userId,
			date: new Date(),
		};
		socket.send(JSON.stringify({ type: "addMessage", adoptionId: id.value, message }));
		newMsg.value = "";
	};

	const changeStatus = async (status) => {
		try {
			await adoptionStatus.changeStatus(id.value, status, {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			});
			socket.send(JSON.stringify({ type: "statusUpdate", adoptionId: id.value, status }));
		} catch (error) {
			console.error("Failed to change status", error);
		}
	};

	onMounted(() => {
		const chatContainer = document.querySelector(".chat-container");
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
					{{ hasSpa ? chat.user_id.firstName + " " + chat.user_id.lastName : chat.pet_id.nom }}
				</span>
				<span class="text-sm"> - {{ hasSpa ? chat.pet_id.nom : chat.pet_id.spa_id.nom }} </span>
			</p>
		</div>

		<div class="absolute top-0 right-0 p-2 z-20" v-if="hasSpa">
			<details class="dropdown dropdown-end" v-if="chat.status !== 'unavailable'">
				<summary tabindex="0" class="btn m-1"><span class="material-symbols-outlined">edit</span> status</summary>
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 gap-2">
					<li><button class="btn btn-success" @click="changeStatus('accepted')">Accepter</button></li>
					<li><button class="btn btn-info" @click="changeStatus('pending')">En attente</button></li>
					<li><button class="btn btn-error" @click="changeStatus('rejected')">Rejeter</button></li>
				</ul>
			</details>
		</div>
		<div
			class="absolute top-0.5 left-1/2 -translate-x-1/2 p-2 z-20 badge"
			:class="{
				'badge-error': chat.status === 'rejected',
				'badge-success': chat.status === 'accepted',
				'badge-info': chat.status === 'pending',
				'badge-error': chat.status === 'unavailable',
			}">
			{{ chat.status === "pending" ? "En attente" : chat.status === "accepted" ? "Accepté" : chat.status === "rejected" ? "Refusé" : "Indisponible" }}
		</div>

		<div v-if="isLoading" class="flex justify-center items-center h-full w-full">
			<span class="loading loading-spinner loading-lg"></span>
		</div>

		<div v-else class="flex flex-col w-full items-center mt-12 mb-10">
			<div class="w-full" v-if="chat.groupedMessages">
				<div v-for="(messages, date) in chat.groupedMessages" :key="date" class="w-full">
					<div
						class="sticky w-fit top-12 left-1/2 -translate-x-1/2 bg-neutral text-center text-neutral-content px-3 py-0.5 rounded-full z-10">
						{{ date }}
					</div>
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
		<form
			@submit="sendMessage"
			class="absolute bottom-20 translate-y-2 left-0 flex justify-center items-end w-full p-2 bg-base-100 z-20">
			<input type="text" v-model="newMsg" placeholder="Votre message" class="input input-bordered w-full" />
			<button type="submit" class="btn btn-primary ml-2">Envoyer</button>
		</form>
	</div>
</template>
