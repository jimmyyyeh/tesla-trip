<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';

export default {
  mixins: [authMixins, pageMixins],
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
