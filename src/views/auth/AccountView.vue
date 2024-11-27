<script setup>
	import { useRouter } from "vue-router";

	const router = useRouter();

	const logout = () => {
		localStorage.removeItem("token");
		router.push({ name: "login" });
	};
</script>

<template>
	<h1 class="text-5xl">Account</h1>
	<button @click="logout" class="btn btn-primary">Logout</button>
</template>

<style></style>
