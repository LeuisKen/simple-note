/**
 * @file 核心业务逻辑
 * @author Leuis Ken <leuisken@gmail.com>
 */
import './asserts/styles/iconfont.css';
import './asserts/styles/index.less';
import Model from './model';

const $ = document.querySelector.bind(document);

const typeDic = {
    '收入': 'income',
    '衣服': 'clothing',
    '饮食': 'diet',
    '住宿': 'hotel',
    '交通': 'transportation',
    '购物': 'shop',
    '其他': 'other'
};

const View = {
    render(data) {
        let frag = document.createDocumentFragment();
        let list = $('.account-list');
        Object.keys(data).forEach(el => {
            let item = document.createElement('li');
            let date = new Date(+el);
            let type = typeDic[data[el].type];
            item.className = 'account-list-item clearfix';
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
    renderModal() {
        let timestamp = window.location.hash.split('/')[1];
        let data = Model.get()[timestamp] || { type: '收入', amount: '' }
        $('.selected-type').innerHTML = `
            <div class="icon ${typeDic[data.type]}">
                <i class="iconfont icon-${typeDic[data.type]}"></i>
            </div>
            ${data.type}
        `
        $('#amount').value = Math.abs(data.amount)
    }
};

Model.onchange = function (data) {
    View.render(data);
};

let list = $('.account-list');
let addBtn = $('.add-account');
let modal = $('.modal');
let modalClose = $('.modal .close');

list.addEventListener('click', function ({target}) {
    if (target.textContent === '删除') {
        if (confirm('您确定要删除这条记录吗？')) {
            let timestamp = target.parentNode.dataset.timestamp;
            Model.delete(timestamp);
        }
    }
    else if (target.textContent === '编辑') {
        window.location.hash = `#add/${target.parentNode.dataset.timestamp}`
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

addBtn.addEventListener('click', function ({target}) {
    window.location.hash = 'add';
});

window.addEventListener('hashchange', function () {
    if (/^#add/.test(window.location.hash)) {
        modal.style.visibility = 'visible';
        modal.style.opacity = 1;
        View.renderModal()
    }
    else {
        modal.style.opacity = 0;
    }
});

modal.addEventListener('transitionend', function ({propertyName}) {
    if (propertyName === 'opacity' && this.style.opacity === '0') {
        this.style.visibility = 'hidden';
    }
});

modalClose.addEventListener('click', function () {
    window.location.hash = '';
});

window.addEventListener('load', function () {
    window.dispatchEvent(new Event('hashchange'));
});

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
