import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { setCookie, getCookie } from "@/utils/cookies";
import { getCurrentPosition, positionFetched } from "@/utils/location";

const initializeApp = async () => {
	const userPosition = JSON.parse(getCookie("userPosition"));
	if (!positionFetched.value && !userPosition) {
		try {
			console.log("getCurrentPosition");
			const position = await getCurrentPosition();
			setCookie("userPosition", JSON.stringify(position), 1);
		} catch (error) {
			console.error("Could not get position:", error);
		}
	}
};

const app = createApp(App);

app.use(router);

app.mount("#app");

initializeApp();
