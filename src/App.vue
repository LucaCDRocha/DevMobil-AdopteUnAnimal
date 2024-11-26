<script setup>
	import { RouterLink, RouterView } from "vue-router";
	import TheNav from "./components/TheNav.vue";
</script>

<template>
	<main class="h-full w-full">
		<RouterView />
	</main>

	<TheNav />
</template>

<style scoped></style>
