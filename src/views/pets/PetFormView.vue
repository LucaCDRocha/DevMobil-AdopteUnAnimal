<script setup>
	import { ref, onMounted, watch } from "vue";
	import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
	import { useRouter, useRoute } from "vue-router";
	import { processImage } from "@/utils/imageProcessing";
	import { transformImageData } from "@/utils/imageUtils";
	import CameraComponent from "@/components/CameraComponent.vue";
	import { getAuthHeaders } from "@/utils/authHeaders";

	const pet = ref({
		nom: "",
		age: "",
		description: "",
		tags: [],
		images: [],
	});

	const availableTags = ref([]);
	const selectedTags = ref([]);
	const currentStep = ref(1);
	const showModalSuccess = ref(false);
	const showModalFailure = ref(false);
	const showModalValidationError = ref(false);
	const validationErrorMessage = ref("");
	const isLoadingImage = ref(false);

	const { create, read: fetchPet, update } = useFetchApiCrud("pets");
	const { readAll: fetchTags } = useFetchApiCrud("tags");
	const router = useRouter();
	const route = useRoute();
	const isEdit = ref(route.name === "editPet");

	const toggleTag = (tagId) => {
		if (selectedTags.value.includes(tagId)) {
			selectedTags.value = selectedTags.value.filter((id) => id !== tagId);
		} else if (selectedTags.value.length < 4) {
			selectedTags.value.push(tagId);
		}
	};

	const processAndAddImage = async (imageDataUrl, imageType) => {
		isLoadingImage.value = true;
		try {
			const compressedImageDataUrl = await processImage(imageDataUrl, imageType);
			const response = await fetch(compressedImageDataUrl);
			const blob = await response.blob();
			const buffer = await blob.arrayBuffer();
			pet.value.images.push({
				data: Array.from(new Uint8Array(buffer)),
				imgType: imageType,
				src: compressedImageDataUrl,
			});
		} catch (error) {
			console.error("Error processing image:", error);
		}
		isLoadingImage.value = false;
	};

	const handleFileUpload = async (event) => {
		const files = event.target.files;
		if (pet.value.images.length + files.length > 3) {
			validationErrorMessage.value = "You can only upload up to 3 images.";
			showModalValidationError.value = true;
			return;
		}
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const imageDataUrl = URL.createObjectURL(file);
			await processAndAddImage(imageDataUrl, file.type);
		}
	};

	const captureImage = async (imageData) => {
		if (pet.value.images.length >= 3) {
			validationErrorMessage.value = "You can only upload up to 3 images.";
			showModalValidationError.value = true;
			return;
		}
		await processAndAddImage(imageData, "image/jpeg");
		closeCamera();
	};

	const submitForm = async () => {
		const petData = {
			...pet.value,
			tags: [...selectedTags.value],
			images: pet.value.images.map((image) => ({ data: image.data, imgType: image.imgType })),
		};
		const { data, error } = isEdit.value
			? await update(route.params.id, petData, getAuthHeaders())
			: await create(petData, getAuthHeaders());
		if (!error) {
			showModalSuccess.value = true;
		} else {
			showModalFailure.value = true;
		}
	};

	const initializeForm = async () => {
		const { data, error } = await fetchTags();
		if (!error) {
			availableTags.value = data;
		}
		if (isEdit.value) {
			const { data: petData, error: petError } = await fetchPet(route.params.id, getAuthHeaders());
			if (!petError) {
				pet.value = petData;
				selectedTags.value = petData.tags.map((tag) => tag._id);
				pet.value.images = petData.images.map((image) => ({
					...image,
					src: transformImageData(image),
				}));
			}
		} else {
			pet.value = {
				nom: "",
				age: "",
				description: "",
				tags: [],
				images: [],
			};
		}
	};

	onMounted(initializeForm);

	watch(route, async (newRoute) => {
		isEdit.value = newRoute.name === "editPet";
		await initializeForm();
	});

	const nextStep = () => {
		if (currentStep.value === 1 && (!pet.value.nom || !pet.value.age || !pet.value.description)) {
			validationErrorMessage.value = "Please fill out all fields in this step.";
			showModalValidationError.value = true;
			return;
		}
		if (currentStep.value === 2 && pet.value.images.length === 0) {
			validationErrorMessage.value = "Please upload at least one image.";
			showModalValidationError.value = true;
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

	const closeModalSuccess = () => {
		showModalSuccess.value = false;
		router.push("/");
	};

	const closeModalFailure = () => {
		showModalFailure.value = false;
	};

	const closeModalValidationError = () => {
		showModalValidationError.value = false;
	};

	const showCamera = ref(false);

	const openCamera = () => {
		showCamera.value = true;
	};

	const closeCamera = () => {
		showCamera.value = false;
	};

	const fileInput = ref(null);

	const openFileDialog = () => {
		fileInput.value.click();
	};

	const removeImage = (index) => {
		pet.value.images.splice(index, 1);
	};
</script>

<template>
	<div class="flex flex-col items-center justify-center h-full py-4 w-full overflow-scroll bg-base-200">
		<div class="card w-80 overflow-scroll bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{{ isEdit ? "Modifier l'animal" : "Ajouter un nouvel animal" }}</h2>
				<form @submit.prevent="submitForm" class="space-y-4">
					<div v-if="currentStep === 1">
						<div class="form-control">
							<label for="nom" class="label">
								<span class="label-text">Nom :</span>
							</label>
							<input type="text" id="nom" v-model="pet.nom" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label for="age" class="label">
								<span class="label-text">Âge :</span>
							</label>
							<input type="number" id="age" v-model="pet.age" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label for="description" class="label">
								<span class="label-text">Description :</span>
							</label>
							<textarea
								id="description"
								v-model="pet.description"
								class="textarea textarea-bordered"
								required></textarea>
						</div>
					</div>
					<div v-if="currentStep === 2">
						<div class="form-control">
							<label for="images" class="label flex flex-col items-start">
								<span class="label-text">Images :</span>
								<p class="text-sm text-base-300">Vous pouvez télécharger jusqu'à 3 images</p>
							</label>
							<div v-if="pet.images.length > 0 || isLoadingImage">
								<h3 class="text-lg font-bold">Images sélectionnées :</h3>
								<div class="flex flex-wrap gap-5 mt-4 items-center">
									<div v-for="(image, index) in pet.images" :key="index" class="indicator">
										<img :src="image.src" alt="Selected Image" class="w-28 h-28 object-cover" />
										<button
											type="button"
											@click="removeImage(index)"
											class="indicator-item badge badge-error h-8 w-8 material-symbols-outlined text-xl">
											delete
										</button>
									</div>
									<div v-if="isLoadingImage" class="w-24 h-24 flex justify-center items-center">
										<span class="loading loading-spinner loading-lg"></span>
									</div>
								</div>
							</div>
							<input
								type="file"
								id="images"
								ref="fileInput"
								@change="handleFileUpload"
								class="hidden"
								multiple />
							<div class="flex flex-col gap-2 my-2">
								<button
									type="button"
									class="btn btn-primary btn-wide flex-shrink material-symbols-outlined text-xl"
									@click="openFileDialog"
									:disabled="pet.images.length >= 3 || isLoadingImage">
									upload
								</button>
								<button
									type="button"
									class="btn btn-secondary btn-wide flex-shrink material-symbols-outlined text-xl"
									@click="openCamera"
									:disabled="pet.images.length >= 3 || isLoadingImage">
									photo_camera
								</button>
							</div>
						</div>
					</div>
					<div v-if="currentStep === 3">
						<div class="form-control">
							<label class="label">
								<span class="label-text">Tags :</span>
							</label>
							<p class="text-sm text-base-300 mb-2">Sélectionnez jusqu'à 4 tags</p>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="tag in availableTags"
									:key="tag._id"
									:class="[
										'badge',
										'cursor-pointer',
										selectedTags.includes(tag._id) ? 'badge-primary' : 'badge-outline',
									]"
									@click="toggleTag(tag._id)">
									{{ tag.nom }}
								</span>
							</div>
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
							v-if="currentStep < 3">
							Suivant
						</button>
						<button type="submit" class="btn btn-primary btn-wide flex-shrink" v-if="currentStep === 3">
							{{ isEdit ? "Mettre à jour l'animal" : "Ajouter l'animal" }}
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Success Modal -->
		<dialog v-show="showModalSuccess" class="modal modal-open">
			<div class="modal-box text-center">
				<span class="material-symbols-outlined text-success text-6xl">check_circle</span>
				<h3 class="text-lg font-bold mt-4">Animal {{ isEdit ? "mis à jour" : "ajouté" }} avec succès</h3>
				<p class="py-4">Votre animal a été {{ isEdit ? "mis à jour" : "ajouté" }} avec succès.</p>
				<div class="modal-action">
					<button @click="closeModalSuccess" class="btn">OK</button>
				</div>
			</div>
		</dialog>

		<!-- Failure Modal -->
		<dialog v-show="showModalFailure" class="modal modal-open">
			<div class="modal-box text-center">
				<span class="material-symbols-outlined text-error text-6xl">error</span>
				<h3 class="text-lg font-bold mt-4">Échec de {{ isEdit ? "la mise à jour" : "l'ajout" }} de l'animal</h3>
				<p class="py-4">
					Une erreur s'est produite lors de {{ isEdit ? "la mise à jour" : "l'ajout" }} de votre animal. Veuillez
					réessayer.
				</p>
				<div class="modal-action">
					<button @click="closeModalFailure" class="btn">OK</button>
				</div>
			</div>
		</dialog>

		<!-- Validation Error Modal -->
		<dialog v-show="showModalValidationError" class="modal modal-open">
			<div class="modal-box text-center">
				<span class="material-symbols-outlined text-warning text-6xl">warning</span>
				<h3 class="text-lg font-bold mt-4">Erreur de validation</h3>
				<p class="py-4">{{ validationErrorMessage }}</p>
				<div class="modal-action">
					<button @click="closeModalValidationError" class="btn">OK</button>
				</div>
			</div>
		</dialog>

		<!-- Camera Modal -->

		<dialog v-show="showCamera" class="modal modal-open">
			<CameraComponent v-if="showCamera" @capture="captureImage" @close="closeCamera" />
		</dialog>
	</div>
</template>

<style scoped>
	/* Add your styles here */
</style>
