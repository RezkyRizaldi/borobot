module.exports = {
  name: 'err',
  execute(err) {
    console.error(`Database Error: ${err.message}`);
  },
};
