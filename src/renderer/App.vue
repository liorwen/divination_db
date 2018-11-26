<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'divination_db',
        mounted() {
            this.$store.dispatch('Dbdata/loadDb');
        }
    }
</script>

<style>
    /* CSS */
</style>
