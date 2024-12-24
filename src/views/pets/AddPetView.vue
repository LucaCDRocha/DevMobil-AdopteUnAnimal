<script setup>
import { ref, onMounted } from "vue";
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";
import { useRouter } from "vue-router";
import Pica from "pica";

const pet = ref({
	nom: "",
	age: "",
	description: "",
	tags: [],
	images: []
});

const availableTags = ref([]);
const selectedTags = ref([]);
const currentStep = ref(1);
const showModalSuccess = ref(false);
const showModalFailure = ref(false);
const showModalValidationError = ref(false);
const validationErrorMessage = ref("");

const { create } = useFetchApiCrud("pets");
const { readAll: fetchTags } = useFetchApiCrud("tags");
const router = useRouter();

const toggleTag = (tagId) => {
	if (selectedTags.value.includes(tagId)) {
		selectedTags.value = selectedTags.value.filter((id) => id !== tagId);
	} else if (selectedTags.value.length < 4) {
		selectedTags.value.push(tagId);
	}
};

const handleFileUpload = async (event) => {
	const files = event.target.files;
	pet.value.images = [];
	const pica = Pica();
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const img = new Image();
		img.src = URL.createObjectURL(file);
		await new Promise((resolve) => {
			img.onload = async () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				const resizedCanvas = document.createElement("canvas");
				const maxSize = 300; // Reduce the size further
				if (img.width > img.height) {
					resizedCanvas.width = maxSize;
					resizedCanvas.height = (img.height * maxSize) / img.width;
				} else {
					resizedCanvas.height = maxSize;
					resizedCanvas.width = (img.width * maxSize) / img.height;
				}
				await pica.resize(canvas, resizedCanvas);
				const dataUrl = resizedCanvas.toDataURL(file.type);
				const response = await fetch(dataUrl);
				const blob = await response.blob();
				const buffer = await blob.arrayBuffer();
				pet.value.images.push({ data: Array.from(new Uint8Array(buffer)), imgType: file.type });
				resolve();
			};
		});
	}
};

const submitForm = async () => {
	const headers = {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	};
	const petData = {
		...pet.value,
		tags: [...selectedTags.value],
		images: pet.value.images.map(image => ({ ...image }))
	};
    console.log(petData);
	const { data, error } = await create(petData, headers);
	if (!error) {
		showModalSuccess.value = true;
	} else {
		showModalFailure.value = true;
	}
};

onMounted(async () => {
	const { data, error } = await fetchTags();
	if (!error) {
		availableTags.value = data;
	}
});

const nextStep = () => {
	if (currentStep.value === 1 && (!pet.value.nom || !pet.value.age || !pet.value.description)) {
		validationErrorMessage.value = "Please fill out all fields in this step.";
		showModalValidationError.value = true;
		return;
	}
	if (currentStep.value === 2 && pet.value.images.length === 0) {
        console.log(pet.value.images);
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
</script>

<template>
	<div class="flex flex-col items-center justify-center h-full w-full bg-base-200">
		<div class="card w-80 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Add a New Pet</h2>
				<form @submit.prevent="submitForm" class="space-y-4">
					<div v-if="currentStep === 1">
						<div class="form-control">
							<label for="nom" class="label">
								<span class="label-text">Name:</span>
							</label>
							<input type="text" id="nom" v-model="pet.nom" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label for="age" class="label">
								<span class="label-text">Age:</span>
							</label>
							<input type="number" id="age" v-model="pet.age" class="input input-bordered" required />
						</div>
						<div class="form-control">
							<label for="description" class="label">
								<span class="label-text">Description:</span>
							</label>
							<textarea id="description" v-model="pet.description" class="textarea textarea-bordered" required></textarea>
						</div>
					</div>
					<div v-if="currentStep === 2">
						<div class="form-control">
							<label for="images" class="label">
								<span class="label-text">Images:</span>
							</label>
							<input type="file" id="images" @change="handleFileUpload" class="input input-bordered" multiple />
						</div>
					</div>
					<div v-if="currentStep === 3">
						<div class="form-control">
							<label class="label">
								<span class="label-text">Tags:</span>
							</label>
							<p class="text-sm text-base-300 mb-2">Select up to 4 tags</p>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="tag in availableTags"
									:key="tag._id"
									:class="[ 'badge', 'cursor-pointer', selectedTags.includes(tag._id) ? 'badge-primary' : 'badge-outline' ]"
									@click="toggleTag(tag._id)"
								>
									{{ tag.nom }}
								</span>
							</div>
						</div>
					</div>
					<div class="form-control mt-6 flex justify-between">
						<button type="button" class="btn btn-secondary" @click="prevStep" v-if="currentStep > 1">Previous</button>
						<button type="button" class="btn btn-primary" @click="nextStep" v-if="currentStep < 3">Next</button>
						<button type="submit" class="btn btn-primary" v-if="currentStep === 3">Add Pet</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Success Modal -->
		<dialog v-show="showModalSuccess" class="modal modal-open">
			<div class="modal-box text-center">
				<span class="material-symbols-outlined text-success text-6xl">check_circle</span>
				<h3 class="text-lg font-bold mt-4">
					Pet Added Successfully
				</h3>
				<p class="py-4">Your pet has been added successfully.</p>
				<div class="modal-action">
					<button @click="closeModalSuccess" class="btn">OK</button>
				</div>
			</div>
		</dialog>

		<!-- Failure Modal -->
		<dialog v-show="showModalFailure" class="modal modal-open">
			<div class="modal-box text-center">
				<span class="material-symbols-outlined text-error text-6xl">error</span>
				<h3 class="text-lg font-bold mt-4">
					Failed to Add Pet
				</h3>
				<p class="py-4">There was an error adding your pet. Please try again.</p>
				<div class="modal-action">
					<button @click="closeModalFailure" class="btn">OK</button>
				</div>
			</div>
		</dialog>

		<!-- Validation Error Modal -->
		<dialog v-show="showModalValidationError" class="modal modal-open">
			<div class="modal-box text-center">
				<span class="material-symbols-outlined text-warning text-6xl">warning</span>
				<h3 class="text-lg font-bold mt-4">
					Validation Error
				</h3>
				<p class="py-4">{{ validationErrorMessage }}</p>
				<div class="modal-action">
					<button @click="closeModalValidationError" class="btn">OK</button>
				</div>
			</div>
		</dialog>
	</div>
</template>

<style scoped>
/* Add your styles here */
</style>
