import { ref } from 'vue';

export function useFetchApiCrud(resource) {
	const apiUrl = `/api/${resource}`;
	const isLoading = ref(false);

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
			const data = await response.json();
			return { data, error: !response.ok };
		} catch (error) {
			return { data: null, error: true };
		}
	};

	return { readAll, read, create, update, del, login, isLoading };
}