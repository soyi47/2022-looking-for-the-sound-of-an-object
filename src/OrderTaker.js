import { $, $$ } from './util/index.js';
import menus from './constant/menus.js';
import { ORDER_PROGRESS } from './constant/index.js';

export default class OrderTaker {
  constructor({customerCharge, order}) {
    this.initDOM();
    this.customerCharge = customerCharge;
    this.order = order;
    
    this.customerCharge.addSubscriber(this.updateOnCustomerChargeChange);
    this.order.addSubscriber(this.updateOnOrderChange);

    this.$menuButtonArea.addEventListener('click', this.onClickMenuArea);
    this.$beveragePickUpButton.addEventListener('click', this.onClickBeveragePickUpButton);
  }

  initDOM() {
    this.$menuButtonArea = $('#menu-button-area');
    this.$$menuButtons;
    this.$beveragePickUpButton = $('#beverage-pick-up-button');
    this.$returnedChangeText = $('#returned-change-text');
    this.initMenuButtons();
  }

  initMenuButtons() {
    this.$menuButtonArea.insertAdjacentHTML('afterbegin', Object.keys(menus).map((menu) => `
      <button name="${menu}" type="button" disabled>${menus[menu].name}<br >${menus[menu].price.toLocaleString()}원</button>
    `).join(''));
    this.$$menuButtons = $$('button', this.$menuButtonArea);
    this.setAllMenuButtonDisable();
  }

  updateOnCustomerChargeChange = ({returnedChangeValue}) => {
    if (this.order.progress === ORDER_PROGRESS.PENDING) {
      this.setPurchaseAvailableButtonActive();
    }
    if (this.order.progress === ORDER_PROGRESS.MAKING) {
      this.$returnedChangeText.textContent = returnedChangeValue;
    }
  }

  updateOnOrderChange = ({progress}) => {
    switch (progress) {
    case ORDER_PROGRESS.PENDING:
      this.updateOnOrderPending()
      break;
    case ORDER_PROGRESS.MAKING:
      this.updateOnOrderMaking();
      break;
    case ORDER_PROGRESS.COMPLETE:
      this.updateOnOrderComplete();
      break;
    default:
    }
  }

  updateOnOrderPending = () => {
    this.setPurchaseAvailableButtonActive();
    this.$returnedChangeText.textContent = 0;
    this.$beveragePickUpButton.setAttribute("disabled", "");
  }

  updateOnOrderMaking = () => {
    this.setAllMenuButtonDisable();
  }

  updateOnOrderComplete = () => {
    this.$beveragePickUpButton.removeAttribute("disabled");
  }
    
  onClickMenuArea = (event) => {
    if (event.target.tagName !== 'BUTTON') return;
    if (this.order.progress !== ORDER_PROGRESS.PENDING) return;

    this.customerCharge.subtractCustomerCharge(menus[event.target.name].price);
    this.order.updateOrderStateToMaking(event.target.name);
    this.customerCharge.returnLeftCustomerCharge();
  }
  
  onClickBeveragePickUpButton = () => {
    if (this.order.progress !== ORDER_PROGRESS.COMPLETE) return;

    this.order.updateOrderStateToPending();
  }

  setAllMenuButtonDisable() {
    this.$$menuButtons.forEach((menuButton) => {
      menuButton.setAttribute("disabled", "");
    })
  }

  setAllMenuButtonActive() {
    this.$$menuButtons.forEach((menuButton) => {
      menuButton.removeAttribute("disabled");
    })
  }

  setPurchaseAvailableButtonActive() {
    Array.from(this.$$menuButtons).filter((menuButton) => {
      const { price } = menus[menuButton.name];
      return price <= this.customerCharge.value;
    }).forEach((menuButton) => {
      menuButton.removeAttribute("disabled");
    })
  }

}
