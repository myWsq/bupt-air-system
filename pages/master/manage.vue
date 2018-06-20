<template>
    <v-container>
        <v-subheader>新增从机</v-subheader>
        <v-card>
            <v-container>
                <v-layout justify-end align-center>
                    <v-text-field v-model="cardID" ref="input" label="身份证号码" :rules="rules" validate-on-blur counter="18"></v-text-field>
                    <v-btn class="ml-5" :loading="btnLoading>0" @click="createSlave" color="primary">提交</v-btn>
                </v-layout>
            </v-container>
        </v-card>
        <v-subheader>从机列表</v-subheader>
        <v-card>
            <v-container>
                <v-layout justify-center v-if="info===null">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-layout>
                <v-data-table v-else :loading="formLoading>0" :headers="[{text:'从机编号',value:'id'},{text:'用户证件号',value:'card_id'},{text:'操作',value:'op'}]" :items="info" hide-actions>

                    <template slot="no-data">
                        <v-layout justify-center>
                            <v-subheader>暂时没有从机信息</v-subheader>
                        </v-layout>
                    </template>
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.card_id }}</td>
                        <td>
                            <v-btn flat @click="delSlave(props.item.id)" class="ma-0" color="warning">删除</v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>
        <v-snackbar bottom right v-model="error">{{errorStr}}</v-snackbar>
    </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            cardID: "",
            rules: [
                v => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v) || '身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X'
            ],
            info: null,
            loading: 0,
            btnLoading: 0,
            formLoading: 0,
            flag: null,
            error: false,
            errorStr: ""
        }
    },
    computed: {
        ...mapState(['client'])
    },
    methods: {
        async getInfo() {
            if (this.loading === 0) {
                this.loading++;
                try {
                    this.info = (await this.client.get('/slave/')).data
                    this.loading--
                } catch (e) {
                    console.error(e)
                    this.loading--
                }
            }
        },
        async delSlave(id) {
            this.formLoading++
            try {
                await this.client.delete(`/slave/${id}`)
                this.formLoading--
            } catch (e) {
                this.errorStr = "请求失败,请重试"
                this.error = true
                this.formLoading--
            }
        },
        async createSlave() {
            if (this.$refs['input'].validate()) {
                this.btnLoading++
                try {
                    await this.client.post('/slave/', {
                        card_id: this.cardID
                    })
                    this.errorStr = '提交成功'
                    this.error = true
                    this.btnLoading--
                } catch (e) {
                    console.error(e)
                    this.errorStr = '提交失败,证件号重复或无网络连接'
                    this.error = true
                    this.btnLoading--
                }

            }
        }
    },
    async mounted() {
        await this.getInfo()
        this.flag = setInterval(() => {
            this.getInfo()
        }, 1000)
    },
    deforeDestroy() {
        clearInterval(this.flag)
    }

}
</script>

<style scoped>

</style>