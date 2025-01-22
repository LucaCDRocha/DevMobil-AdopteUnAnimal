<script setup>
	import { useRoute } from "vue-router";
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import { getAuthHeaders } from "@/utils/authHeaders";

	const spaName = ref("");
	const spaAddress = ref("");
	const spaLatitude = ref("");
	const spaLongitude = ref("");
	const spaFullAddress = ref("");
	const router = useRouter();

	const id = ref(null);
	const route = useRoute();
	// id de l'adoption
	id.value = route.params.id;

	console.log(id.value);

	const spaCrud = useFetchApiCrud("spas");

	const fetchSpaDetails = async () => {
		const { data, error } = await spaCrud.read(id.value, getAuthHeaders());
		if (error) {
			console.error("Error fetching SPA details");
		} else {
			console.log(data);
			spaName.value = data.nom;
			spaAddress.value = data.adresse;
			spaLatitude.value = data.latitude;
			spaLongitude.value = data.longitude;
			spaFullAddress.value = data.fullAddress;
		}
	};

	const updateSpa = async () => {
		const spa = {
			nom: spaName.value,
			adresse: spaAddress.value,
			latitude: spaLatitude.value,
			longitude: spaLongitude.value,
		};
		const { error } = await spaCrud.update(id.value, spa, {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		});
		if (error) {
			console.error("Error updating SPA");
		} else {
			router.push({ name: "home" });
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
		fetchSpaDetails();
		const addressInput = document.getElementById("spaAddress");
		if (addressInput) {
			addressInput.addEventListener("input", handleAddressInput);
		}
	});
</script>

<template>
	<div class="flex flex-col items-center justify-center h-full w-full bg-base-200">
		<div class="card w-80 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Modifier la SPA</h2>
				<form @submit.prevent="updateSpa" class="space-y-4">
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
					<div class="form-control mt-6">
						<button type="submit" class="btn btn-primary btn-wide">Mettre à jour</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<style scoped>
	/* Add your styles here */
</style>
