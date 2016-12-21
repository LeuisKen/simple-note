/**
 * @file 弹出层逻辑封装
 * @author Leuis Ken <leuisken@gmail.com>
 */

class Dialog {
    constructor(element) {
        this.element = element
        element.addEventListener('transitionend', function ({propertyName}) {
            if (propertyName === 'opacity' && this.style.opacity === '0') {
                this.style.visibility = 'hidden';
            }
        });
    }
    show() {
        let { element } = this
        element.style.visibility = 'visible';
        element.style.opacity = 1;
    }
    hide() {
        let { element } = this
        element.style.opacity = 0;
    }
}

export default Dialog;
