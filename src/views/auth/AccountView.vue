<script setup>
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	const router = useRouter();
	const userInfo = ref({});

	const fetchUserInfo = async () => {
		const token = localStorage.getItem("token");
		const userId = localStorage.getItem("user_id");

		const response = await fetch(`/api/users/${userId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			userInfo.value = await response.json();
		} else {
			alert("Failed to fetch user info");
		}
	};

	onMounted(() => {
		fetchUserInfo();
	});

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user_id");
		router.push({ name: "login" });
	};

	const goToUpdateAccount = () => {
		router.push({ name: "updateAccount" });
	};
</script>

<template>
	<div class="flex flex-col items-center justify-center h-full w-full bg-base-200">
		<div class="card w-80 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Compte</h2>
				<div class="space-y-2">
					<p><strong>Prénom :</strong> {{ userInfo.firstName }}</p>
					<p><strong>Nom :</strong> {{ userInfo.lastName }}</p>
					<p><strong>Email :</strong> {{ userInfo.email }}</p>
				</div>
				<div class="form-control mt-6">
					<button @click="goToUpdateAccount" class="btn btn-primary w-full">Modifier le compte</button>
				</div>
				<div class="form-control mt-2">
					<button @click="logout" class="btn btn-secondary w-full">Déconnexion</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Add your styles here */
</style>
