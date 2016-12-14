/**
 * @file 数据模型操作
 * @author Leuis Ken <leuisken@gmail.com>
 */
let data = JSON.parse(window.localStorage.getItem('note'));

if (data === null) {
    data = {};
    window.localStorage.setItem('note', JSON.stringify(data));
}

export default {
    get() {
        return data;
    },
    update(key, value, callback) {
        data[key] = value;
        this.sync();
        this.onchange(data);
    },
    delete(key) {
        delete data[key];
        this.sync();
        this.onchange(data);
    },
    sync() {
        window.localStorage.setItem('note', JSON.stringify(data));
    },
    onchange(data) {

    }
};
