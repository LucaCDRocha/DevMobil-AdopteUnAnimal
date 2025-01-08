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
				facingMode: useFrontCamera.value ? "user" : "environment",
			},
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
			const compressedImageDataUrl = await processImage(imageDataUrl, "image/jpeg", 130);
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
	<div class="fixed flex justify-center items-center p-4 h-full">
		<div class="relative bg-black rounded-lg overflow-hidden shadow-lg w-full max-w-md">
			<video ref="video" :class="{ mirrored: useFrontCamera }" class="w-full h-full object-cover" autoplay></video>
			<div
				v-if="isCameraLoading"
				class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-xl">
				<p>Loading camera...</p>
			</div>
			<div
				v-else
				class="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-black bg-opacity-50">
				<button @click="switchCamera" class="btn btn-accent btn-outline btn-circle material-symbols-outlined fill text-xl">cameraswitch</button>
				<button @click="capture" class="btn btn-primary btn-circle material-symbols-outlined fill text-xl">photo_camera</button>
				<button @click="close" class="btn btn-accent btn-outline btn-circle material-symbols-outlined fill text-xl">close</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.mirrored {
		transform: scaleX(-1);
	}
	.loading-screen {
		font-size: 1.5rem;
	}
</style>
