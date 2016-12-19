/**
 * @file 核心业务逻辑
 * @author Leuis Ken <leuisken@gmail.com>
 */
import './asserts/styles/iconfont.css';
import './asserts/styles/index.less';
import Model from './model';

const $ = document.querySelector.bind(document);

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
    renderModal() {
        let timestamp = window.location.hash.split('/')[1];
        let data = Model.get()[timestamp] || { type: '收入', amount: '' };
        $('.selected-type').innerHTML = `
            <div class="icon ${typeDic[data.type]}">
                <i class="iconfont icon-${typeDic[data.type]}"></i>
            </div>
            ${data.type}
        `;
        $('#amount').value = Math.abs(data.amount);
    }
};

// 当数据变化时重新渲染账目列表
Model.onchange = function (data) {
    View.render(data);
};

let list = $('.account-list');
let modal = $('.modal');

// 账目列表及其子元素的click事件处理逻辑
list.addEventListener('click', function ({target}) {
    // 删除逻辑
    if (target.textContent === '删除') {
        if (confirm('您确定要删除这条记录吗？')) {
            let timestamp = target.parentNode.dataset.timestamp;
            Model.delete(timestamp);
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

// 点击“记一笔”按钮后修改路由，其他工作交给路由控制
$('.add-account').addEventListener('click', function ({target}) {
    window.location.hash = 'add';
});

// 路由处理函数，后面要单独分出来
window.addEventListener('hashchange', function () {
    if (/^#add/.test(window.location.hash)) {
        modal.style.visibility = 'visible';
        modal.style.opacity = 1;
        View.renderModal();
    }
    else {
        modal.style.opacity = 0;
    }
});

// 完善弹出层动画
modal.addEventListener('transitionend', function ({propertyName}) {
    if (propertyName === 'opacity' && this.style.opacity === '0') {
        this.style.visibility = 'hidden';
    }
});

// 关闭弹出层
$('.modal .close').addEventListener('click', function () {
    window.location.hash = '';
});

// 页面加载时出发hashchange时间，以保证路由与界面的对应
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

View.render(Model.get());
