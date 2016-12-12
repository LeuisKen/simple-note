import './asserts/index.less'
import Model from './model'

const $ = document.querySelector.bind(document)

const View = {
  render(data) {
    let frag = document.createDocumentFragment(),
        list = $('.account-list')
    Object.keys(data).forEach(el => {
      let item = document.createElement('li'),
          date = new Date(+el)
      item.className = 'account-list-item'
      item.innerHTML = `
        <span>${data[el].type}</span>
        <span class="timestamp">${date.getFullYear() % 100}/${date.getMonth() + 1}/${date.getDate()}</span>
        <span class="amount ${data[el].amount.toString()[0] !== '-' ? 'income' : 'cost'}">${data[el].amount}</span>
        <button>删除</button>
      `
      frag.appendChild(item)
    })
    list.innerHTML = ''
    list.appendChild(frag)
  }
}

Model.onchange = function(data) {
  View.render(data)
}

let takeNoteBth = $('#take-note'),
    amount = $('#amount'),
    list = $('.account-list'),
    addBtn = $('.add-account')

takeNoteBth.addEventListener('click', function(e) {
  let type = $('#type').value

  Model.update(+new Date, {
    type,
    amount: type === '收入' ? +amount.value : -amount.value
  })
  amount.value = ''
})

amount.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    takeNoteBth.click()
  }
})

list.addEventListener('click', function({ target }) {
  if (target.textContent === '删除') {
    let timestamp = target.parentNode.querySelector('.timestamp').textContent
    Model.delete(timestamp)
  }
})

list.addEventListener('touchstart', function({ target }) {
  let element = target
  while (element.nodeName !== 'LI' || element.className !== 'account-list-item') {
    if (element === this) {
      return
    }
    element = element.parentNode
  }
  console.log(element)
})

addBtn.addEventListener('touchstart', function({ target }) {
  console.log(1)
})

View.render(Model.get())
