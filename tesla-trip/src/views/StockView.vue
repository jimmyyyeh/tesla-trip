<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png"
           data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="overlay" v-show="isLoading">
      <div class="spinner-grow"></div>
    </div>
    <div class="container" v-show="!isLoading">
      <div class="stock-list">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">名稱</th>
            <th scope="col">庫存數量</th>
            <th scope="col">點數</th>
            <th scope="col">是否上架</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <label>{{ product.name }}</label>
            </td>
            <td>
              <label>{{ product.stock }}</label>
            </td>
            <td>
              <label>{{ product.point }}</label>
            </td>
            <td>
              <label>{{ product.is_launched ? '是' : '否' }}</label>
            </td>
            <td>
              <button class="default-button" @click="showProductModal(product)">編輯</button>
            </td>
            <td>
              <button class="default-button" @click="confirmRemoveStock(product)">刪除</button>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="create">
          <input type="image" src="https://i.imgur.com/xx2RMXq.png" alt="create" @click="showProductModal(null)">
        </div>
      </div>
      <PaginateComponent :refresh-method="getProducts" :pager="pager"
                         v-show="isSignIn"></PaginateComponent>
    </div>
  </div>
  <StockModal ref="stockModal" :originProduct="product"></StockModal>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';
import StockModal from '@/components/StockModal.vue';
import PaginateComponent from '@/components/PaginateComponent.vue';

export default {
  mixins: [authMixins, pageMixins],
  components: {
    StockModal,
    PaginateComponent,
  },
  data() {
    return {
      isLoading: false,
      product: {},
      products: [],
      pager: {
        page: 1,
        per_page: 10,
        pages: 1,
        total: 1,
      },
    };
  },
  methods: {
    getProducts(page) {
      let url = `${process.env.VUE_APP_API}/product?is_self=1`;
      if (page) {
        url = `${url}&page=${page}`;
      }
      this.isLoading = true;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.products = res.data.data;
            this.pager = res.data.pager;
            this.isLoading = false;
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    showProductModal(product) {
      this.product = product;
      const refs = this.$refs;
      refs.stockModal.showModal();
    },
    removeProduct() {
      const url = `${process.env.VUE_APP_API}/product/${this.product.id}`;
      this.$http.delete(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '產品已刪除';
            this.alert.confirmFunction = this.getProducts;
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    confirmRemoveStock(product) {
      this.product = product;
      const refs = this.$refs;
      this.alert.title = '確認刪除';
      this.alert.message = '確定要刪除商品嗎?';
      this.alert.isCancelShow = true;
      this.alert.confirmFunction = this.removeProduct;
      refs.confirmModal.showModal();
    },
    initData() {
      this.getProducts();
    },
  },
};
</script>
