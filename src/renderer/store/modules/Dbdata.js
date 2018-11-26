import _ from "lodash"
import db from "../../database"

const dbapi = {

    insert(table, data) {
        return db.read().get(table).insert(data).write();
    },
    update(table, query, data) {
        if (db.read().get(table).find(query).value()) {
            return db.read().get(table).find(query).assign(data).write();
        }
        return false;
    },
    save(table, query, data) {
        const self = this;
        let post = self.update(table, query, data);
        if (!post) {
            post = self.insert(table, data);
        }
        return post;
    }
}


const state = {
    body: {}
}
const getters = {
    tables: state => {
        return _.keys(state.body);
    }
}

const mutations = {
    SET_LIST(state, data) {
        _.forEach(data,function (item,key) {

           if(!db.read().has(key).value()){

               db.read().set(key,[]).write();
           }
            _.forEach(data[key], function (row) {
                dbapi.save(key, {'name': row.name}, row);

            })
        })
        // if (_.has(data, 'd0')) {

        // }
        console.log(db.read().value());


        state.body = db.read().value();

    },
    RESET_DB(state){

        _.forEach(db.read().value(),function (item,key ) {
            db.read().unset(key).write()

        })
        console.log( db.read().value());
        state.body = {};

    },
    LOAD_DB(state){
        state.body = db.read().value();
    }
}

const actions = {
    updateList({commit}, data) {
        // console.log(data);
        commit('SET_LIST', data);
    },
    resetDb({commit}){
        commit('RESET_DB');
    },
    loadDb({commit}){
        commit('LOAD_DB')
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
