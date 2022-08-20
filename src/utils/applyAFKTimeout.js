/**
 *
 * @param {Number} time
 */
module.exports = (time) => {
	if (time < 3600) {
		return `${time / 60} minute${time / 60 > 1 ? 's' : ''}`;
	} else {
		return `${time / 3600} hour`;
	}
};
