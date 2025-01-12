<script setup>
	import { RouterLink, useRoute } from "vue-router";

	const route = useRoute();

	const hasSpa = localStorage.getItem("hasSpa") === "true";
	console.log(hasSpa);
</script>

<template>
	<nav>
		<ul class="menu menu-horizontal w-full bg-primary-content flex justify-around gap-2">
			<li>
				<RouterLink class="lg:tooltip" data-tip="Accueil" :to="hasSpa ? '/spa' : '/'" v-slot="{ isActive }">
					<span :class="{ 'active-link': isActive }" class="material-symbols-outlined align-middle">pets</span>
				</RouterLink>
			</li>
			<li v-if="!hasSpa">
				<RouterLink class="lg:tooltip" data-tip="Les likes" to="/favorite" v-slot="{ isActive }">
					<span :class="{ 'active-link': isActive }" class="material-symbols-outlined fill align-middle"
						>favorite</span
					>
				</RouterLink>
			</li>
			<li v-else>
				<RouterLink class="lg:tooltip" data-tip="Ajouter" to="/pets/add" v-slot="{ isActive }">
					<span
						:class="{ 'active-link': isActive || route.name === 'editPet' }"
						class="material-symbols-outlined fill align-middle"
						>{{route.name === 'editPet' ? 'edit' : 'add_circle'}}</span
					>
				</RouterLink>
			</li>
			<li>
				<RouterLink class="lg:tooltip" data-tip="Messages" to="/chats" v-slot="{ isActive }">
					<span
						:class="{ 'active-link': isActive || route.name === 'chat' }"
						class="material-symbols-outlined fill align-middle"
						>chat</span
					>
				</RouterLink>
			</li>
			<li>
				<RouterLink class="lg:tooltip" data-tip="Profile" to="/account" v-slot="{ isActive }">
					<span
						:class="{ 'active-link': isActive || route.name === 'updateAccount' || route.name === 'history' }"
						class="material-symbols-outlined fill align-middle"
						>account_circle</span
					>
				</RouterLink>
			</li>
		</ul>
	</nav>
</template>

<style scoped>
	li {
		@apply h-full flex-grow;
	}
	span {
		@apply rounded-xl h-full w-full p-3;
		@apply text-3xl align-middle text-center;
	}
	:deep(.menu a) {
		@apply rounded-xl h-full w-full p-0;
		@apply flex justify-center items-center;
		@apply active:bg-secondary active:text-secondary-content;
		@apply hover:bg-secondary hover:text-secondary-content;
		@apply focus:bg-secondary focus:text-secondary-content;
	}
	.active-link {
		@apply bg-primary text-primary-content;
	}
	:deep(a::before) {
		@apply bg-primary text-primary-content;
	}
</style>
