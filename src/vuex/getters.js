export default {
  totalCount (state) {
    return state.cartFoods.reduce((preTotalCount, food) => preTotalCount + food.count, 0)
  },
  totalPrice (state) {
    return state.cartFoods.reduce((preTotalCount, food) => preTotalCount + food.count * food.price, 0)
  }
}
