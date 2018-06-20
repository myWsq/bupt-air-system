import Vue from 'vue';
import st from 'electron-json-storage';
import pify from 'pify';

let storage = pify(st);

storage.find = async (key) => {
    let hasKey = await storage.has(key);
	return hasKey ? await storage.get(key) : undefined;
};

Vue.prototype.$storage = storage;

export default storage;
