<template>
    <div>
        <v-dialog v-model="visiable" max-width="400" :persistent="!baseUrl">
            <v-card tile>
                <v-card-title>
                    <h2>服务器设置</h2>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="url" label="输入服务器接口地址" required></v-text-field>
                </v-card-text>
                <v-card-actions class="px-2">
                    <v-btn @click="submit" style="width:100%" color="primary" :loading="loading>0">{{loading>0?'连接中...':'提交'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="error" bottom>连接失败, 请检查网络</v-snackbar>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    name: 'serverInit',
    data() {
        return {
            url: "",
            loading: 0,
            error: false,
        }
    },
    props: ['value'],
    computed: {
        ...mapState(['baseUrl']),
        visiable: {
            get() {
                return this.value
            },
            set(newValue) {
                this.$emit('input', newValue)
            }
        },
    },
    methods: {
        ...mapActions(['serverTest']),
        async submit() {
            this.loading++
            let res = await this.serverTest(this.url)
            if (!res) {
                this.error = true
                this.url = this.baseUrl
            } else {
                this.visiable = false
            }
            this.loading--
        }
    },
    async mounted() {
        this.url = await this.$storage.find('baseUrl')
        console.log(this.url);
        await this.serverTest(this.url)
        // 服务器未初始化
        if (!this.baseUrl) {
            this.visiable = true
        }
    }
}
</script>

<style scoped>

</style>