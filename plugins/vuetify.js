import Vue from 'vue';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
Vue.use(Vuetify, {
	theme: {
		primary: '#424242',
		secondary: '#E0E0E0',
		accent: '#E57373',
		error: '#f44336',
		warning: '#FF8F00',
		info: '#2196f3',
		success: '#4caf50'
	}
});
