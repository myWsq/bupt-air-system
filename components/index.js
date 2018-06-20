/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = require.context('.', true, /\.vue$/);
let modules = {};

files.keys().forEach((key) => {
	modules[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default;
});

export default modules;