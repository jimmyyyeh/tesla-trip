<template>
  <div class="modal fade" id="stock-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h6>{{originProduct? '編輯庫存' : '新增產品'}}</h6>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="stock-form">
            <div class="name input">
              <label>名稱:</label>
              <input type="text" v-model="product.name">
            </div>
            <div class="stock input">
              <label>數量:</label>
              <input type="number" v-model="product.stock">
            </div>
            <div class="point input">
              <label>點數:</label>
              <input type="number" v-model="product.point">
            </div>
            <div class="launched input">
              <label>是否發行:</label>
              <input type="checkbox" v-model="product.is_launched">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="default-button" v-if="originProduct" @click="updateStock">更新</button>
          <button class="default-button" v-else @click="createProduct">新增</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixins from '@/mixins/modalMixins';

export default {
  mixins: [modalMixins],
  props: ['originProduct'],
  watch: {
    originProduct: {
      handler() {
        this.product = { ...this.originProduct };
      },
      deep: true,
    },
  },
  data() {
    return {
      product: {},
    };
  },
  methods: {
    createProduct() {
      const url = `${process.env.VUE_APP_API}/product`;
      const payload = {
        name: this.product.name,
        stock: this.product.stock,
        point: this.product.point,
        is_launched: this.product.is_launched,
      };
      this.$http.post(url, payload, this.$parent.config)
        .then((res) => {
          if (res.status === 200) {
            this.hideModal();
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '新增成功';
            this.$parent.alert.confirmFunction = this.$parent.getProducts();
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '新增產品失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
    updateStock() {
      const url = `${process.env.VUE_APP_API}/product/${this.product.id}`;
      const payload = {
        name: this.product.name,
        stock: this.product.stock,
        point: this.product.point,
        is_launched: this.product.is_launched,
      };
      this.$http.put(url, payload, this.$parent.config)
        .then((res) => {
          if (res.status === 200) {
            this.hideModal();
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '更新成功';
            this.$parent.alert.confirmFunction = this.$parent.getProducts();
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '更新產品失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
  },
};
</script>
