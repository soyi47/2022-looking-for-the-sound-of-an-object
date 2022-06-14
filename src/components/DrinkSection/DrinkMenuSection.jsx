import React from "react";
import { ORDER_PROGRESS } from "../../constants";
import menus from "../../constants/menus";

function DrinkMenuSection({
  customerCharge,
  order,
  makeDrink,
  updateOrderStateToMaking,
  subtractCustomerCharge,
}) {
  const handleClickDrinkMenuButton = (e) => {
    updateOrderStateToMaking(e.target.name);
    makeDrink(e.target.name);
    subtractCustomerCharge(menus[e.target.name].price);
  };

  return (
    <section>
      <h3 className="sr-only">음료 주문 버튼 영역</h3>
      <div className="menu-area">
        {Object.keys(menus).map((menu) => (
          <button
            key={menu}
            name={menu}
            type="button"
            onClick={handleClickDrinkMenuButton}
            disabled={
              menus[menu].price > customerCharge.value ||
              order.progress !== ORDER_PROGRESS.PENDING
            }
          >
            {menus[menu].name}
            <br />
            {menus[menu].price.toLocaleString()}원
          </button>
        ))}
      </div>
    </section>
  );
}

export default DrinkMenuSection;
