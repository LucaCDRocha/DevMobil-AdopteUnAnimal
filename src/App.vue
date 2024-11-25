<script setup>
	import { RouterLink, RouterView } from "vue-router";
</script>

<template>
	<nav>
		<RouterLink class="btn" to="/">Home</RouterLink>
		<RouterLink class="btn" to="/about">About</RouterLink>
	</nav>

	<main>
		<RouterView />
	</main>
</template>

<style scoped></style>
