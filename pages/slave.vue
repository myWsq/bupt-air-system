<template>
        <v-container fluid>
            <v-layout column>
                <v-flex xs12>
                    <info v-if="info" :info="info" class="mb-3"></info>
                    <dashbord v-if="info" :info="info"></dashbord>
                </v-flex>
            </v-layout>
        </v-container>
</template>

<script>
import components from '../components'
import { mapState, mapActions } from "vuex";
export default {
    data() {
        return {
            info: null,
            timer: null,
            loading: 0
        }
    },
    computed: {
        ...mapState(['client'])
    },
    components: {
        'Info': components['slave/info'],
        'Dashbord': components['slave/dashbord']
    },
    methods: {
        ...mapActions(['slaveCheck']),
        async getInfo() {
            // 有请求占用时忽略
            if (this.loading === 0) {
                this.loading++
                try {
                    let { data } = await this.client.get(`/slave/${this.info.id}`)
                    this.info = data
                    this.loading--

                } catch (e) {
                    console.error(e);
                    this.loading--
                }

            }
        }
    },
    async beforeMount() {
        // 检查是服务器是否初始化成功
        this.info = await this.slaveCheck()
        if (!this.info) {
            this.$router.push('/')
        } else {
            // 每秒刷新一次信息
            this.timer = setInterval(() => { this.getInfo() }, 1000)
        }
    },
    beforeDestroy() {
        // 退出前清空计时器
        clearInterval(this.timer)
    },
}
</script>

<style scoped>

</style>