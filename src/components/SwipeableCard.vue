<script setup>
	import { ref, onMounted } from "vue";
	import interact from "interactjs";
	import Card from "@/components/Card.vue";

	const props = defineProps({
		card: Object,
		index: Number,
	});

	const isVisible = ref(true);
	const emit = defineEmits(['swipe']);

	const onSwipe = (direction) => {
		const target = document.querySelector(`.swipeable-card-${props.index}`);
		target.style.transition = 'transform 0.5s ease';
		target.style.transform = direction === "left" ? 'translate(-100vw, 0)' : 'translate(100vw, 0)';
		setTimeout(() => {
			isVisible.value = false;
			emit('swipe', direction);
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
						const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
						const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

						target.style.transform = `translate(${x}px, ${y}px)`;

						target.setAttribute('data-x', x);
						target.setAttribute('data-y', y);
					},
					end(event) {
						const x = parseFloat(event.target.getAttribute('data-x')) || 0;
						if (x < -100) {
							onSwipe("left");
						} else if (x > 100) {
							onSwipe("right");
						} else {
							event.target.style.transition = 'transform 0.5s ease';
							event.target.style.transform = 'translate(0px, 0px)';
							event.target.setAttribute('data-x', 0);
							event.target.setAttribute('data-y', 0);
							setTimeout(() => {
								event.target.style.transition = '';
							}, 500);
						}
					},
				},
			})
			.styleCursor(false);
	});
</script>

<template>
	<div v-if="isVisible" :class="`swipeable-card-${index} swipeable-card absolute w-full h-full`">
		<Card :card="card" />
	</div>
</template>

<style scoped>
.swipeable-card {
	touch-action: none;
}
</style>