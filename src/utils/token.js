export const getUserIdFromToken = (token) => {
	if (!token) return null;
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.sub;
	} catch (e) {
		console.error("Invalid token", e);
		return null;
	}
};
