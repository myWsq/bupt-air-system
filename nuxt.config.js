module.exports = {
	mode:'spa',
	transition: 'fade',
	head: {title: 'Bupt AC System'}, // Headers of the page
	loading: {
		color:"#efefef",
		height:"5px"
	},
	build: {
		extend (config, { isDev, isClient }) {
			if (isClient) { config.target = 'electron-renderer' }
		}
	},
	css:['@/assets/app.css'],
	plugins:['@/plugins/vuetify','@/plugins/lineChart','@/plugins/storage'],
	dev: process.env.NODE_ENV === 'DEV'
}
