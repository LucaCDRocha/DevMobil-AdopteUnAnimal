<script setup>
	import { ref, onMounted, defineProps, defineEmits } from "vue";
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

	const cardRef = ref(null);

	const onSwipe = (direction) => {
		const target = cardRef.value;
		target.style.transition = "transform 0.5s ease";
		target.style.transform = direction === "left" ? "translate(-100vw, 0)" : "translate(100vw, 0)";
		setTimeout(() => {
			isVisible.value = false;
			emit("swipe", direction);
		}, 500);
	};

	onMounted(() => {
		interact(cardRef.value)
			.draggable({
				modifiers: [
					interact.modifiers.restrict({
						restriction: "parent",
						endOnly: true,
					}),
				],
				listeners: {
					move(event) {
						const topCardIndex = 0;
						if (props.index !== topCardIndex) return; // Ensure only the top card is swiped
						const target = event.target;
						const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
						const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

						target.style.transform = `translate(${x}px, ${y}px)`;

						target.setAttribute("data-x", x);
						target.setAttribute("data-y", y);

						likeIndicator.value = x > 50;
						dislikeIndicator.value = x < -50;
					},
					end(event) {
						const topCardIndex = 0;
						if (props.index !== topCardIndex) return; // Ensure only the top card is swiped
						const x = parseFloat(event.target.getAttribute("data-x")) || 0;
						if (x < -50) {
							onSwipe("left");
						} else if (x > 50) {
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
			.styleCursor(true);
	});
</script>

<template>
	<div v-if="isVisible" ref="cardRef" :class="`swipeable-card-${index} swipeable-card absolute w-full h-full opacity-0`">
        <div class="absolute inset-0 flex justify-center items-center z-10 bg-error opacity-50 rounded-lg" v-if="dislikeIndicator">
            <span class="material-symbols-outlined fill align-middle indicator text-error-content text-9xl">close</span>
        </div>
        <div class="absolute inset-0 flex justify-center items-center z-10 bg-success opacity-50 rounded-lg" v-if="likeIndicator">
            <span class="material-symbols-outlined fill align-middle indicator text-success-content text-9xl">favorite</span>
        </div>
		<Card :card="card" />
	</div>
</template>

<style scoped>
	.swipeable-card {
		touch-action: none;
		user-select: none;
	}
</style>
