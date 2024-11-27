<script setup>
	import { ref, onMounted } from "vue";
	import interact from "interactjs";
	import Card from "@/components/Card.vue";

	const props = defineProps({
		card: Object,
		index: Number,
	});

	const isVisible = ref(true);
	const emit = defineEmits(["swipe"]);
	const likeIndicator = ref(false);
	const dislikeIndicator = ref(false);

	const onSwipe = (direction) => {
		const target = document.querySelector(`.swipeable-card-${props.index}`);
		target.style.transition = "transform 0.5s ease";
		target.style.transform = direction === "left" ? "translate(-100vw, 0)" : "translate(100vw, 0)";
		setTimeout(() => {
			isVisible.value = false;
			emit("swipe", direction);
		}, 500);
	};

	onMounted(() => {
		interact(`.swipeable-card-${props.index}`)
			.draggable({
				modifiers: [
					interact.modifiers.restrict({
						restriction: "parent",
						endOnly: true,
					}),
				],
				listeners: {
					move(event) {
						const target = event.target;
						const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
						const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

						target.style.transform = `translate(${x}px, ${y}px)`;

						target.setAttribute("data-x", x);
						target.setAttribute("data-y", y);

						likeIndicator.value = x > 100;
						dislikeIndicator.value = x < -100;
					},
					end(event) {
						const x = parseFloat(event.target.getAttribute("data-x")) || 0;
						if (x < -100) {
							onSwipe("left");
						} else if (x > 100) {
							onSwipe("right");
						} else {
							event.target.style.transition = "transform 0.5s ease";
							event.target.style.transform = "translate(0px, 0px)";
							event.target.setAttribute("data-x", 0);
							event.target.setAttribute("data-y", 0);
							setTimeout(() => {
								event.target.style.transition = "";
							}, 500);
						}
						likeIndicator.value = false;
						dislikeIndicator.value = false;
					},
				},
			})
			.styleCursor(false);
	});
</script>

<template>
	<div v-if="isVisible" :class="`swipeable-card-${index} swipeable-card absolute w-full h-full`">
		<div
			class="absolute inset-0 flex justify-center items-center z-10 bg-base-content opacity-80 h-full w-full rounded-lg"
			v-if="dislikeIndicator">
			<span class="material-symbols-outlined text-error text-9xl">close</span>
		</div>
		<div
			class="absolute inset-0 flex justify-center items-center z-10 bg-base-content opacity-80 h-full w-full rounded-lg"
			v-if="likeIndicator">
			<span class="material-symbols-outlined text-success text-9xl">favorite</span>
		</div>
		<Card :card="card" />
	</div>
</template>

<style scoped>
	.swipeable-card {
		touch-action: none;
	}
</style>
