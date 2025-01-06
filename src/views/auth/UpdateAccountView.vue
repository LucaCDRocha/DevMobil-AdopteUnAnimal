<script setup>
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";
	import { getUserIdFromToken } from "@/utils/token";
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import { getAuthHeaders } from "@/utils/authHeaders";

	const router = useRouter();
	const userId = ref(null);
	const firstName = ref("");
	const lastName = ref("");
	const email = ref("");
	const password = ref("");
	const showModalSuccess = ref(false);
	const showModalFailure = ref(false);

	const userCrud = useFetchApiCrud('users');

	const fetchUserInfo = async () => {
		const token = localStorage.getItem("token");
		userId.value = getUserIdFromToken(token);

		const { data, error } = await userCrud.read(userId.value, getAuthHeaders());

		if (error) {
			alert("Failed to fetch user info");
		} else {
			firstName.value = data.firstName;
			lastName.value = data.lastName;
			email.value = data.email;
		}
	};

	onMounted(() => {
		fetchUserInfo();
	});

	const updateAccount = async () => {
		const { error } = await userCrud.update(userId.value, {
			firstName: firstName.value,
			lastName: lastName.value,
			email: email.value,
			password: password.value,
		}, getAuthHeaders());

		if (error) {
			showModalFailure.value = true;
		} else {
			showModalSuccess.value = true;
		}
	};

	const closeModalSuccess = () => {
		showModalSuccess.value = false;
		router.push({ name: "account" });
	};

	const closeModalFailure = () => {
		showModalFailure.value = false;
	};

	const goToAccount = () => {
		router.push({ name: "account" });
	};
</script>

<template>
	<div class="flex flex-col items-center justify-center h-full w-full bg-base-200">
		<div class="card w-80 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Modifier le compte</h2>
				<form @submit.prevent="updateAccount" class="space-y-4">
					<div class="form-control">
						<label for="firstName" class="label">
							<span class="label-text">Prénom :</span>
						</label>
						<input id="firstName" v-model="firstName" type="text" class="input input-bordered w-full" />
					</div>
					<div class="form-control">
						<label for="lastName" class="label">
							<span class="label-text">Nom :</span>
						</label>
						<input id="lastName" v-model="lastName" type="text" class="input input-bordered w-full" />
					</div>
					<div class="form-control">
						<label for="email" class="label">
							<span class="label-text">Email :</span>
						</label>
						<input id="email" v-model="email" type="email" class="input input-bordered w-full" />
					</div>
					<div class="form-control">
						<label for="password" class="label">
							<span class="label-text">Mot de passe :</span>
						</label>
						<input id="password" v-model="password" type="password" class="input input-bordered w-full" />
					</div>
					<button type="submit" class="btn btn-primary w-full">Modifier le compte</button>
				</form>
				<div class="form-control mt-2">
					<button @click="goToAccount" class="btn btn-outline btn-primary w-full">Retour au compte</button>
				</div>
			</div>
		</div>

		<!-- Success Modal -->
		<dialog v-show="showModalSuccess" class="modal modal-open">
			<div class="modal-box text-center">
				<span class="material-symbols-outlined text-success text-6xl">check_circle</span>
				<h3 class="text-lg font-bold mt-4">Compte mis à jour</h3>
				<p class="py-4">Votre compte a été mis à jour avec succès.</p>
				<div class="modal-action">
					<button @click="closeModalSuccess" class="btn">OK</button>
				</div>
			</div>
		</dialog>

		<!-- Failure Modal -->
		<dialog v-show="showModalFailure" class="modal modal-open">
			<div class="modal-box text-center">
				<span class="material-symbols-outlined text-error text-6xl">error</span>
				<h3 class="text-lg font-bold mt-4">Échec de la mise à jour</h3>
				<p class="py-4">La mise à jour de votre compte a échoué. Veuillez réessayer.</p>
				<div class="modal-action">
					<button @click="closeModalFailure" class="btn">OK</button>
				</div>
			</div>
		</dialog>
	</div>
</template>

<style scoped>
	/* Add your styles here */
</style>
