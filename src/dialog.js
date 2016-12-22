/**
 * @file 弹出层逻辑封装
 * @author Leuis Ken <leuisken@gmail.com>
 */

export default class Dialog {
    constructor(element) {
        this.element = element;
        element.addEventListener('transitionend', function ({propertyName}) {
            if (propertyName === 'opacity' && this.style.opacity === '0') {
                this.style.visibility = 'hidden';
            }
        });
    }
    show() {
        let element = this.element;
        element.style.visibility = 'visible';
        element.style.opacity = 1;
    }
    hide() {
        this.element.style.opacity = 0;
    }
}
