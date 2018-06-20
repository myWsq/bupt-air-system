<template>
	<div id="app">
		<v-app>
			<server-init v-model="serverInitVisable"></server-init>
			<v-toolbar color="primary" dark app>
				<v-toolbar-title>{{nav.title}}</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon @click="reload">
					<v-icon>autorenew</v-icon>
				</v-btn>
				<v-btn icon @click="serverInitVisable = true">
					<v-icon>settings</v-icon>
				</v-btn>
				<v-btn v-if="nav.next" icon @click="$router.push(nav.next)">
					<v-icon>compare_arrows</v-icon>
				</v-btn>
			</v-toolbar>
			<v-content>
				<nuxt v-if="isOk"></nuxt>
			</v-content>
			<v-footer>
				<v-layout justify-center>
					<span style="color:#bcbcbc">2018 &copy; Bupt AC System</span>
				</v-layout>
			</v-footer>
		</v-app>
	</div>
</template>

<script>
import { mapState } from "vuex";
import serverInit from "../components/serverInit";
export default {
	name: 'electron-vue-start',
	data() {
		return {
			serverInitVisable: false,
		}
	},
	components: { serverInit },
	computed: {
		...mapState(['client']),
		isOk() {
			return this.client
		},
		nav() {
			if (this.$route.name === 'index') {
				return {
					title: '分布式温控系统',
					next: '/master'
				}
			}
			else if (this.$route.name === 'slave') {
				return {
					title: '分布式温控系统(从机)',
					next: '/master'
				}

			} else {
				return {
					title: '分布式温控系统(主机)',
					next: '/slave'
				}
			}
		},
	},
	methods: {
		reload() {
			location.reload()
		}
	},
}
</script>

<style>

</style>
