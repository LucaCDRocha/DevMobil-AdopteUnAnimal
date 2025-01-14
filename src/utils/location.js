import { ref } from "vue";

export const positionFetched = ref(false);

export const getCurrentPosition = () => {
	positionFetched.value = false;
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(position) => resolve(position.coords),
			(error) => reject(error)
		);
		positionFetched.value = true;
	});
};
