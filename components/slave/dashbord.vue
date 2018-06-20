<template>
    <div>
        <v-card>
            <v-card-title>
                <v-layout justify-space-between>
                    <v-layout align-center>
                        <v-icon color="primary">dashboard</v-icon>
                        <h2>仪表盘</h2>
                        <v-subheader>设备编号:{{info.id}}</v-subheader>
                        <v-subheader>绑定证件号:{{info.card_id}}</v-subheader>
                    </v-layout>
                    <v-layout justify-end>
                        <v-btn icon :disabled="info.target_temp>=30" @click="reqList.push('tempHigh')">
                            <v-icon color="success">add</v-icon>
                        </v-btn>
                        <v-btn icon :disabled="info.target_temp<=10" @click="reqList.push('tempLow')">
                            <v-icon color="success">remove</v-icon>
                        </v-btn>
                        <v-btn icon :disabled="info.speed>=3" @click="reqList.push('speedHigh')">
                            <img src="@/assets/high_fans.svg" class="icon">
                        </v-btn>
                        <v-btn icon :disabled="info.speed<=0" @click="reqList.push('speedLow')">
                            <img src="@/assets/low_fans.svg" class="icon">
                        </v-btn>
                        <v-btn icon :disabled="info.speed===0" @click="reqList.push('shutdown')">
                            <v-icon color="error">power_settings_new</v-icon>
                        </v-btn>
                    </v-layout>
                </v-layout>
            </v-card-title>
            <v-container fluid class="pt-0" grid-list-lg>
                <v-layout row wrap>
                    <v-flex xs12 sm4 v-for="(item,i) in boxList" :key="i">
                        <div class="box">
                            <v-layout column>
                                <v-subheader>{{item.title}}</v-subheader>
                                <v-layout justify-end class="pr-3">
                                    <h1 style="font-size:3em;color:#2196f3">{{item.value}}</h1>
                                    <span v-if="item.suffix" style="color:#bcbcbc">{{item.suffix}}</span>
                                </v-layout>
                            </v-layout>
                        </div>
                    </v-flex>
                </v-layout>
                <v-layout justify-space-between class="px-3">
                    <v-switch v-model="toggle" :loading="autoLoading>0" label="自动温控" />
                    <v-layout column align-end>
                        <span style="color:#bcbcbc">每千瓦时的费用将随着累计消耗能量的增加而增加</span>
                        <h3>当期费用:
                            <span style="color:#E57373" class="ml-2">{{info.amount}}</span>
                        </h3>
                    </v-layout>
                </v-layout>
            </v-container>
        </v-card>
        <v-snackbar bottom v-model="reqVisible">
            {{reqList}}
        </v-snackbar>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'dashbord',
    props: ['info'],
    data() {
        return {
            toggle: false,
            reqList: [],
            // 自动处理请求的标记
            reqFlag: null,
            // 请求是否被阻塞
            reqLoading: 0,
            // 是否显示请求队列
            reqVisible: false,
            autoLoading: 0,
        }
    },
    computed: {
        ...mapState(['client']),
        boxList() {
            return [
                { title: '温度', value: this.info.target_temp, suffix: '℃' },
                { title: '风速', value: this.info.speed },
                { title: '产生能量', value: this.info.energy, suffix: 'kw/h' },
            ]
        }
    },
    methods: {
        async do() {
            // 仅当没有请求占用队列的时候调用
            if (this.reqLoading === 0 && this.reqList.length > 0) {
                this.reqLoading++
                let func = this.reqList.pop()
                this.reqList = []
                try {
                    await this[func]()

                } catch (e) {
                    console.error(e);
                }
                this.reqLoading--
            }
        },
        async autoOpen() {
            this.autoLoading++
            await this.client.get('/monitor/open')
            this.autoLoading--
        },
        async autoClose() {
            this.autoLoading++
            await this.client.get('/monitor/close')
            this.autoLoading--
        },
        tempLow() {
            return this.client.get(`/slave/temp/low/${this.info.id}`)
        },
        tempHigh() {
            return this.client.get(`/slave/temp/high/${this.info.id}`)
        },
        speedLow() {
            return this.client.get(`/slave/speed/low/${this.info.id}`)
        },
        speedHigh() {
            return this.client.get(`/slave/speed/high/${this.info.id}`)
        },
        shutdown() {
            return this.client.get(`/slave/shutdown/${this.info.id}`)
        }
    },
    async mounted() {
        await this.autoClose()
        this.reqFlag = setInterval(() => { this.do() }, 1000)
    },
    async beforeDestroy() {
        await this.autoClose()
        await this.client.get('/monitor/destroy')
        clearInterval(this.reqFlag)
    },
    watch: {
        reqList(newValue, oldValue) {
            if (newValue.length > 0) {
                this.reqVisible = true
            }
        },
        async toggle(newValue, oldValue) {
            if (newValue) {
                await this.autoOpen()
            }
            else {
                await this.autoClose()
            }

        }
    },
}
</script>

<style scoped>
.box{
    padding: 1em;
    border:solid 1px #efefef
}
.icon{
    width: .8em;
    height: .8em;
}
</style>