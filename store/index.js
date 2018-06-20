import axios from 'axios';
import storage from '../plugins/storage';

export const state = () => ({
	baseUrl: '',
	client: null
});

export const mutations = {
	setUrl(state, url) {
		state.baseUrl = url;
		state.client = axios.create({
			baseURL: state.baseUrl
		});
	},
	setSlave(state, info) {
		state.slave = info;
	}
};

export const actions = {
	// 测试服务器联通性
	async serverTest({ commit }, url) {
		let client = axios.create({
			baseURL: url
		});
		let testStr = Math.random().toString(36).substr(2);
		try {
			let { data } = await client.get('/test', {
				params: {
					testStr
				}
			});

			if (data === testStr) {
				commit('setUrl', url);
				await storage.set('baseUrl', url);
				return true;
			} else {
				await storage.remove('baseUrl');
				return false;
			}
		} catch (e) {
			console.error(e);
			await storage.remove('baseUrl');
			return false;
		}
	},

	// 检查用户id
	async slaveCheck({ state }) {
		const cardID = await storage.find('cardID');
		try {
			let res = await state.client.get(`/slave/check/${cardID}`);
			return res.data;
		} catch (e) {
			await storage.remove('cardID');
			return null;
		}
	},
	async slaveInit({ state }, temp) {
		return state.client.get('/slave/init', {
			params: temp
		});
	}
};
