<script setup>
	import { RouterLink, RouterView } from "vue-router";
</script>

<template>
	<nav>
		<ul class="menu menu-horizontal mt-6 w-full bg-primary-content flex justify-around gap-2">
			<li>
				<RouterLink class="lg:tooltip" data-tip="Accueil" to="/"
					><span class="material-symbols-outlined align-middle">pets</span></RouterLink
				>
			</li>
			<li>
				<RouterLink class="lg:tooltip" data-tip="Les likes" to="/favorite"
					><span class="material-symbols-outlined fill align-middle">favorite</span></RouterLink
				>
			</li>
			<li>
				<RouterLink class="lg:tooltip" data-tip="Messages" to="/chat"
					><span class="material-symbols-outlined fill align-middle">chat</span></RouterLink
				>
			</li>
			<li>
				<RouterLink class="lg:tooltip" data-tip="Profile" to="/account"
					><span class="material-symbols-outlined fill align-middle">account_circle</span></RouterLink
				>
			</li>
		</ul>
	</nav>
</template>

<style scoped>
	li {
		flex-grow: 1;
	}
	span {
		font-size: 1.8rem;
	}
	:deep(a) {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
