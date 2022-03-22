<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container">
      <div class="product-form">
        <div class="selector-group">
          <div class="charger-selector selector">
            <label class="selector-label" for="chargers">充電站:</label>
            <select name="chargers" id="chargers" v-model="chargerIndex">
              <option v-for="(charger, index) in chargers" :key="index" :value="index">{{
                  charger
                }}
              </option>
            </select>
          </div>
          <div class="product-selector selector">
          <label class="selector-label" for="products">產品:</label>
          <select name="products" id="products" v-model="productIndex">
            <option v-for="(product, index) in products" :key="index" :value="index">{{
                product
              }}
            </option>
          </select>
        </div>
        </div>
        <div class="overlay" v-show="isLoading">
          <div class="spinner-grow"></div>
        </div>
        <div class="qrcode" v-show="!isLoading && image">
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
      isLoading: false,
      params: {},
      image: null,
      productIndex: 0,
      product: '請選擇',
      products: ['請選擇'],
      productMap: {},
      chargerIndex: 0,
      charger: '請選擇',
      chargers: ['請選擇'],
      chargerMap: {},
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
    chargerIndex(value) {
      if (value !== 0) {
        const chargerID = this.chargerMap[value - 1];
        this.getProducts(chargerID);
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
    getProducts(chargerID) {
      const url = `${process.env.VUE_APP_API}/product?charger_id=${chargerID}`;
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
    getChargers() {
      const url = `${process.env.VUE_APP_API}/super-charger`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            dataList.forEach((data, index) => {
              this.chargers.push(`${data.city}-${data.name}`);
              this.chargerMap[index] = data.id;
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
      this.getChargers();
    },
  },
};

</script>
