<template>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';

export default {
  mixins: [authMixins, pageMixins],
  data() {
    return {
      token: this.$route.params.token,
      product: {},
    };
  },
  methods: {
    returnProduct() {
      this.$router.push('product');
    },
    redeemProduct() {
      const url = `${process.env.VUE_APP_API}/redeem-product/${this.token}`;
      this.$http.post(url, {}, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '兌換商品成功';
            this.alert.isCancelShow = false;
            this.alert.confirmFunction = this.returnProduct;
            refs.confirmModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '兌換商品失敗 請確認點數餘額';
            this.alert.isCancelShow = false;
            this.alert.confirmFunction = this.returnProduct;
            refs.confirmModal.showModal();
          }
        });
    },
    getProduct() {
      const url = `${process.env.VUE_APP_API}/qrcode/product/${this.token}?page=1&per_page=100000000000000`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.product = res.data.data;
            const refs = this.$refs;
            this.alert.title = '兌換商品';
            this.alert.message = `確定要用 ${this.product.point}點 兌換 ${this.product.name} 嗎?`;
            this.alert.isCancelShow = true;
            this.alert.confirmFunction = this.redeemProduct;
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '發生錯誤 請重新兌換';
            this.alert.isCancelShow = false;
            this.alert.confirmFunction = this.returnProduct;
            refs.confirmModal.showModal();
          }
        });
    },
    initData() {
      this.getProduct();
    },
  },
};

</script>
