<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { processImage } from "@/utils/imageProcessing";

const emit = defineEmits(["capture", "close"]);

const video = ref(null);
const isCameraActive = ref(false);
const isCameraLoading = ref(true);
const useFrontCamera = ref(false); // Default to back camera

const startCamera = async () => {
	const constraints = {
		video: {
			facingMode: useFrontCamera.value ? "user" : "environment"
		}
	};
	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	video.value.srcObject = stream;
	isCameraLoading.value = false;
};

const stopCamera = () => {
	const stream = video.value.srcObject;
	const tracks = stream.getTracks();
	tracks.forEach((track) => track.stop());
};

const capture = async () => {
	const canvas = document.createElement("canvas");
	canvas.width = video.value.videoWidth;
	canvas.height = video.value.videoHeight;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);
	const imageDataUrl = canvas.toDataURL("image/jpeg");

	try {
		const compressedImageDataUrl = await processImage(imageDataUrl, "image/jpeg", 130, 0.5);
		emit("capture", compressedImageDataUrl);
	} catch (error) {
		console.error("Error processing image:", error);
	}
};

const close = () => {
	isCameraActive.value = false;
	stopCamera();
	emit("close");
};

const switchCamera = () => {
	useFrontCamera.value = !useFrontCamera.value;
	stopCamera();
	startCamera();
};

watch(
	() => isCameraActive.value,
	(newVal) => {
		if (newVal) {
			startCamera();
		} else {
			stopCamera();
		}
	}
);

onMounted(() => {
	isCameraActive.value = true;
});

onBeforeUnmount(() => {
	stopCamera();
});
</script>

<template>
	<div class="camera flex flex-col items-center relative">
		<video ref="video" class="video w-full h-auto" autoplay></video>
		<div v-if="isCameraLoading" class="loading-screen absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 text-white text-xl">
			<p>Loading camera...</p>
		</div>
		<button v-if="!isCameraLoading" @click="capture" class="btn btn-primary mt-2">Capture</button>
		<button v-if="!isCameraLoading" @click="close" class="btn btn-secondary mt-2">Close</button>
		<button v-if="!isCameraLoading" @click="switchCamera" class="btn btn-secondary mt-2">Switch Camera</button>
	</div>
</template>

<style scoped>
.loading-screen {
	font-size: 1.5rem;
}
</style>
