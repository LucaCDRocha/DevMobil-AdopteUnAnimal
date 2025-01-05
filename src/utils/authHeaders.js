export const authHeaders = {
	Authorization: `Bearer ${localStorage.getItem("token")}`,
};