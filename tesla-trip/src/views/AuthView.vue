<template>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container" v-show="!isSignIn">
      <form v-if="isForgetPassword" class="forget-password-form">
        <div class="email column">
          <div class="input">
            <label class="input-label" for="forget-email">電子郵件:</label>
            <input type="text" id="forget-email" v-model="forgetPassword.email">
          </div>
          <div class="validate-label"
               :style="{visibility: forgetPasswordValidateMap.email ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="forgetPasswordMsg.email"
          >
            &#9432;
          </div>
        </div>
        <div class="button-group">
          <button class="default-button" @click="isRegistered=true;isForgetPassword=false">登入</button>
          <button v-if="isForgetPasswordFormValidated" class="default-button" @click="resetPassword">發送重設信</button>
          <button v-else class="default-button" disabled>發送重設信</button>
        </div>
      </form>
      <form v-else-if="isRegistered" class="sign-in-form">
        <div class="username column">
          <div class="input">
            <label class="input-label" for="sign-in-username">使用者名稱:</label>
            <input type="text" id="sign-in-username" v-model="signInUser.username">
          </div>
          <div class="validate-label"
               :style="{visibility: signInValidateMap.username ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signInValidateMsg.username"
          >
            &#9432;
          </div>
        </div>
        <div class="password column">
          <div class="input">
            <label class="input-label" for="sign-in-password">密碼:</label>
            <input type="password" id="sign-in-password" autocomplete="true"
                   v-model="signInUser.password">
          </div>
          <div class="validate-label"
               :style="{visibility: signInValidateMap.password ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signInValidateMsg.password"
          >
            &#9432;
          </div>
        </div>
        <div class="button-group">
          <button v-if="isSignInFormValidated" class="default-button" @click="signIn">登入</button>
          <button v-else class="default-button" disabled>登入</button>
          <button class="default-button" @click="isRegistered=false;isForgetPassword=false">註冊</button>
          <button class="default-button" @click="isRegistered=false;isForgetPassword=true">忘記密碼</button>
        </div>
      </form>
      <form v-else class="sign-up-form">
        <div class="username column">
          <div class="input">
            <label class="input-label" for="sign-up-username">使用者名稱:</label>
            <input type="text" id="sign-up-username" v-model="signUpUser.username">
          </div>
          <div class="validate-label"
               :style="{visibility: signUpValidateMap.username ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signUpValidateMsg.username"
          >
            &#9432;
          </div>
        </div>
        <div class="password column">
          <div class="input">
            <label class="input-label" for="sign-up-password">密碼:</label>
            <input type="password" id="sign-up-password" autocomplete="true"
                   v-model="signUpUser.password">
          </div>
          <div class="validate-label"
               :style="{visibility: signUpValidateMap.password ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signUpValidateMsg.password"
          >
            &#9432;
          </div>
        </div>
        <div class="confirm-password column">
          <div class="input">
          <label class="input-label" for="confirm-password">確認密碼:</label>
          <input type="password" id="confirm-password" autocomplete="true"
                 v-model="signUpUser.confirmPassword">
          </div>
          <div class="validate-label"
               :style="{visibility: signUpValidateMap.confirmPassword ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signUpValidateMsg.confirmPassword"
          >
            &#9432;
          </div>
        </div>
        <div class="nickname column">
          <div class="input">
            <label class="input-label" for="nickname">暱稱:</label>
            <input type="text" id="nickname" v-model="signUpUser.nickname">
          </div>
        </div>
        <div class="email column">
          <div class="input">
          <label class="input-label" for="sign-up-email">電子郵件:</label>
          <input type="text" id="sign-up-email" v-model="signUpUser.email">
          </div>
          <div class="validate-label"
               :style="{visibility: signUpValidateMap.email ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signUpValidateMsg.email"
          >
            &#9432;
          </div>
        </div>
        <div class="birthday column">
          <div class="input">
            <label class="input-label" for="birthday">生日:</label>
            <input type="date" id="birthday" v-model="signUpUser.birthday">
          </div>
        </div>
        <div class="sex column">
          <div class="input">
            <label class="input-label">性別:</label>
            <input class="input-radio" type="radio" name="sex" value="1" v-model="signUpUser.sex"/>
            <label class="radio-label">男</label>
            <input class="input-radio" type="radio" name="sex" value="2" v-model="signUpUser.sex"/>
            <label class="radio-label">女</label>
          </div>
        </div>
        <div class="button-group">
          <button class="default-button" @click="isRegistered=true;isForgetPassword=false">登入</button>
          <button v-if="isSignUpFormValidated" class="default-button" @click="signUp">註冊</button>
          <button v-else class="default-button" disabled>註冊</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import authMixins from '@/mixins/authMixins';
import { formatDate, initToolTip } from '@/utils/tools';
import { Pattern } from '@/assets/constant/constant';

