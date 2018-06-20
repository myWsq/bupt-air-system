<template>
    <v-layout column>
        <v-subheader>请求列表</v-subheader>
        <v-card>
            <v-container>
                <v-layout justify-center v-if="info===null">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-layout>
                <v-data-table v-else :headers="headers" :items="info" hide-actions>
                    <template slot="no-data">
                        <v-layout justify-center>
                            <v-subheader>暂时没有温控请求</v-subheader>
                        </v-layout>
                    </template>
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.slave_id }}</td>
                        <td >{{ props.item.temp }}</td>
                        <td >{{ props.item.speed }}</td>
                        <td >{{ new Date(props.item.time).toLocaleTimeString('it-IT') }}</td>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>
    </v-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            info: null,
            timer: null,
            loading: 0,
            headers: [
                { text: '从机编号', value: 'slave_id' },
                { text: '温度(℃)', value: 'temp' },
                { text: '风速(档)', value: 'speed' },
                { text: '时间', value: 'time' },
            ],
        }
    },
    computed: {
        ...mapState(['client'])
    },
    methods: {
        async getInfo() {
            if (this.loading === 0) {
                this.loading++
                try {
                    this.info = (await this.client.get('/master/request/all')).data
                    this.loading--
                } catch (e) {
                    console.error(e)
                    this.loading--
                }

            }
        }
    },
    async mounted() {
        await this.getInfo()
        this.timer = setInterval(() => {
            this.getInfo()
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }

}
</script>

<style scoped>

</style>