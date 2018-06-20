<template>
    <v-layout class="fiuld">
        <v-flex xs0 sm4 md3 lg2 class="side">
            <v-subheader dark>处理能力</v-subheader>
            <v-layout class="power" justify-center>
                <h1>{{power}}</h1>
                <span style="font-size:0.8em" class="pl-2">条/秒</span>
            </v-layout>
            <v-slider :loading="powerLoading>0" v-model="power" step="1" color="white" thumb-color="white" max="50" track-color="grey"></v-slider>
            <v-divider dark></v-divider>
            <v-subheader dark>处理策略</v-subheader>
            <v-radio-group dark v-model="scheduling" :loading="schedulingLoading>0">
                <v-radio v-for="(item,i) in scheList" :key="i" :label="item.label" :value="item.value"></v-radio>
            </v-radio-group>
            <v-divider dark></v-divider>
            <v-subheader dark>当前模式</v-subheader>
            <v-radio-group dark v-model="status" :loading="statusLoading>0">
                <v-radio v-for="(item,i) in statusList" :key="i" :label="item.label" :value="item.value"></v-radio>
            </v-radio-group>
            <v-divider dark></v-divider>
            <v-subheader dark>控制面板</v-subheader>
            <v-layout column style="margin-left:-1.5em">
                <v-btn v-for="(item,i) in btnList" :key="i" block nuxt dark flat :to="item.route" exact>
                    <v-layout>
                        <v-subheader class="pl-4">
                            <v-icon class="mr-2">{{item.icon}}</v-icon>{{item.label}}</v-subheader>
                    </v-layout>
                </v-btn>
            </v-layout>
        </v-flex>
        <v-flex xs12 sm8 md9 lg10>
            <nuxt-child></nuxt-child>
        </v-flex>
        <v-snackbar bottom right v-model="error">{{errorText}}</v-snackbar>
    </v-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            loading: 0,
            powerLoading: 0,
            schedulingLoading: 0,
            statusLoading: 0,
            flag: null,
            info: null,
            error: false,
            errorText: "",
            scheList: [
                { label: '随机调度', value: 1 },
                { label: '先到先服务', value: 2 },
                { label: '风速优先权调度', value: 3 },
            ],
            statusList: [
                { label: '制冷', value: 1 },
                { label: '制热', value: 2 },
            ],
            btnList: [
                { label: '状态监控', route: '/master', icon: 'view_list' },
                { label: '从机管理', route: '/master/manage', icon: 'build' },
                { label: '统计报表', route: '/master/analysis', icon: 'assessment' }
            ],
        }
    },
    computed: {
        ...mapState(['client']),
        power: {
            get() {
                return this.info ? this.info.power : 0
            },
            async set(newValue) {
                this.powerLoading++
                await this.client.post('/machine/set', {
                    power: newValue,
                    scheduling: this.info.scheduling,
                    status: this.info.status
                })
                this.powerLoading--
            }
        },
        scheduling: {
            get() {
                return this.info ? this.info.scheduling : 0
            },
            async set(newValue) {
                this.schedulingLoading++
                await this.client.post('/machine/set', {
                    power: this.info.power,
                    scheduling: newValue,
                    status: this.info.status
                })
                this.schedulingLoading--
            }
        },
        status: {
            get() {
                return this.info ? this.info.status : 0
            },
            async set(newValue) {
                this.statusLoading++
                await this.client.post('/machine/set', {
                    power: this.info.power,
                    scheduling: this.info.scheduling,
                    status: newValue
                })
                this.statusLoading--
            }
        }
    },
    methods: {
        async getInfo() {
            if (this.loading === 0) {
                this.loading++
                try {
                    this.info = (await this.client.get('/machine/info')).data

                    this.loading--
                } catch (e) {
                    console.error(e)
                    this.loading--
                }
            }
        },
        // 打开计费功能
        async openCost() {
            try {
                await this.client.get('/cost/open')
            } catch (e) {
                console.error(e)
                this.error = true
                this.errorText = '计费功能开启失败,请检查日志'
            }
        },
        async closeCost() {
            await this.client.get('/cost/close')
        },

        async openMachine() {
            try {
                await this.client.get('/machine/open')
            } catch (e) {
                console.error(e)
                this.error = true
                this.errorText = '调度功能开启失败,请检查日志'
            }
        },
        async closeMachine() {
            await this.client.get('/machine/close')
        },
    },




    async mounted() {
        await this.openCost()
        await this.openMachine()
        await this.getInfo()
        this.flag = setInterval(() => {
            this.getInfo()
        }, 1000)
    },
    async beforeDestroy() {
        await this.closeCost()
        await this.closeMachine()
        clearInterval(this.flag)
    }

}
</script>

<style scoped>
.fiuld{
    height: 100%;
}
.side{
    background-color: #424242;
    padding-left:1em;
}
.power{
    color: rgba(255, 255, 255, .7);
    font-size: 1.5em
}
</style>