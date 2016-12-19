/**
 * @file 数据模型操作封装，采用localStorage作为数据本地存储的方式
 * @author Leuis Ken <leuisken@gmail.com>
 */

// 初始化
let data = JSON.parse(window.localStorage.getItem('note'));

if (data === null) {
    data = {};
    window.localStorage.setItem('note', JSON.stringify(data));
}

export default {
    /**
     * 获取数据
     * @return {object}
     */
    get() {
        return data;
    },
    /**
     * 更新数据模型中某个键对应的值
     * @param {string} key 要修改值的键
     * @param {object} value 修改后的值
     */
    update(key, value) {
        data[key] = value;
        this.sync();
        this.onchange(data);
    },
    /**
     * 删除数据模型中某个键对应的值
     * @param {string} key 要删除的键
     */
    delete(key) {
        if (data[key] === undefined) {
            return;
        }
        delete data[key];
        this.sync();
        this.onchange(data);
    },
    // 将当前数据同步到localStorage
    sync() {
        window.localStorage.setItem('note', JSON.stringify(data));
    },
    // 数据变化后的回调函数
    onchange(data) {

    }
};
