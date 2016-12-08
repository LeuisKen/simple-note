import './asserts/index.css'
import Model from './model'

const $ = document.querySelector.bind(document)

const View = {
  render(data) {
    let frag = document.createDocumentFragment(),
        list = $('.account-list')
    Object.keys(data).forEach(el => {
      let item = document.createElement('li')
      item.innerHTML = `
        <span>${data[el].type}</span>
        <span class="timestamp">${el}</span>
        ${data[el].amount}
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
    list = $('.account-list')

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

View.render(Model.get())
