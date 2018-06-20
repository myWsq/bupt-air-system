<template>
	<v-container fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm10 md8 lg6>
				<v-card>
					<v-card-title primary-title>
						<h1>从机初始化</h1>
					</v-card-title>
					<v-container>
						<v-layout column>
							<v-flex xs12>
								<v-text-field style="width:100%" ref="input" :rules="[(v) => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v)  || '身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X']" :counter="18" v-model="cardID" label="身份证号"></v-text-field>
							</v-flex>
							<v-layout justify-end>
								<v-btn @click="submit" :loading="loading>0" color="primary">提交</v-btn>
							</v-layout>
						</v-layout>
					</v-container>
				</v-card>
			</v-flex>
		</v-layout>
		<v-snackbar bottom right v-model="visible" dark>
			<v-layout justify-center align-middle>
				<v-icon dark>{{icon}}</v-icon> {{text}}
			</v-layout>
		</v-snackbar>
	</v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
	data() {
		return {
			cardID: "",
			loading: 0,
			visible: false,
			text: "",
			icon: ""
		}
	},
	computed: {
		...mapState(['client'])
	},
	methods: {
		...mapActions(['slaveCheck']),
		async submit() {
			this.loading++
			if (this.$refs['input'].validate()) {
				await this.$storage.set('cardID', this.cardID)
				if (await this.slaveCheck()) {
					this.text = "初始化成功"
					this.icon = "sentiment_satisfied"
					this.visible = true
					this.$router.push('/slave')
				} else {
					this.text = "没有查询到您的信息,请联系前台"
					this.icon = "sentiment_very_dissatisfied"
					this.visible = true
				}
			}
			this.loading--
		}
	},
	async beforeMount() {
		if (await this.slaveCheck()) {
			this.$router.push('/slave')
		}
	}
}
</script>

<style scoped>

</style>