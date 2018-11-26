<template>
    <b-container>
        <b-row>
            <b-col cols="12">
                <h1 class="my-4 text-center">卜卦資料庫輸出</h1>
            </b-col>
            <b-col cols="4">
                <b-button class="mb-3" size="" variant="success" v-on:click="open_file">匯入資料</b-button>
            </b-col>
            <b-col cols="4">
                <b-button class="mb-3" size="" variant="success" v-on:click="reset_db">重置資料</b-button>
            </b-col>
            <b-col cols="4">
                <b-button class="mb-3" size="" variant="success" v-on:click="download_db">匯出資料</b-button>
            </b-col>
            <b-col cols="12">
                <b-tabs>
                    <b-tab v-for="(row,key,index) in body" :title="key" :active="index===0">
                        <db-list :table="key"></db-list>
                    </b-tab>

                </b-tabs>
            </b-col>

        </b-row>
    </b-container>
</template>

<script>
    import { remote, app } from 'electron'
    import XLSX from 'xlsx';
    import DbList from "../components/DbList";
    import _ from "lodash";
    import path from 'path'
    import fs from 'fs-extra'


    export default {
        name: "Home",
        components: {DbList},

        methods: {
            async open_file() {
                const self = this;
                const o = await remote.dialog.showOpenDialog({properties: ['openFile']});
                if(o)
                {
                    const wb = XLSX.readFile(o[0]);
                    const sheetNames = wb.SheetNames;
                    let dd = {};
                    _.forEach(sheetNames, function (name, key) {
                        // console.log(`${key}:${name}`);
                        const dSheets = wb.Sheets[name];
                        const dList = XLSX.utils.sheet_to_json(dSheets);
                        // self.$store.dispatch('Dbdata/updateList', {key: `d${key}`, name: name, list: dList});
                        _.set(dd, name, dList);
                    })
                    // console.log(dd);
                    self.$store.dispatch('Dbdata/updateList', dd);
                }



            },
            reset_db()
            {
                this.$store.dispatch('Dbdata/resetDb');
            },
            async download_db()
            {
                const target = await remote.dialog.showSaveDialog(null, {
                        filters: [
                            {name: 'json file', extensions: ['json']}
                        ]
                    }
                );
                if(target)
                {
                    console.log(target);
                    const APP = process.type === 'renderer' ? remote.app : app
                    const STORE_PATH = APP.getPath('userData')
                    fs.copy(path.join(STORE_PATH, '/divination_db.json'),target).then(()=>console.log('已輸出'))
                }

            }
        },
        computed: {
            body() {
                const self = this;
                return self.$store.state.Dbdata.body;
            },
            tables() {
                const self = this;
                console.log(self.$store.getters['Dbdata/tables']);
                return self.$store.getters['Dbdata/tables'];
            }
        }
    }
</script>

<style scoped>

</style>