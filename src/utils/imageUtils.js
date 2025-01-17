export const transformImageData = (imageData) => {
	const byteArray = new Uint8Array(imageData.data.data);
	if (byteArray.length > 0) {
		const binaryString = byteArray.reduce((data, byte) => data + String.fromCharCode(byte), "");
		return "data:image/jpeg;base64," + btoa(binaryString);
	} else {
		return "data:image/jpeg;base64," + imageData.data;
	}
};
