const { Base } = require('kedio');
global.base = new Base();
const Transactions = require('./includes/Transactions');

class Nulli {
    connection = {};
    constructor(params = { address: '', user: '', password: '', name: '' }) {
        this.connection = JSON.parse(JSON.stringify(params));
    }

    open() {//open a new database transaction
        let trans = new Transactions(this.connection);
        return trans.init();
    }

    close() {

    }

    createCollection(...names) {//create new collection(s)
        this.open().then(trans => {
            for (let name of names) {
                if (name.constructor === String) {
                    trans.newCollection(name);
                }
            }
        });
    }

    deleteCollection(...names) {//delete collection(s)
        this.open().then(trans => {
            for (let name of names) {
                if (name.constructor === String) {
                    trans.removeCollection(name);
                }
            }
        });
    }

    insert(params = { collection: '', query: {}, options: { many: false } }) {//insert
        if (params == undefined) params = {};//initialize params
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

                    if (params.options.many == true) {//insert multiple documents
                        if (params.query.constructor != Array) {
                            reject("Error: Invalid query recieved");
                            return;
                        }
                        for (let i = 0; i < params.query.length; i++) {
                            if (params.query[i]._id == undefined) {
                                params.query[i]._id = trans.get_id();//assign an _id
                                collection.push(params.query[i]);
                            }
                        }
                    }
                    else {
                        if (params.query.constructor != Object) {//single document
                            reject("Error: Invalid query recieved");
                            return;
                        }

                        params.query._id = trans.get_id();//assign an _id
                        collection.push(params.query);
                    }
                    trans.openCollection = params.collection;
                    trans.close();//close transaction
                    resolve(params.query);
                });
        });
    }

    update(params = { collection: '', query: {}, changes: {}, options: { many: false } }) {
        if (params == undefined) params = {};//initialize params
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.changes == undefined) params.changes = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {
            if (params.constructor != Object) {//validate params
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
            else if (params.changes.constructor != Object && params.changes.constructor != Array) {
                reject("Error: Invalid changes(update) recieved (Must be either Array or Object)");
                return;
            }

            this.open()
                .then((trans) => {
                    if (trans.collections[params.collection] == undefined) {//validate collection name
                        reject('Error! Collection not found');
                        return;
                    }

                    let i, x, collections = [];
                    for (i = 0; i < trans.collections[params.collection].length; i++) {
                        //search for matched documents
                        if (global.base.object.isSubObject(trans.collections[params.collection][i], params.query)) {//document matched the query
                            if (params.changes.constructor == Array && params.changes[i] != undefined) {//is one on one change?
                                for (x in params.changes[i]) {
                                    trans.collections[params.collection][i][x] = params.changes[i][x];
                                }
                            }
                            else if (params.changes.constructor == Object) {//group change
                                for (x in params.changes) {
                                    trans.collections[params.collection][i][x] = params.changes[x];
                                }
                            }
                            //update the changed document
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
        return this.exists({ collection: params.collection, query: params.check }).then(exists => {//is document existing?
            if (exists) {
                return this.update({ collection: params.collection, query: params.check, changes: params.query });//update if found
            }
            else {
                return this.insert({ collection: params.collection, query: params.query });//insert if not found
            }
        });
    }

    replace(params = { collection: '', query: {}, replacement: {}, options: { many: false } }) {//replace an existing document or create a new one
        if (params == undefined) params = {};//initialize params
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.replacement == undefined) params.replacement = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {//validate params
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
            else if (params.replacement.constructor != Object && params.replacement.constructor != Array) {
                reject("Error: Invalid replacement(replace) recieved (Must be either Array or Object)");
                return;
            }

            this.open()
                .then((trans) => {
                    if (trans.collections[params.collection] == undefined) {//insert all documents if collect is not found
                        return this.insert(params);
                    }
                    else {
                        let i, collections = [];
                        for (i = 0; i < trans.collections[params.collection].length; i++) {
                            if (global.base.object.isSubObject(trans.collections[params.collection], params.query)) {//if docuemnt matches query
                                if (params.replacement.constructor == Array && params.replacement[i] != undefined) {//is one on one replacement
                                    params.replacement[i]._id = trans.collections[params.collection][i]._id;
                                    trans.collections[params.collection][i] = params.replacement[i];
                                }
                                else if (params.replacement.constructor == Object) {//group replacement
                                    let replacement = JSON.parse(JSON.parse(params.replacement));
                                    replacement._id = trans.collections[params.collection][i]._id;
                                    trans.collections[params.collection][i] = replacement;
                                }
                            }

                            collections.push(trans.collections[params.collection][i]);
                            if (!!params.options.many != true) break;//single replacement
                        }

                        trans.openCollection = params.collection;
                        trans.close();
                        resolve(collections);
                    }
                });
        });
    }

    delete(params = { collection: '', query: {}, options: { many: false } }) {
        if (params == undefined) params = {};//initialize params
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {//validate params
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
                        reject('Error! Collection not found');//validate collection name
                        return;
                    }

                    let c, collection = [], deleted = false, i = 0;
                    for (c of trans.collections[params.collection]) {
                        if (global.base.object.isSubObject(c, params.query) && !deleted) {//match found remove
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

    exists(params = { collection: '', query: {} }) {//check if a document exists
        return this.find(params).then(found => {
            return !!found;
        });
    }

    find(params = { collection: '', query: {}, options: { many: false } }) {
        if (params == undefined) params = {};//initialize params
        if (params.collection == undefined) params.collection = '';
        if (params.query == undefined) params.query = {};
        if (params.options == undefined) params.options = {};

        return new Promise((resolve, reject) => {
            if (params.constructor != Object) {//validate params
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

                    if (Object.keys(params.query).length) {//if query is set
                        if (params.options.many == true) {
                            found = collection.filter(c => global.base.object.isSubObject(c, params.query));
                        }
                        else {
                            found = collection.find(c => global.base.object.isSubObject(c, params.query));
                        }
                    }
                    else {//no query recieved, return all
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
            if (params.relations == undefined) params.relations = {};//initialize params
            this.find({ collection: params.collection, query: params.query })
                .then(found => {//find the local documents
                    let x, match, run = {};
                    if (params.relations.constructor == Object) {
                        for (x in params.relations) {
                            let query = {};
                            for (match of params.relations[x].match) {
                                query[match.foriegn] = found[match.local];
                            }

                            //set the find algorithms for each relation
                            run[x] = this.find({ collection: params.relations[x].collection, query, options: { many: true } });
                        }
                    }

                    global.base.runParallel(run, ran => {//find all relations at the same time
                        for (x in ran) {
                            if (!!params.relations.many) found[x] = ran[x];//is relation a list?
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