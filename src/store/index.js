import Vue from "vue";
import Vuex from "vuex";
import shop from "@/api/shop";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
    //{id, quantity}
    cart: []
  }, // = data
  mutations: {
    setProducts(state, products) {
      //update piece of the state => products
      state.products = products
    },
    //const cartItem = {id: 1, quantity: 3}
    //pushProductToCart(state, cartItem) {
      //here payload => the whole cartItem
      //state.cart.push(cartItem)
    //}
    pushProductToCart(state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1
      })
    },
    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++
    },
    decrementProductInventory(state, product) {
      product.inventory--
    }
  }, // = set and update state
  getters: {
    availableProducts(state) {
      return state.products.filter(product => product.inventory > 0)
    }, //the computed property is a dependency of this getter => it is related to this getter and gets updated
    cartProducts(state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },
    cartTotal(state, getters) {
      // let total = 0;
      // getters.cartProducts.forEach(product => {
      //   total += product.price * product.quantity;
      // });
      // return total;
      return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    }
  }, // = computed properties (example usage = filter/calculation)
  actions: {
    //logic => *when* a mutation should be fired
    fetchProducts({commit}) {
      //{commit} object = ES6 argument desctructuring => you destructure from the object only the commit, or more
      return new Promise((resolve) => {
        //make the call
        //run setProducts mutation
        shop.getProducts(products => {
          //payload = products, it's the goods on the transport train that needs to be in the state
          //here you commit a mutation that updates the state
          commit("setProducts", products)
          //context = store
          resolve()
        })
      }) 
    },
    addProductToCart(context, product) {
      if (product.inventory > 0) {
        //find cart item, check if this is equal to the payload coming along in this action (product)
        const cartItem = context.state.cart.find(item => item.id === product.id)
        if (!cartItem) {
          //we add the cartItem to the cart
          context.commit("pushProductToCart", product.id)
        }
        else {
          //increase the quantity of the cartItem in the cart
          context.commit("incrementItemQuantity", cartItem)
        }
        //reduce products' inventory by 1
        context.commit("decrementProductInventory", product)
      }
    }
  },// = methods
  modules: {}
});
