<script setup>
	import { ref, watch, onMounted, onBeforeUnmount } from "vue";
	import { useRouter } from "vue-router";
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";

	const firstName = ref("");
	const lastName = ref("");
	const email = ref("");
	const password = ref("");
	const isSpa = ref(false); // Nouvelle propriété pour la case à cocher
	const spaName = ref(""); // Propriété pour le nom de la SPA
	const spaAddress = ref(""); // Propriété pour l'adresse de la SPA
	const spaLatitude = ref(""); // Propriété pour la latitude de la SPA
	const spaLongitude = ref(""); // Propriété pour la longitude de la SPA
	const spaFullAddress = ref(""); // Propriété pour l'adresse complète de la SPA
	const currentStep = ref(1);
	const router = useRouter();

	const userCrud = useFetchApiCrud("users");
	const spaCrud = useFetchApiCrud("spas"); // Ajout de la logique pour créer une SPA

	const register = async () => {
		const user = {
			firstName: firstName.value,
			lastName: lastName.value,
			email: email.value,
			password: password.value,
		};
		const { data, error } = await userCrud.create(user, {
			"Content-Type": "application/json",
		});

		if (error) {
			console.error("Error registering");
		} else {
			const { data: loginData, error: loginError } = await userCrud.login(
				{ email: email.value, password: password.value },
				{
					"Content-Type": "application/json",
				}
			);
			if (loginError) {
				console.error("Error logging in after registration");
			} else {
				localStorage.setItem("token", loginData.token);
				if (isSpa.value) {
					const spa = {
						nom: spaName.value,
						adresse: spaAddress.value,
						latitude: spaLatitude.value,
						longitude: spaLongitude.value,
					};
					await spaCrud.create(spa, {
						"Content-Type": "application/json",
						Authorization: `Bearer ${loginData.token}`,
					});
				}
				localStorage.setItem("token", loginData.token);
				localStorage.setItem("hasSpa", isSpa.value);
				router.push({ name: "home" });
			}
		}
	};

	let debounceTimeout;

	const fetchCoordinates = async (address) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
			);
			const data = await response.json();
			if (data && data.length > 0) {
				spaLatitude.value = data[0].lat;
				spaLongitude.value = data[0].lon;
				spaFullAddress.value = data[0].display_name;
			}
		} catch (error) {
			console.error("Error fetching coordinates:", error);
		}
	};

	const handleAddressInput = (event) => {
		const newAddress = event.target.value;
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		debounceTimeout = setTimeout(() => {
			if (newAddress) {
				fetchCoordinates(newAddress);
			}
		}, 1000); // Adjust the debounce delay as needed
	};

	onMounted(() => {
		const addressInput = document.getElementById("spaAddress");
		if (addressInput) {
			addressInput.addEventListener("input", handleAddressInput);
		}
	});

	onBeforeUnmount(() => {
		const addressInput = document.getElementById("spaAddress");
		if (addressInput) {
			addressInput.removeEventListener("input", handleAddressInput);
		}
	});

	const goToLogin = () => {
		router.push({ name: "login" });
	};

	const nextStep = () => {
		if (currentStep.value === 1 && (!firstName.value || !lastName.value || !email.value || !password.value)) {
			alert("Please fill out all fields in this step.");
			return;
		}
		if (
			currentStep.value === 2 &&
			isSpa.value &&
			(!spaName.value || !spaAddress.value || !spaLatitude.value || !spaLongitude.value)
		) {
			alert("Please fill out all fields in this step.");
			return;
		}
		if (currentStep.value < 3) {
			currentStep.value++;
		}
	};

	const prevStep = () => {
		if (currentStep.value > 1) {
			currentStep.value--;
		}
	};
</script>

<template>
	<div class="flex flex-col items-center justify-center h-full w-full bg-base-200">
		<div class="card w-80 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Inscription</h2>
				<form @submit.prevent="register" class="space-y-4">
					<div v-if="currentStep === 1">
						<div class="form-control">
							<label for="firstName" class="label">
								<span class="label-text">Prénom :</span>
							</label>
							<input type="text" id="firstName" v-model="firstName" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label for="lastName" class="label">
								<span class="label-text">Nom :</span>
							</label>
							<input type="text" id="lastName" v-model="lastName" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label for="email" class="label">
								<span class="label-text">Email :</span>
							</label>
							<input type="email" id="email" v-model="email" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label for="password" class="label">
								<span class="label-text">Mot de passe :</span>
							</label>
							<input type="password" id="password" v-model="password" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label class="cursor-pointer label">
								<span class="label-text">Créer une SPA</span>
								<input
									type="checkbox"
									v-model="isSpa"
									class="checkbox checkbox-primary"
									@change="isSpa = $event.target.checked" />
							</label>
						</div>
					</div>
					<div v-if="currentStep === 2 && isSpa">
						<div class="form-control">
							<label for="spaName" class="label">
								<span class="label-text">Nom de la SPA :</span>
							</label>
							<input type="text" id="spaName" v-model="spaName" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label for="spaAddress" class="label">
								<span class="label-text">Adresse de la SPA :</span>
							</label>
							<input
								type="text"
								id="spaAddress"
								v-model="spaAddress"
								class="input input-bordered"
								required
								@input="handleAddressInput" />
						</div>
						<div v-if="spaFullAddress" class="mt-2 text-sm text-gray-600">
							<p><strong>Adresse complète:</strong> {{ spaFullAddress }}</p>
						</div>
					</div>
					<div class="form-control mt-6 flex-row justify-between gap-2">
						<button
							type="button"
							class="btn btn-secondary btn-wide flex-shrink"
							@click="prevStep"
							v-if="currentStep > 1">
							Précédent
						</button>
						<button
							type="button"
							class="btn btn-primary btn-wide flex-shrink"
							@click="nextStep"
							v-if="currentStep === 1 && isSpa">
							Suivant
						</button>
						<button
							type="submit"
							class="btn btn-primary btn-wide flex-shrink"
							v-if="(currentStep === 1 && !isSpa) || (currentStep === 2 && isSpa)">
							Inscription
						</button>
					</div>
				</form>
				<div class="form-control mt-2">
					<button @click="goToLogin" class="btn btn-secondary">Aller à la connexion</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	/* Add your styles here */
</style>
