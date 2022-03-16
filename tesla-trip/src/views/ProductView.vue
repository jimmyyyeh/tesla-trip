<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container">
      <div class="product-form">
        <div class="product-selector selector">
          <label class="selector-label" for="products">產品:</label>
          <select name="products" id="products" v-model="productIndex">
            <option v-for="(product, index) in products" :key="index" :value="index">{{
                product
              }}
            </option>
          </select>
        </div>
        <div class="qrcode" v-show="image">
          <img :src="'data:image/jpeg;base64,'+ image" alt="qrcode">
        </div>
      </div>
    </div>
  </div>
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

export default {
  mixins: [authMixins, pageMixins],
  data() {
    return {
      params: {},
      image: null,
      productIndex: 0,
      product: '請選擇',
      products: ['請選擇'],
      productMap: {},
    };
  },
  watch: {
    productIndex(value) {
      if (value !== 0) {
        const productID = this.productMap[value - 1];
        this.getQrCode(productID);
      } else {
        this.image = null;
      }
    },
  },
  methods: {
    getQrCode(productID) {
      const url = `${process.env.VUE_APP_API}/qrcode/product`;
      const payload = {
        product_id: productID,
      };
      this.$http.post(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.image = res.data.data.image;
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    getProducts() {
      const url = `${process.env.VUE_APP_API}/product`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            this.products = ['請選擇'];
            this.productMap = {};
            dataList.forEach((data, index) => {
              this.products.push(`${data.name} / ${data.point}點`);
              this.productMap[index] = data.id;
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    initData() {
      this.getProducts();
    },
  },
  created() {

  },
};

</script>
