<template>
    <v-layout column>
        <v-subheader>从机状态</v-subheader>
        <v-card>
            <v-container>
                <v-layout justify-center v-if="slaveList===null">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-layout>
                <v-data-table :loading="btnLoading>0" v-else :headers="slaveTableHeaders" :items="slaveList" hide-actions>
                    <template slot="no-data">
                        <v-layout justify-center>
                            <v-subheader>暂时没有从机信息</v-subheader>
                        </v-layout>
                    </template>
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>
                            <v-layout align-center>
                                <span class="pr-2">{{ props.item.target_temp }}</span>
                                <v-btn :disabled="props.item.target_temp>=30" icon class="ma-0" @click="op('temp','high',props.item.id)">
                                    <v-icon color="success">add</v-icon>
                                </v-btn>
                                <v-btn :disabled="props.item.target_temp<=10" icon class="ma-0" @click="op('temp','low',props.item.id)">
                                    <v-icon color="error">remove</v-icon>
                                </v-btn>

                            </v-layout>

                        </td>
                        <td>{{ props.item.cur_temp }}</td>
                        <td>
                            <v-layout align-center>
                                <span class="pr-2">{{ props.item.speed }}</span>
                                <v-btn :disabled="props.item.speed>=3" icon class="ma-0" @click="op('speed','high',props.item.id)">
                                    <v-icon color="success">add</v-icon>
                                </v-btn>
                                <v-btn :disabled="props.item.speed<=0" icon class="ma-0" @click="op('speed','low',props.item.id)">
                                    <v-icon color="error">remove</v-icon>
                                </v-btn>

                            </v-layout>
                        </td>
                        <td class="text-xs-right">{{ props.item.energy.toFixed(2) }}</td>
                        <td class="text-xs-right">{{ props.item.amount.toFixed(2) }}</td>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>
        <v-snackbar v-model="error" bottom right>{{errorStr}}</v-snackbar>
    </v-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            // 自动请求的loading状态
            infoLoading: 0,
            // 点击按钮的loading状态
            btnLoading: 0,
            slaveList: null,
            error: false,
            errorStr: "",
            slaveTableHeaders: [
                { text: '编号', value: 'id' },
                { text: '设定温度(℃)', value: 'target_temp' },
                { text: '室温(℃)', value: 'cur_temp' },
                { text: '风速(档)', value: 'speed' },
                { text: '能量(kw/h)', value: 'energy' },
                { text: '累计金额(元)', value: 'amount' }
            ],
            reqList: null,
            flag: null,
        }
    },
    computed: {
        ...mapState(['client']),
    },
    methods: {
        async getInfo() {
            if (this.infoLoading === 0) {
                this.infoLoading++;
                try {
                    this.slaveList = (await this.client.get('/slave/')).data
                    this.infoLoading--;
                } catch (e) {
                    console.error(e)
                    this.infoLoading--;
                }
            }
        },
        async op(type, op, id) {
            this.btnLoading++;
            try {
                await this.client.get(`/master/${type}/${op}/${id}`)
                await this.getInfo()
                this.btnLoading--
            } catch (e) {
                console.error(e)
                this.error = true
                this.errorStr = '操作失败,检查网络设置'
                this.btnLoading--
            }
        },
    },
    async mounted() {
        await this.getInfo()
        this.flag = setInterval(() => {
            this.getInfo()
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.flag)
    }
}
</script>

<style scoped>

</style>