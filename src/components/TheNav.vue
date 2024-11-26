<script setup>
	import { RouterLink, RouterView } from "vue-router";
</script>

<template>
	<nav>
		<ul class="menu menu-horizontal mt-6 w-full bg-primary-content">
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
.menu{
    display: flex;
    justify-content: space-around;
}
</style>
