<template>
  <NavTab></NavTab>
</template>

<script>
import authMixins from '@/mixins/authMixins';

export default {
  mixins: [authMixins],
  methods: {
    verify() {
      const url = `${process.env.VUE_APP_API}/verify`;
      const payload = {
        token: this.$route.params.token,
      };
      this.$http.post(url, payload).then((res) => {
        if (res.status === 200) {
          this.$dialog.alert({
            message: '驗證成功 請重新登入',
            confirmButtonText: '確認',
            confirmButtonColor: '#646566',
          }).then(() => {
            this.$router.push('/auth');
          });
        }
      }).catch((error) => {
        const response = error.response;
        console.log(response.data);
        this.$dialog.alert({
          message: '驗證失敗 請重新註冊',
          confirmButtonText: '確認',
          confirmButtonColor: '#646566',
        }).then(() => {
          this.$router.push('/auth');
        });
      });
    },
  },
  created() {
    this.verify();
  },
};

</script>
