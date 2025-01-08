<script setup>
import { ref, defineProps, } from "vue";

const props = defineProps({
	message: Object,
	isMe: Boolean
});

</script>

<template>
	<div :class="{
		'chat': true,
		'chat-start': !isMe,
		'chat-end': isMe,
	}">
		<div :class="{
			'chat-bubble': true,
			'chat-bubble-info': !isMe,
			'chat-bubble-secondary': isMe
		}">
			{{ message.content }}
		</div>
	</div>
</template>

<style scoped></style>
