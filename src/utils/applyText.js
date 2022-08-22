/**
 *
 * @param {import('@napi-rs/canvas').Canvas} canvas
 * @param {String} text
 */
module.exports = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 70;

	do {
		context.font = `${(fontSize -= 10)}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};
