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
     *
     * @return {Object} 当前Model存储的数据
     */
    get() {
        return data;
    },
    getSum() {
        let sum = {};
        Object.keys(data).forEach(el => {
            let value = sum[data[el].type] || 0;
            let pay = sum['总支出'] || 0;
            value += +data[el].amount;
            pay += data[el].type === '收入' ? 0 : +data[el].amount;
            sum[data[el].type] = value;
            sum['总支出'] = pay;
        });
        return sum;
    },

    /**
     * 更新数据模型中某个键对应的值
     *
     * @param {string} key 要修改值的键
     * @param {Object} value 修改后的值
     * @return {Object} 修改后Model存储的数据
     */
    update(key, value) {
        data[key] = value;
        this.sync();
        this.onchange(data);
        return data;
    },

    /**
     * 删除数据模型中某个键对应的值
     *
     * @param {string} key 要删除的键
     * @return {Object} 修改后Model存储的数据
     */
    delete(key) {
        if (data[key] === undefined) {
            return;
        }
        /* eslint-disable fecs-valid-map-set */
        delete data[key];
        /* eslint-enable fecs-valid-map-set */
        this.sync();
        this.onchange(data);
        return data;
    },
    // 将当前数据同步到localStorage
    sync() {
        window.localStorage.setItem('note', JSON.stringify(data));
    },
    // 数据变化后的回调函数
    onchange(data) {

    }
};
