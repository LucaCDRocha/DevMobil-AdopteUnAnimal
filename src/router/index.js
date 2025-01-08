import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FavoriteView from "../views/FavoriteView.vue";
import ChatsView from "../views/chat/ChatsView.vue";
import ChatView from "../views/chat/ChatView.vue";
import AccountView from "../views/auth/AccountView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import UpdateAccountView from "../views/auth/UpdateAccountView.vue";
import HistoryView from "../views/HistoryView.vue";
import PetFormView from "../views/pets/PetFormView.vue";
import SpaHomeView from "../views/spa/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
			meta: { requiresAuth: true, hasSpa: true },
		},
		{
			path: "/spa",
			name: "spa",
			component: SpaHomeView,
			meta: { requiresAuth: true, isSpa: true },
		},
		{
			path: "/favorite",
			name: "favorite",
			component: FavoriteView,
			meta: { requiresAuth: true },
		},
		{
			path: "/chats",
			name: "chats",
			component: ChatsView,
			meta: { requiresAuth: true },
		},
		{
			path: "/chats/:id",
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
		{
			path: "/pets/add",
			name: "addPet",
			component: PetFormView,
			meta: { requiresAuth: true },
		},
		{
			path: "/pets/edit/:id",
			name: "editPet",
			component: PetFormView,
			meta: { requiresAuth: true },
		},
	],
});

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth && !localStorage.getItem("token")) {
		next({ name: "login" });
	} else if (to.meta.hasSpa && localStorage.getItem("hasSpa") === "true") {
		next({ name: "spa" });
	} else if (to.meta.isSpa && localStorage.getItem("hasSpa") === "false") {
		next({ name: "home" });
	} else {
		next();
	}
});

export default router;
