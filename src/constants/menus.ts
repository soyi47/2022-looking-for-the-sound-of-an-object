const menus = {
  espresso: {
    name: "에스프레소",
    price: 1000,
    ingredients: ["에스프레소"],
  },
  americano: {
    name: "아메리카노",
    price: 2000,
    ingredients: ["에스프레소", "뜨거운 물"],
  },
  cafeLatte: {
    name: "카페라떼",
    price: 3000,
    ingredients: ["우유", "에스프레소"],
  },
  milk: {
    name: "우유",
    price: 1000,
    ingredients: ["우유"],
  },
  cola: {
    name: "콜라",
    price: 1500,
    ingredients: ["콜라"],
  },
  cider: {
    name: "사이다",
    price: 1400,
    ingredients: ["사이다"],
  },
} as const;

export default menus;