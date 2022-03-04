<template>
  <div class="modal fade" id="sign-in-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5>登入</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form class="sign-form">
            <div class="sign-in">
              <div class="username">
                <label for="username">使用者名稱:</label>
                <input type="text" id="username" name="username" v-model="user.username">
              </div>
              <br><br>
              <div class="password">
                <label for="password">使用者密碼: </label>
                <input type="password" id="password" name="password" autocomplete="on" v-model="user.password">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button v-if="isFormValidate" type="button" class="modal-button" @click="signIn()">確認</button>
          <button v-else type="button" class="modal-button" disabled>確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import modalMixins from '@/mixins/modalMixins';

export default {
  mixins: [modalMixins],
  props: ['initMethod'],
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      isFormValidate: false,
    };
  },
  watch: {
    user: {
      handler() {
        this.isFormValidate = this.user.username !== '' && this.user.password !== '';
      },
      deep: true,
    },
  },
  methods: {
    setCookie(user) {
      const expireTime = (1 / 24 / 60) * 30;
      Cookies.set('tesla-trip-sign-in', JSON.stringify(user), { expires: expireTime });
    },
    signIn() {
      const url = `${process.env.VUE_APP_API}/sign-in`;
      this.$http.post(url, this.user)
        .then((res) => {
          if (res.status === 200) {
            this.hideModal();
            this.$dialog.alert({
              message: '登入成功',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => {
              this.setCookie(res.data.data);
              this.$parent.initAuth();
              if (this.initMethod) {
                this.initMethod();
              }
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
  },
};
</script>
