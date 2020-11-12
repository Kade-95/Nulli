const { Base } = require('kedio');
global.base = new Base();
const Transactions = require('./includes/Transactions');

class Nulli {
    connection = {};
    constructor(params = { address: '', user: '', password: '', name: '' }) {
        this.connection = JSON.parse(JSON.stringify(params));
    }

    open() {
        let trans = new Transactions(this.connection);
        return trans.init();
    }

    close() {

    }

    createCollection(...names) {
        this.open().then(trans => {
            for (let name of names) {
                if (name.constructor === String) {
                    trans.newCollection(name);
                }
            }
        });
    }

    deleteCollection(...names) {
        this.open().then(trans => {
            for (let name of names) {
                if (name.constructor === String) {
                    trans.removeCollection(name);
                }
            }
        });
    }

    insert(params = { collection: '', query: {}, options: { many: false } }) {
        if (params == undefined) params = {};
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {
            if (params.constructor != Object) {
                reject("Error: Invalid parameters recieved");
                return;
            }
            else if (params.collection == '') {
                reject("Error: Invalid collection name recieved");
                return;
            }
            else if (params.options.constructor != Object) {
                reject("Error: Invalid collection name recieved");
                return;
            }

            this.open()
                .then((trans) => {
                    if (trans.collections[params.collection] == undefined) {
                        trans.collections[params.collection] = [];
                    }

                    let collection = trans.collections[params.collection];

                    if (params.options.many == true) {
                        if (params.query.constructor != Array) {
                            reject("Error: Invalid query recieved");
                            return;
                        }
                        for (let i = 0; i < params.query.length; i++) {
                            if (params.query[i]._id == undefined) {
                                params.query[i]._id = trans.get_id();
                                collection.push(params.query[i]);
                            }
                        }
                    }
                    else {
                        if (params.query.constructor != Object) {
                            reject("Error: Invalid query recieved");
                            return;
                        }

                        params.query._id = trans.get_id();
                        collection.push(params.query);
                    }
                    trans.openCollection = params.collection;
                    trans.close();
                    resolve(params.query);
                });
        });
    }

    update(params = { collection: '', query: {}, new: {}, options: { many: false } }) {
        if (params == undefined) params = {};
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.new == undefined) params.new = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {
            if (params.constructor != Object) {
                reject("Error: Invalid parameters recieved");
                return;
            }
            else if (params.collection == '') {
                reject("Error: Invalid collection name recieved");
                return;
            }
            else if (params.options.constructor != Object) {
                reject("Error: Invalid collection name recieved");
                return;
            }
            else if (params.new.constructor != Object && params.new.constructor != Array) {
                reject("Error: Invalid new(update) recieved (Must be either Array or Object)");
                return;
            }

            this.open()
                .then((trans) => {
                    if (trans.collections[params.collection] == undefined) {
                        reject('Error! Collection not found');
                        return;
                    }

                    let i, x, collections = [];
                    for (i = 0; i < trans.collections[params.collection].length; i++) {
                        if (global.base.object.isSubObject(trans.collections[params.collection][i], params.query)) {
                            if (params.new.constructor == Array && params.new[i] != undefined) {
                                for (x in params.new[i]) {
                                    trans.collections[params.collection][i][x] = params.new[i][x];
                                }
                            }
                            else if (params.new.constructor == Object) {
                                for (x in params.new) {
                                    trans.collections[params.collection][i][x] = params.new[x];
                                }
                            }
                            collections.push(trans.collections[params.collection][i]);
                            if (!!params.options.many != true) break;
                        }
                    }

                    trans.openCollection = params.collection;
                    trans.close();
                    resolve(collections);
                });
        });
    }

    save(params = { collection: '', query: {}, check: {}, options: { many: false } }) {
        return this.exists({ collection: params.collection, query: params.check }).then(exists => {
            if (exists) {
                return this.update({ collection: params.collection, query: params.check, new: params.query });
            }
            else {
                return this.insert({ collection: params.collection, query: params.query });
            }
        })
    }

    replace(params = { collection: '', query: {}, new: {}, options: { many: false } }) {
        if (params == undefined) params = {};
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.new == undefined) params.new = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {
            if (params.constructor != Object) {
                reject("Error: Invalid parameters recieved");
                return;
            }
            else if (params.collection == '') {
                reject("Error: Invalid collection name recieved");
                return;
            }
            else if (params.options.constructor != Object) {
                reject("Error: Invalid collection name recieved");
                return;
            }
            else if (params.new.constructor != Object && params.new.constructor != Array) {
                reject("Error: Invalid new(replace) recieved (Must be either Array or Object)");
                return;
            }

            this.open()
                .then((trans) => {
                    if (trans.collections[params.collection] == undefined) {
                        reject('Error! Collection not found');
                        return;
                    }

                    let i, collections = [];
                    for (i = 0; i < trans.collections[params.collection].length; i++) {
                        if (global.base.object.isSubObject(trans.collections[params.collection], params.query)) {
                            if (params.new.constructor == Array && params.new[i] != undefined) {
                                params.new[i]._id = trans.collections[params.collection][i]._id;
                                trans.collections[params.collection][i] = params.new[i];
                            }
                            else if (params.new.constructor == Object) {
                                params.new._id = trans.collections[params.collection][i]._id;
                                trans.collections[params.collection][i] = params.new;
                            }
                        }

                        collections.push(trans.collections[params.collection][i]);
                        if (!!params.options.many != true) break;
                    }

                    trans.openCollection = params.collection;
                    trans.close();
                    resolve(collections);
                });
        });
    }

    delete(params = { collection: '', query: {}, new: {}, options: { many: false } }) {
        if (params == undefined) params = {};
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {
            if (params.constructor != Object) {
                reject("Error: Invalid parameters recieved");
                return;
            }
            else if (params.collection == '') {
                reject("Error: Invalid collection name recieved");
                return;
            }
            else if (params.options.constructor != Object) {
                reject("Error: Invalid collection name recieved");
                return;
            }

            this.open()
                .then((trans) => {
                    if (trans.collections[params.collection] == undefined) {
                        reject('Error! Collection not found');
                        return;
                    }

                    let c, collection = [], deleted = false, i = 0;
                    for (c of trans.collections[params.collection]) {
                        if (global.base.object.isSubObject(c, params.query) && !deleted) {
                            i++;
                            if (!!params.options.many != true) deleted = true;
                            continue;
                        }

                        collection.push(c);
                    }

                    trans.collections[params.collection] = collection;
                    trans.openCollection = params.collection;
                    trans.close();
                    resolve({ status: true, count: i });
                });
        });
    }

    exists(params = { collection: '', query: {} }) {
        return this.find(params).then(found => {
            return !!found;
        });
    }

    find(params = { collection: '', query: {}, options: { many: false } }) {
        if (params == undefined) params = {};
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {
            if (params.constructor != Object) {
                reject("Error: Invalid parameters recieved");
                return;
            }
            else if (params.collection == '') {
                reject("Error: Invalid collection name recieved");
                return;
            }
            else if (params.options.constructor != Object) {
                reject("Error: Invalid collection name recieved");
                return;
            }

            this.open()
                .then((trans) => {
                    if (trans.collections[params.collection] == undefined) {
                        trans.collections[params.collection] = [];
                    }

                    let collection = trans.collections[params.collection];
                    let found;

                    if (Object.keys(params.query).length) {
                        if (params.options.many == true) {
                            found = collection.filter(c => global.base.object.isSubObject(c, params.query));
                        }
                        else {
                            found = collection.find(c => global.base.object.isSubObject(c, params.query));
                        }
                    }
                    else {
                        if (params.options.many == true) {
                            found = collection;
                        }
                        else {
                            found = collection[0];
                        }
                    }
                    trans.openCollection = params.collection;
                    trans.close();
                    resolve(found);
                });
        });
    }

    aggregate(params = { collection: '', query: {}, options: { many: false } }) {

    }

    relate(params = { collection: '', query: {}, relations: {}, options: {} }) {
        return new Promise((resolve, reject) => {
            if (params.relations == undefined) params.relations = {};
            this.find({ collection: params.collection, query: params.query })
                .then(found => {
                    let x, match, run = {}, flag;
                    if (params.relations.constructor == Object) {
                        for (x in params.relations) {
                            let query = {};
                            for (match of params.relations[x].match) {
                                query[match.foriegn] = found[match.local];
                            }

                            run[x] = this.find({ collection: params.relations[x].collection, query, options: { many: true } });
                        }
                    }

                    global.base.runParallel(run, ran => {
                        for (x in ran) {
                            if (!!params.relations.many) found[x] = ran[x];
                            else found[x] = (ran[x] != undefined) ? ran[x][0] : undefined;
                        }

                        resolve(found);
                    });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

module.exports = Nulli;