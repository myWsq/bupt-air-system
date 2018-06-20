<template>
    <v-data-table :loading="loading" :headers="header" :items="info" item-key="ID">
        <template slot="no-data">
            <v-layout justify-center>
                <v-subheader>暂时没有统计信息</v-subheader>
            </v-layout>
        </template>
        <template slot="items" slot-scope="props">
            <tr @click="props.expanded = props.item.Record.length? !props.expanded : false">
                <td>{{ props.item.ID }}</td>
                <td>{{ props.item.Count }}</td>
                <td>{{ props.item.Cost }}</td>
                <td v-if="props.item.Record.length==0">{{ props.item.Record.length }}</td>
                <td v-else>
                    <strong style="color:#51b882">{{ props.item.Record.length }}</strong>
                </td>
            </tr>
        </template>
        <template slot="expand" slot-scope="props">
            <v-list two-line>
                <v-list-tile v-for="(item,i) in props.item.Record" :key="i">
                    <v-list-tile-content>
                        <v-list-tile-title>开始温度: {{item.S_temp}} 结束温度: {{item.E_temp}} 风速:{{item.Speed}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{item.S_time}} ---- {{item.E_time}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </template>
    </v-data-table>
</template>

<script>
export default {
    props: ['loading', 'info'],
    data() {
        return {
            header: [
                { text: '从机编号', value: 'ID' },
                { text: '开关机次数', value: 'Count' },
                { text: '总花费(￥)', value: 'Cost' },
                { text: '详细记录', value: 'Record' },
            ],
        }
    },
}
</script>

<style scoped>

</style>