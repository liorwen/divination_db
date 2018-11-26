<template>
    <div class="table-responsive">
        <b-table striped hover :items="list"></b-table>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "Hex",
        props: {
            table: String,
        },
        method: {},
        computed: {
            list() {
                const self = this;

                return _.map(self.$store.state.Dbdata.body[self.table], function (item) {
                    let obj = {};
                    _.forEach(item, function (row, key) {
                        if (key !== 'id') {
                            obj[key] = row;
                        }
                    })
                    return obj;
                });
            }
        }
    }
</script>

<style scoped>
    th {
        white-space: nowrap;
    }
</style>