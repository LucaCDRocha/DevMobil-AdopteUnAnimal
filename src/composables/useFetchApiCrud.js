import { ref } from 'vue';
import router from '@/router';

export function useFetchApiCrud(resource) {
	const apiUrl = `/api/${resource}`;
	const isLoading = ref(false);

	const handleUnauthorized = (response) => {
		if (response.status === 401) {
			localStorage.removeItem("token");
			router.push({ name: "login" });
		}
	};

	const readAll = async (headers) => {
		isLoading.value = true;
		try {
			const response = await fetch(apiUrl, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
			});
			handleUnauthorized(response);
			const data = await response.json();
			return { data, error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		} finally {
			isLoading.value = false;
		}
	};

	const read = async (id, headers) => {
		try {
			const response = await fetch(`${apiUrl}/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
			});
			handleUnauthorized(response);
			const data = await response.json();
			return { data, error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		}
	};

	const create = async (body, headers) => {
		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
				body: JSON.stringify(body),
			});
			handleUnauthorized(response);
			const data = await response.json();
			return { data, error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		}
	};

	const update = async (id, body, headers) => {
		try {
			const response = await fetch(`${apiUrl}/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
				body: JSON.stringify(body),
			});
			handleUnauthorized(response);
			const data = await response.json();
			return { data, error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		}
	};

	const del = async (id, headers) => {
		try {
			const response = await fetch(`${apiUrl}/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
			});
			handleUnauthorized(response);
			return { data: null, error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		}
	};

	const login = async (body, headers) => {
		try {
			const response = await fetch(`${apiUrl}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
				body: JSON.stringify(body),
			});
			handleUnauthorized(response);
			const data = await response.json();
			return { data, error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		}
	};

	const swipe = async (id, direction, headers) => {
		const url = `${apiUrl}/${id}/${direction === "left" ? "dislike" : "like"}`;
		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
			});
			handleUnauthorized(response);
			return { data: await response.json(), error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		}
	};

	return { readAll, read, create, update, del, login, swipe, isLoading };
}