export default {
  mixins: [authMixins],
  data() {
    return {
      isForgetPassword: false,
      isRegistered: true,
      signUpUser: {
        username: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        email: '',
        birthday: formatDate(new Date()),
        sex: '1',
      },
      signUpValidateMap: {
        username: false,
        password: false,
        confirmPassword: false,
        email: false,
      },
      signInUser: {
        username: '',
        password: '',
      },
      signInValidateMap: {
        username: false,
        password: false,
      },
      forgetPassword: {
        email: '',
      },
      forgetPasswordValidateMap: {
        email: false,
      },
      signInValidateMsg: {
        username: '請輸入使用者名稱',
        password: '請輸入密碼',
      },
      signUpValidateMsg: {
        username: '請輸入使用者名稱',
        password: '請輸入密碼',
        confirmPassword: '密碼不一致',
        email: '請輸入電子郵件',
      },
      forgetPasswordMsg: {
        email: '請輸入電子郵件',
      },
    };
  },
  watch: {
    'signInUser.username': function () {
      this.signInValidateMap.username = this.signInUser.username === '';
    },
    'signInUser.password': function () {
      this.signInValidateMap.password = this.signInUser.password === '';
    },
    'signUpUser.username': function () {
      this.signUpValidateMap.username = this.signUpUser.username === '';
    },
    'signUpUser.password': function () {
      this.signUpValidateMap.password = this.signUpUser.password === '';
      this.signUpValidateMap.confirmPassword = this.signUpUser.confirmPassword !== this.signUpUser.password;
    },
    'signUpUser.confirmPassword': function () {
      this.signUpValidateMap.confirmPassword = this.signUpUser.confirmPassword !== this.signUpUser.password;
    },
    'signUpUser.email': function () {
      if (this.signUpUser.email === '') {
        this.signUpValidateMsg.email = '請輸入電子郵件';
      } else if (!this.signUpUser.email.match(Pattern.EMAIL)) {
        this.signUpValidateMsg.email = '電子郵件格式不符';
      }
      this.signUpValidateMap.email = this.signUpUser.email === '' || !this.signUpUser.email.match(Pattern.EMAIL);
    },
    'forgetPassword.email': function () {
      if (this.forgetPassword.email === '') {
        this.forgetPasswordMsg.email = '請輸入電子郵件';
      } else if (!this.forgetPassword.email.match(Pattern.EMAIL)) {
        this.forgetPasswordMsg.email = '電子郵件格式不符';
      }
      this.forgetPasswordValidateMap.email = this.forgetPassword.email === '' || !this.forgetPassword.email.match(Pattern.EMAIL);
    },

  },
  computed: {
    isSignInFormValidated() {
      return !Object.values(this.signInValidateMap).includes(true) && !Object.values(this.signInUser).includes('');
    },
    isSignUpFormValidated() {
      return !Object.values(this.signUpValidateMap).includes(true) && !Object.values(this.signUpUser).includes('');
    },
    isForgetPasswordFormValidated() {
      return !Object.values(this.forgetPasswordValidateMap).includes(true) && !Object.values(this.forgetPassword).includes('');
    },
  },
  methods: {
    sendVerifyEmail() {
      const url = `${process.env.VUE_APP_API}/resend-verify`;
      const payload = {
        username: this.signInUser.username,
      };
      this.$http.post(url, payload).then((res) => {
        if (res.status === 200) {
          this.$dialog.alert({
            message: '請收取驗證信件以開通',
            confirmButtonText: '確認',
            confirmButtonColor: '#646566',
          }).then(() => {
            this.$router.push('/');
          });
        }
      }).catch((error) => {
        const response = error.response;
        console.log(response.data);
      });
    },
    signIn() {
      const url = `${process.env.VUE_APP_API}/sign-in`;
      this.$http.post(url, this.signInUser)
        .then((res) => {
          if (res.status === 200) {
            const user = res.data.data;
            if (user.is_verified) {
              this.$dialog.alert({
                message: '登入成功',
                confirmButtonText: '確認',
                confirmButtonColor: '#646566',
              }).then(() => {
                this.user = res.data.data;
                this.setUpAuth();
                this.$router.push('/');
              });
            } else {
              this.$dialog.alert({
                message: '尚未驗證 請進行email驗證',
                confirmButtonText: '發送驗證信',
                confirmButtonColor: '#646566',
              }).then(() => {
                this.sendVerifyEmail();
              });
            }
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            this.$dialog.alert({
              message: '登入失敗 請確認資訊',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => 0);
          }
        });
    },
    signUp() {
      const url = `${process.env.VUE_APP_API}/sign-up`;
      this.$http.post(url, this.signUpUser)
        .then((res) => {
          if (res.status === 200) {
            this.$dialog.alert({
              message: '註冊成功 請收取驗證信件以開通',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => {
              window.location.reload();
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            this.$dialog.alert({
              message: '註冊失敗 請確認使用者名稱及電子郵件是否重複',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => 0);
          }
        });
    },
    resetPassword() {
      const url = `${process.env.VUE_APP_API}/request-reset-password`;
      const payload = {
        email: this.forgetPassword.email,
      };
      this.$http.post(url, payload).then((res) => {
        if (res.status === 200) {
          this.$dialog.alert({
            message: '請收取驗證信件以重設密碼',
            confirmButtonText: '確認',
            confirmButtonColor: '#646566',
          }).then(() => {
            this.$router.push('/');
          });
        }
      }).catch((error) => {
        const response = error.response;
        console.log(response.data);
      });
    },
  },
  mounted() {
    if (this.isSignIn) {
      this.signOut();
    }
  },
  updated() {
    initToolTip();
  },
};
</script>
