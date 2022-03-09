<template>
  <NavTab></NavTab>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';

export default {
  data() {
    return {
      alert: {
        title: '',
        message: '',
        isCancelShow: false,
        confirmFunction: (() => {}),
      },
    };
  },
  mixins: [authMixins],
  methods: {
    returnAuth() {
      this.$router.push('/auth');
    },
    verify() {
      const url = `${process.env.VUE_APP_API}/verify`;
      const payload = {
        token: this.$route.params.token,
      };
      this.$http.post(url, payload).then((res) => {
        if (res.status === 200) {
          const refs = this.$refs;
          this.alert.title = null;
          this.alert.message = '驗證成功 請重新登入';
          this.alert.confirmFunction = this.returnAuth;
          refs.alertModal.showModal();
        }
      }).catch((error) => {
        const response = error.response;
        console.log(response.data);
        const refs = this.$refs;
        this.alert.title = null;
        this.alert.message = '驗證失敗 請重新註冊';
        this.alert.confirmFunction = this.returnAuth;
        refs.alertModal.showModal();
      });
    },
  },
  created() {
    this.verify();
  },
};

</script>
