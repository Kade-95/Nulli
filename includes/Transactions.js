const fs = require('fs');
class Transaction {
    dbExists = false;
    collections = {};
    error = undefined;
    openCollection = undefined;
    #connection = {};
    #path = '';
    #collectionsPath = '';
    #cachePath = '';

    constructor(params = { address: '', user: '', password: '', name: '' }) {
        this.#connection = JSON.parse(JSON.stringify(params));
        this.#path = `${params.address}/${params.name}`;
        this.#collectionsPath = `${params.address}/${params.name}/collections`;
        this.#cachePath = `${params.address}/${params.name}/cache`;
        this.name = params.name;
    }

    init() {
        return this.isDB()
            .then(flag => {
                if (!flag) {
                    this.createDB();
                }

                let dir = fs.readdirSync(this.#collectionsPath);
                let d;
                for (let p of dir) {
                    if (p.lastIndexOf('.json') + '.json'.length == p.length) {
                        try {
                            d = JSON.parse(fs.readFileSync(`${this.#collectionsPath}/${p}`).toString());
                        } catch (error) {
                            d = [];
                        } finally {
                            this.collections[p.replace('.json', '')] = d;
                        }
                    }
                }
                return this;
            })
            .catch(error => {
                console.log(error);
                this.error = error;
            });
    }

    isDB() {
        return new Promise((resolve, reject) => {
            fs.stat(this.#path, (error, stat) => {
                if (error) {
                    if (error.code == "ENOENT") {
                        resolve(false);
                    }
                    else {
                        reject(error);
                    }
                }
                if (stat) {
                    resolve(stat.isDirectory())
                }
            });
        });
    }

    createDB() {
        let path = this.#path.split('/');
        let p = '';
        for (let i of path) {
            p += `${i}/`;
            if (p[p.length - 2] !== ':') {
                if (!fs.existsSync(p))
                    fs.mkdirSync(p);
            }
        }
        fs.mkdirSync(this.#collectionsPath);
        fs.mkdirSync(this.#cachePath);
    }

    newCollection(name) {
        let path = `${this.#path}/${name}.json`;
        fs.stat(path, (statError, stat) => {
            if (!(stat && stat.isFile)) {
                fs.writeFile(path, "[]", (writeError, data) => {
                    if (writeError) console.error(writeError);
                });
            }
        });
    }

    removeCollection(name) {
        let path = `${this.#path}/${name}.json`;
        fs.unlink(path, (error, done) => {
            this.error = error;
        });
    }

    rollback() {

    }

    close() {
        if (this.openCollection.constructor == String && this.openCollection != '') {
            let collectionsPath = `${this.#collectionsPath}/${this.openCollection}.json`;
            let cachePath = `${this.#cachePath}/${this.get_id()}.json`;

            let collection = this.collections[this.openCollection];
            fs.readFile(collectionsPath, (readError, data) => {
                this.error = readError;
                if (readError) {
                    if (readError.code == 'ENOENT') {
                        data = "[]";
                    }
                }
                if (data) {
                    try {
                        data = JSON.parse(data.toString());
                    } catch (error) {
                        this.error = error;
                    }

                    if (data.constructor == Array) {
                        for (let row of data) {
                            if (!collection.find(c => c._id == row._id)) {
                                collection.push(row);
                            }
                        }

                        fs.writeFile(cachePath, JSON.stringify(collection), (error, done) => {
                            if (!error) {
                                let string = JSON.stringify(collection);
                                fs.writeFileSync(collectionsPath, string);
                                fs.unlinkSync(cachePath);
                            }
                        });
                    }
                }
            });
        }
    }

    get_id() {
        let _id = Date.now().toString(24) + Math.random().toString(24).slice(2);//generate the key
        return _id;
    }
}

module.exports = Transaction;