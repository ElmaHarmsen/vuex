<template>
  <div>
    <h1>Product List</h1>
    <img v-if="loading" src="../assets/Clock-Loading.gif" alt="">
    <ul v-else>
      <li v-for="product in theProducts" v-bind:key="product.id">
        {{product.title}} - {{product.price | currency}} - {{product.inventory}}
        <button @click="addThisProductToCart(product)">Add to cart</button>
      </li>
      <!--v-bind:key is necessary when you have a linter-->
    </ul>
  </div>
</template>

<script>
export default {
  //no data because the state from the store is global, so no local data is necessary
  data() {
    return {
      loading: false
    }
  },
  computed: {
    theProducts() {
      //this => points to Vue
      //$store => global access to store
      return this.$store.getters.availableProducts;
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch("fetchProducts")
    //dispatch => triggers an action
      .then(() => this.loading = false)
  },
  methods: {
    addThisProductToCart(product) {
      this.$store.dispatch("addProductToCart", product)
    }
  }
}
</script>

<style lang="css">

</style>