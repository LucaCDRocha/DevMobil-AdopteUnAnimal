<script setup>
	import { RouterLink, RouterView, useRoute } from "vue-router";
	import TheNav from "./components/TheNav.vue";

	const route = useRoute();
</script>

<template>
	<main class="flex justify-center items-center h-full w-full">
		<RouterView />
	</main>

	<TheNav v-if="route.name !== 'login' && route.name !== 'register'" />
</template>

<style scoped></style>
