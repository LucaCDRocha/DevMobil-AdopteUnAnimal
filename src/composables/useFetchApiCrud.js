import { ref } from "vue";
import router from "@/router";

export function useFetchApiCrud(resource) {
	const apiUrl = `${import.meta.env.VITE_API_URL}/${resource}`;
	const isLoading = ref(true);

	const handleUnauthorized = (response) => {
		if (response.status === 401) {
			localStorage.removeItem("token");
			router.push({ name: "login" });
		}
	};

	const readAll = async (headers, queryParams = {}) => {
		try {
			const queryString = new URLSearchParams(queryParams).toString();
			const url = queryString ? `${apiUrl}?${queryString}` : apiUrl;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
			});
			handleUnauthorized(response);
			// Extract headers
			const resHeaders = {};
			response.headers.forEach((value, key) => {
				resHeaders[key] = value;
			});

			const data = await response.json();
			return { data, error: !response.ok, resHeaders };
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
		} finally {
			isLoading.value = false;
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

	const changeStatus = async (id, status, headers) => {
		try {
			const response = await fetch(`${apiUrl}/${id}/status`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
				body: JSON.stringify({ status }),
			});
			handleUnauthorized(response);
			return { data: await response.json(), error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		} finally {
			isLoading.value = false;
		}
	};

	return { readAll, read, create, update, del, login, swipe, changeStatus, isLoading };
}
