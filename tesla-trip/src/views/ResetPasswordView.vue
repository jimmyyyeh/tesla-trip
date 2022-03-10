<template>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container">
      <div class="reset-password-form">
        <div class="username column">
          <div class="input">
            <label class="input-label" for="sign-up-username">使用者名稱:</label>
            <input type="text" id="sign-up-username" v-model="resetUser.username">
          </div>
          <div class="validate-label"
               :style="{visibility: validateMap.username ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="validateMsg.username"
          >
            &#9432;
          </div>
        </div>
        <div class="password column">
          <div class="input">
            <label class="input-label" for="sign-up-password">密碼:</label>
            <input type="password" id="sign-up-password" autocomplete="true"
                   v-model="resetUser.password">
          </div>
          <div class="validate-label"
               :style="{visibility: validateMap.password ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="validateMsg.password"
          >
            &#9432;
          </div>
        </div>
        <div class="confirm-password column">
          <div class="input">
            <label class="input-label" for="confirm-password">確認密碼:</label>
            <input type="password" id="confirm-password" autocomplete="true"
                   v-model="resetUser.confirmPassword">
          </div>
          <div class="validate-label"
               :style="{visibility: validateMap.confirmPassword ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="validateMsg.confirmPassword"
          >
            &#9432;
          </div>
        </div>
        <div class="button-group">
          <button v-if="isResetPasswordFormValidated" class="default-button" @click="resetPassword">重設密碼</button>
          <button v-else class="default-button" disabled>發送重設信</button>
        </div>
      </div>
    </div>
  </div>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';
import { initToolTip } from '@/utils/tools';

export default {
  mixins: [authMixins, pageMixins],
  data() {
    return {
      resetUser: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      validateMap: {
        username: false,
        password: false,
        confirmPassword: false,
      },
      validateMsg: {
        username: '請輸入使用者名稱',
        password: '請輸入密碼',
        confirmPassword: '兩次密碼不一致',
      },
    };
  },
  watch: {
    'resetUser.username': function () {
      this.validateMap.username = this.resetUser.username === '';
    },
    'resetUser.password': function () {
      this.validateMap.password = this.resetUser.password === '';
      this.validateMap.confirmPassword = this.resetUser.confirmPassword !== this.resetUser.password;
    },
    'resetUser.confirmPassword': function () {
      this.validateMap.confirmPassword = this.resetUser.confirmPassword !== this.resetUser.password;
    },
  },
  computed: {
    isResetPasswordFormValidated() {
      return !Object.values(this.validateMap).includes(true) && !Object.values(this.resetUser).includes('');
    },
  },
  methods: {
    returnAuth() {
      this.$router.push('/auth');
    },
    resetPassword() {
      const url = `${process.env.VUE_APP_API}/reset-password`;
      const payload = {
        username: this.resetUser.username,
        password: this.resetUser.password,
        token: this.$route.params.token,
      };
      this.$http.post(url, payload).then((res) => {
        if (res.status === 200) {
          const refs = this.$refs;
          this.alert.title = null;
          this.alert.message = '重設密碼成功 請使用新密碼登入';
          this.alert.confirmFunction = this.returnAuth;
          refs.alertModal.showModal();
        }
      }).catch((error) => {
        const response = error.response;
        console.log(response.data);
        const refs = this.$refs;
        this.alert.title = null;
        this.alert.message = '重設密碼錯誤 請重新操作';
        this.alert.confirmFunction = this.returnAuth;
        refs.alertModal.showModal();
      });
    },
  },
  updated() {
    initToolTip();
  },
};

</script>
