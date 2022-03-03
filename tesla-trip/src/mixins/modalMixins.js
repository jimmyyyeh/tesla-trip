import Modal from 'bootstrap/js/dist/modal';

export default {
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
    clearInput(objKey) {
      const newObj = {};
      Object.entries(this[objKey]).forEach(([k, v]) => {
        if (v !== '') {
          newObj[k] = '';
        }
      });
      this[objKey] = newObj;
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
  },
};
