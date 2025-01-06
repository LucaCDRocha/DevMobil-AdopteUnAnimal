import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FavoriteView from "../views/FavoriteView.vue";
import ChatView from "../views/ChatView.vue";
import AccountView from "../views/auth/AccountView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import UpdateAccountView from "../views/auth/UpdateAccountView.vue";
import HistoryView from "../views/HistoryView.vue";
import { useFetchApiCrud } from "@/composables/useFetchApiCrud";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
			meta: { requiresAuth: true },
		},
		{
			path: "/favorite",
			name: "favorite",
			component: FavoriteView,
			meta: { requiresAuth: true },
		},
		{
			path: "/chat",
			name: "chat",
			component: ChatView,
			meta: { requiresAuth: true },
		},
		{
			path: "/account",
			name: "account",
			component: AccountView,
			meta: { requiresAuth: true },
		},
		{
			path: "/login",
			name: "login",
			component: LoginView,
		},
		{
			path: "/register",
			name: "register",
			component: RegisterView,
		},
		{
			path: "/account/update",
			name: "updateAccount",
			component: UpdateAccountView,
			meta: { requiresAuth: true },
		},
		{
			path: "/history",
			name: "history",
			component: HistoryView,
		},
	],
});

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth && !localStorage.getItem("token")) {
		next({ name: "login" });
	} else {
		next();
	}
});

export default router;
