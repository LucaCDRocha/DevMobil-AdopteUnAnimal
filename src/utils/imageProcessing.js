
import Pica from "pica";

export const processImage = async (imageSrc, imageType, maxSize = 200, quality = 0.9) => {
	const pica = Pica();
	const img = new Image();
	img.src = imageSrc;

	return new Promise((resolve, reject) => {
		img.onload = async () => {
			try {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				let width = img.width;
				let height = img.height;

				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0, width, height);

				// Maintain aspect ratio
				if (width > height) {
					if (width > maxSize) {
						height = Math.round((height * maxSize) / width);
						width = maxSize;
					}
				} else {
					if (height > maxSize) {
						width = Math.round((width * maxSize) / height);
						height = maxSize;
					}
				}

				const resizedCanvas = document.createElement("canvas");
				resizedCanvas.width = width;
				resizedCanvas.height = height;
				await pica.resize(canvas, resizedCanvas, { unsharpAmount: 80, unsharpRadius: 0.6, unsharpThreshold: 2 });
				const dataUrl = resizedCanvas.toDataURL(imageType, quality);
				resolve(dataUrl);
			} catch (error) {
				reject(error);
			}
		};
		img.onerror = (error) => reject(error);
	});
};