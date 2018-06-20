<template>
    <v-layout column>
        <v-card>
            <v-container>
                <v-layout justify-end align-center>
                    <v-flex xs8>
                        <h1 class="text-xs-center">空调, 从未如此智能</h1>
                    </v-flex>
                    <v-flex xs4>
                        <img src="@/assets/slave-air.svg" style="width:100%;height:auto;">
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
        <v-card class="mt-3">
            <v-card-title>
                <v-layout row justify-space-between>
                    <v-layout align-center>
                        <img src="@/assets/temp.svg" style="width:1.5em;height:1.5em">
                        <h2>
                            温度监控
                        </h2>
                        <v-subheader>当前温度:{{info.cur_temp}}℃</v-subheader>
                        <v-switch v-model="toggle" hide-details></v-switch>
                    </v-layout>
                    <v-btn icon :disabled="!toggle" @click="visible = true">
                        <v-icon>settings</v-icon>
                    </v-btn>
                </v-layout>
            </v-card-title>
            <v-container class="pt-0" fluid>
                <line-chart :height="100" :chartData="lineData"></line-chart>
            </v-container>
        </v-card>
        <v-dialog v-model="visible" title="设置" max-width="400">
            <v-card>
                <v-card-title>
                    <h3>设置</h3>
                </v-card-title>
                <v-card-text>
                    <v-text-field hint="可设定范围在 -10℃ 至 30℃ 之间" ref="input" autofocus v-model="tmp" :rules="rules" @keyup.enter="submit" label="房间初始温度" suffix="℃"></v-text-field>

                    <v-btn color="primary" style="width:100%;margin:0" :disabled="!tmp" @click="submit">确定</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="error">{{errorText}}</v-snackbar>
    </v-layout>
</template>

<script>
import { mapState } from "vuex";
import { error } from 'util';
export default {
    name: 'info',
    props: ['info'],
    data() {
        return {
            error: false,
            errorText: "",
            cur: 26,
            visible: false,
            // 临时存放要调整的房间初始温度
            tmp: null,
            visible: false,
            // 自动请求是否开启
            flag: null,
            toggle: false,
            rules: [
                (v) => !isNaN(v) || '请输入数字',
                (v) => v >= -10 && v <= 30 || '温度超过设定范围'
            ],
            lineData: {
                labels: [],
                datasets: [
                    {
                        label: '温度',
                        backgroundColor: '#E57373',
                        data: []
                    }
                ]
            }
        }
    },
    computed: {
        ...mapState(['client'])
    },
    methods: {
        async submit() {
            if (this.$refs['input'].validate() && this.tmp) {
                this.cur = this.tmp
                await this.init()
                this.visible = false
            }
        },
        // 队列中新增元素
        append(label, data) {
            let labelList = this.lineData.labels
            let dataList = this.lineData.datasets[0].data
            if (labelList.length === 30) labelList.shift()
            labelList.push(label)
            if (dataList.length === 30) dataList.shift()
            dataList.push(data)
            this.lineData = { ...this.lineData }
        },
        // 模拟模拟初始化
        async init() {
            try {
                await this.client.get(`/monitor/init/${this.info.id}/${this.cur}`)
            } catch (e) {
                console.error(e)
                this.errorText = "温度模拟器初始化失败,请检查日志"
                this.error = true
            }

        }
    },
    watch: {
        cur(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.lineData.labels = []
                this.lineData.datasets.data = []
                this.lineData = { ...this.lineData }
            }
        },
        toggle(newValue) {
            if (newValue === true) {
                this.flag = setInterval(() => { this.append(new Date().toLocaleTimeString('en-GB'), this.info.cur_temp) }, 1000)
            } else {
                this.lineData.labels = []
                this.lineData.datasets.data = []
                this.lineData = { ...this.lineData }
                clearInterval(this.flag)
            }
        }
    },
    async mounted() {
        this.tmp = this.cur
        await this.init()
    },
    beforeDestroy() {
        this.toggle = false
    }
}
</script>

<style scoped>

</style>