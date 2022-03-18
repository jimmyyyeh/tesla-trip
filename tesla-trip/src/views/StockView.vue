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
        <div class="create">
          <button class="image-button" @click="showProductModal(null)">
            <img
              src="https://i.imgur.com/rDkYs8J.png" alt="create"/>
          </button>
        </div>
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
              <button class="image-button" @click="showProductModal(product)">
                <img
                  src="https://i.imgur.com/WRvX8iL.png" alt="edit"/>
              </button>
            </td>
            <td>
              <button class="image-button" @click="confirmRemoveStock(product)">
                <img
                  src="https://i.imgur.com/ECKUIzz.png" alt="delete"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="stock-list-mobile">
        <div class="create">
          <button class="image-button" @click="showProductModal(null)">
            <img
              src="https://i.imgur.com/rDkYs8J.png" alt="create"/>
          </button>
        </div>
        <div class="stock" v-for="(product, index) in products" :key="index">
          <h6 class="header">{{ product.name }}</h6>
          <div class="stock-content">
            <ul class="content">
              <li>庫存數量: {{ product.stock }}</li>
              <li>點數: {{ product.point }}</li>
              <li>是否上架: {{ product.is_launched ? '是' : '否' }}</li>
            </ul>
            <div class="button-group">
              <button class="image-button" @click="showProductModal(product)">
                <img
                  src="https://i.imgur.com/WRvX8iL.png" alt="edit"/>
              </button>
              <button class="image-button" @click="confirmRemoveStock(product)">
                <img
                  src="https://i.imgur.com/ECKUIzz.png" alt="delete"/>
              </button>
            </div>
          </div>
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
    getProducts(page, isAppend) {
      let url = `${process.env.VUE_APP_API}/product?is_self=1`;
      if (page) {
        url = `${url}&page=${page}`;
      }
      this.isLoading = true;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            if (isAppend) {
              this.products = this.products.concat(res.data.data);
            } else {
              this.products = res.data.data;
            }
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
  mounted() {
    const stockListMobile = document.getElementsByClassName('stock-list-mobile')[0];
    let currentPage = 1;
    stockListMobile.addEventListener('scroll', () => {
      if (stockListMobile.offsetHeight + stockListMobile.scrollTop >= stockListMobile.scrollHeight) {
        if (currentPage < this.pager.pages) {
          currentPage += 1;
          this.getProducts(currentPage, true);
        }
      }
    });
  },
};
</script>
