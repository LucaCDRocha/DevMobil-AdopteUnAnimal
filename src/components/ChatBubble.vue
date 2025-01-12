<script setup>
	import { ref, defineProps } from "vue";

	const props = defineProps({
		message: Object,
		isMe: Boolean,
	});

	const formatTime = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};
</script>

<template>
	<div
		class="chat flex flex-col"
		:class="{
			'chat-start': !isMe,
			'chat-end': isMe,
		}">
		<div
			class="chat-bubble flex flex-row items-end gap-2"
			:class="{
				'chat-bubble-accent': !isMe,
				'chat-bubble-primary': isMe,
			}">
			<p>{{ message.content }}</p>
			<p class="text-xs opacity-70">{{ formatTime(message.date) }}</p>
		</div>
	</div>
</template>

<style scoped></style>
