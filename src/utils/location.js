import { ref } from "vue";

export const positionFetched = ref(false);

export const setPositionFetched = (value) => {
	positionFetched.value = value;
};

export const getCurrentPosition = () => {
	setPositionFetched(false);
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(position) => resolve(position.coords),
			(error) => reject(error)
		);
		setPositionFetched(true);
	});
};
