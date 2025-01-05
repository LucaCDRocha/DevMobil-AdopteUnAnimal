<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUserIdFromToken } from "@/utils/token";
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import { authHeaders } from "@/utils/authHeaders";

const router = useRouter();
const userInfo = ref({});

const showModalError = ref(false);
const errorMessage = ref("");

const userCrud = useFetchApiCrud('users');

const fetchUserInfo = async () => {
	const token = localStorage.getItem("token");
	const userId = getUserIdFromToken(token);

	const { data, error } = await userCrud.read(userId, authHeaders);

	if (error) {
		errorMessage.value = "Failed to fetch user info";
		showModalError.value = true;
	} else {
		userInfo.value = data;
	}
};

onMounted(() => {
	fetchUserInfo();
});

const logout = () => {
	localStorage.removeItem("token");
	router.push({ name: "login" });
};

const goToUpdateAccount = () => {
	router.push({ name: "updateAccount" });
};

const goToHistory = () => {
	router.push({ name: "history" });
};

const showModalDelete = ref(false);
const showModalDeleteSuccess = ref(false);

const deleteAccount = async () => {
	const token = localStorage.getItem("token");
	const userId = getUserIdFromToken(token);

	const { error } = await userCrud.del(userId, authHeaders);

	if (error) {
		errorMessage.value = "Failed to delete account";
		showModalError.value = true;
	} else {
		localStorage.removeItem("token");
		showModalDeleteSuccess.value = true;
	}
};

const openModalDelete = () => {
	showModalDelete.value = true;
};

const closeModalDelete = () => {
	showModalDelete.value = false;
};

const closeModalError = () => {
	showModalError.value = false;
};

const closeModalDeleteSuccess = () => {
	showModalDeleteSuccess.value = false;
	router.push({ name: "login" });
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
					<button @click="goToHistory" class="btn btn-outline btn-primary w-full">Historique des likes et dislikes</button>
				</div>
				<div class="form-control mt-2">
					<button @click="logout" class="btn btn-outline btn-primary w-full">Déconnexion</button>
				</div>
				<div class="form-control mt-2">
					<button @click="openModalDelete" class="btn btn-link text-error w-full">Supprimer le compte</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Delete Confirmation Modal -->
	<dialog v-show="showModalDelete" class="modal modal-open">
		<div class="modal-box text-center">
			<span class="material-symbols-outlined text-warning text-6xl">warning</span>
			<h3 class="text-lg font-bold mt-4">Confirmer la suppression</h3>
			<p class="py-4">Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
			<div class="modal-action">
				<button @click="deleteAccount" class="btn btn-error">Supprimer</button>
				<button @click="closeModalDelete" class="btn">Annuler</button>
			</div>
		</div>
	</dialog>

	<!-- Delete Success Modal -->
	<dialog v-show="showModalDeleteSuccess" class="modal modal-open">
		<div class="modal-box text-center">
			<span class="material-symbols-outlined text-success text-6xl">check_circle</span>
			<h3 class="text-lg font-bold mt-4">Compte supprimé</h3>
			<p class="py-4">Votre compte a été supprimé avec succès.</p>
			<div class="modal-action">
				<button @click="closeModalDeleteSuccess" class="btn">OK</button>
			</div>
		</div>
	</dialog>

	<!-- Error Modal -->
	<dialog v-show="showModalError" class="modal modal-open">
		<div class="modal-box text-center">
			<span class="material-symbols-outlined text-error text-6xl">error</span>
			<h3 class="text-lg font-bold mt-4">Erreur</h3>
			<p class="py-4">{{ errorMessage }}</p>
			<div class="modal-action">
				<button @click="closeModalError" class="btn">OK</button>
			</div>
		</div>
	</dialog>
</template>

<style scoped>
/* Add your styles here */
</style>
