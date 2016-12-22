/**
 * @file 核心业务逻辑
 * @author Leuis Ken <leuisken@gmail.com>
 */
import './asserts/styles/iconfont.css';
import './asserts/styles/index.less';
import Model from './model';
import Dialog from './dialog';
import Router from './router';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// 中文类型与css class对应的字典
const typeDic = {
    '收入': 'income',
    '衣服': 'clothing',
    '饮食': 'diet',
    '住宿': 'hotel',
    '交通': 'transportation',
    '购物': 'shop',
    '其他': 'other'
};

// View对象，用于保存视图更新相关的方法
/* eslint-disable fecs-prefer-class */
const View = {
    // 根据Model中的数据，渲染新的账目列表
    render(data) {
        let frag = document.createDocumentFragment();
        let list = $('.account-list');
        Object.keys(data).forEach(el => {
            let item = document.createElement('li');
            let date = new Date(+el);
            let type = typeDic[data[el].type];
            item.className = 'account-list-item clearfix';
            // 将条目创建的时间戳存储在条目的dataset中
            item.dataset.timestamp = el;
            item.innerHTML = `
                <div class="icon ${type}"><i class="iconfont icon-${type}"></i></div>${data[el].type}
                <span class="timestamp">
                    ${date.getFullYear() % 100}/${date.getMonth() + 1}/${date.getDate()}
                </span>
                <span class="amount ${data[el].amount.toString()[0] !== '-' ? 'income' : 'cost'}">
                    ${data[el].amount}
                </span>
                <button>编辑</button>
                <button>删除</button>
            `;
            frag.appendChild(item);
        });
        list.innerHTML = '';
        list.appendChild(frag);
    },
    // 渲染条目编辑页面，主要在编辑时将条目信息填写到页面中
    renderModal(hash) {
        let timestamp = hash.split('/')[1];
        let data = Model.get()[timestamp] || {type: '收入', amount: ''};
        $('.selected-type').innerHTML = `
            <div class="icon ${typeDic[data.type]}">
                <i class="iconfont icon-${typeDic[data.type]}"></i>
            </div>
            ${data.type}
        `;
        $('#amount').value = data.amount ? Math.abs(data.amount) : '';
    },
    // 渲染条目统计页面
    renderSum(sum) {
        let frag = document.createDocumentFragment();
        let list = $('.account-list');
        Object.keys(typeDic).forEach(type => {
            if (sum[type] !== undefined) {
                let item = document.createElement('li');
                item.className = 'account-list-item clearfix';
                item.innerHTML = `
                    <div class="icon ${typeDic[type]}"><i class="iconfont icon-${typeDic[type]}"></i></div>${type}
                    <span class="amount ${sum[type].toString()[0] !== '-' ? 'income' : 'cost'}">
                        ${sum[type].toFixed(2)}
                    </span>
                `;
                frag.appendChild(item);
            }
        });
        list.innerHTML = '';
        list.appendChild(frag);
    }
};
/* eslint-enable fecs-prefer-class */

let list = $('.account-list');
let editForm = new Dialog($('.add-menu'));

// 账目列表及其子元素的click事件处理逻辑
list.addEventListener('click', function ({target}) {
    // 删除逻辑
    if (target.textContent === '删除') {
        if (confirm('您确定要删除这条记录吗？')) {
            let timestamp = target.parentNode.dataset.timestamp;
            View.render(Model.delete(timestamp));
        }
    }
    // 编辑逻辑
    else if (target.textContent === '编辑') {
        window.location.hash = `#add/${target.parentNode.dataset.timestamp}`;
    }
});

// list.addEventListener('touchstart', function ({target}) {
//     let element = target;
//     while (element.nodeName !== 'LI' || element.className !== 'account-list-item') {
//         if (element === this) {
//             return;
//         }
//         element = element.parentNode;
//     }
//     console.log(element);
// });

// 路由控制
Router.push({
    checker: /.*/,
    callback(hash) {
        if ($('.menu').style.height === '40px') {
            $('.nav').dispatchEvent(new Event('click'));
        }
        let items = Array.from($$('li.menu-item'));
        items.forEach(el => el.className = 'menu-item');
        switch (hash) {
            case '':
                items[0].className += ' active';
                break;
            case '#sum':
                items[1].className += ' active';
                break;
            default:
        }
    }
});

Router.push({
    checker: /^$/,
    callback() {
        View.render(Model.get());
    }
});

Router.push({
    checker: /^#add/,
    callback(hash) {
        editForm.show();
        View.renderModal(hash);
    }
});

Router.push({
    checker: /^#sum$/,
    callback() {
        View.renderSum(Model.getSum());
    }
});

// 关闭弹出层
$('.add-menu .close').addEventListener('click', function () {
    editForm.hide();
    window.location.hash = '';
});

// 页面加载时出发hashchange事件，以保证路由与界面的对应
window.addEventListener('load', function () {
    window.dispatchEvent(new Event('hashchange'));
});

// 修改当前选中类别的逻辑
$('.select-list').addEventListener('click', function ({target}) {
    let element = target;
    while (element.nodeName !== 'DIV' || element.className !== 'select-type') {
        if (element === this) {
            return;
        }
        element = element.parentNode;
    }
    $('.selected-type').innerHTML = element.innerHTML;
});

// 添加、编辑新条目的处理逻辑
$('#take-note').addEventListener('click', function () {
    let amount = $('#amount');
    let type = $('.selected-type').textContent.trim();
    let checkReg = /^\d+(\.\d{0,2})?$/;
    if (!checkReg.test(amount.value) || +amount.value === 0) {
        alert('请输入正确的金额数值！');
        amount.value = '';
        return;
    }
    let timestamp = window.location.hash.split('/')[1];
    Model.update(timestamp || +new Date(), {
        type,
        amount: type === '收入' ? (+amount.value).toFixed(2) : (-amount.value).toFixed(2)
    });
    amount.value = '';
    editForm.hide();
    window.location.hash = '';
});

// 导航菜单的展示逻辑
$('.nav').addEventListener('click', (function () {
    let flag = true;
    let menu = $('.menu');
    return function () {
        if (flag) {
            menu.style.height = '40px';
            this.className = 'iconfont icon-x nav';
        }
        else {
            menu.style.height = '0';
            this.className = 'iconfont icon-menu nav';
        }
        flag = !flag;
    };
})());
