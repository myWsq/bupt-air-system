<template>
    <div>
        <v-container>
            <slave-status></slave-status>
            <request-list></request-list>
        </v-container>
    </div>
</template>

<script>
import components from '@/components'
export default {
    components: {
        'slaveStatus': components['master/slave-status'],
        'requestList': components['master/request-list']
    }
}
</script>

<style scoped>

</style>