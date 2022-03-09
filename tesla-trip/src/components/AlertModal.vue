<template>
  <div class="modal fade" id="alert-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header" v-if="title">
          <h6>{{ title }}</h6>
        </div>
        <div class="modal-body">
          <label> {{ message }} </label>
        </div>
        <div class="modal-footer">
          <div class="button-group">
            <button class="default-button" @click="cancel" v-show="isCancelShow"> {{ cancelText }} </button>
            <button class="default-button" @click="confirm"> {{ confirmText }} </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixins from '@/mixins/modalMixins';

export default {
  mixins: [modalMixins],
  props: {
    title: String,
    message: String,
    confirmFunction: {
      type: Function,
      default: (() => {}),
    },
    cancelFunction: {
      type: Function,
      default: (() => {}),
    },
    confirmText: {
      type: String,
      default: '確認',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    isCancelShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    confirm() {
      this.confirmFunction();
      this.hideModal();
    },
    cancel() {
      this.cancelFunction();
      this.hideModal();
    },
  },
};
</script>
