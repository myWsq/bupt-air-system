<template>
    <v-container>
        <v-subheader>今日报表</v-subheader>
        <v-card>
            <v-layout justify-center v-if="todayLog===null" class="pa-5">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-layout>
            <log-box v-else :info="todayLog" :loading="todayLogLoading>0"></log-box>
        </v-card>
        <v-subheader>自定义查询</v-subheader>
        <v-stepper v-model="el">
            <v-stepper-header>
                <v-stepper-step :complete="startDate !==null" step="1">选择开始日期</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="endDate!==null" step="2">选择结束日期</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">查询结果</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-date-picker v-model="startDate" :max="today" full-width landscape class="mt-3" @input="el++"></v-date-picker>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-date-picker v-model="endDate" :min="startDate" :max="today" full-width landscape class="mt-3" @input="el++"></v-date-picker>
                </v-stepper-content>
                <v-stepper-content step="3">
                    <v-layout justify-center v-if="logs===null" class="pa-5">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </v-layout>
                    <log-box v-else :info="logs" :loading="logLoading>0"></log-box>
                </v-stepper-content>
            </v-stepper-items>
            <v-layout justify-end>
                <v-btn @click="clear" color="primary" class="ma-3 mt-0">重新选择</v-btn>
            </v-layout>
        </v-stepper>
        <v-snackbar bottom right v-model="error">{{errorText}}</v-snackbar>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment'
import com from '@/components'
export default {
    data() {
        return {
            el: 1,
            todayLog: null,
            logs: null,
            logLoading: null,
            todayLogLoading: 0,
            error: false,
            errorText: "",
            startDate: null,
            endDate: null,
            header: [
                { text: '从机编号', value: 'ID' },
                { text: '开关机次数', value: 'Count' },
                { text: '总花费', value: 'Cost' },
                { text: '详细记录', value: 'Record' },
            ],
        }
    },
    computed: {
        ...mapState(['client']),
        today() {
            return moment().format('YYYY-MM-DD')
        }

    },
    watch: {
        el(newValue, oldValue) {
            if (newValue === 3) {
                this.getLogs()
            }
        }
    },
    methods: {
        async getTodayLog() {
            this.todayLogLoading++;
            try {
                this.todayLog = (await this.client.get('/log/today')).data
                this.todayLogLoading--;
            } catch (e) {
                console.log(e);
                this.error = true
                this.errorText = "获取今日报表失败,请检查日志"
            }
        },
        async getLogs() {
            this.logLoading++;
            try {
                this.logs = (await this.client.post('/log/', {
                    startDate: this.startDate,
                    endDate: this.endDate,
                })).data
                this.logLoading--;
            } catch (e) {
                console.log(e);
                this.error = true
                this.errorText = "获取今日报表失败,请检查日志"
            }
        },
        clear() {
            this.startDate = null
            this.endDate = null
            this.el = 1
        }
    },
    components: { 'logBox': com['master/logBox'] },
    async beforeMount() {
        await this.getTodayLog()
    }
}
</script>

<style scoped>

</style>