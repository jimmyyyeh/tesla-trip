<template>
  <NavTab></NavTab>
  <div class="wrap">
    <form class="container" v-show="!isSignIn">
      <div v-if="isNewUser" class="sign-up-form">
        <div class="username column">
          <div class="input">
            <label class="input-label" for="sign-up-username">使用者名稱:</label>
            <input type="text" id="sign-up-username" v-model="signUpUser.username">
          </div>
          <div class="validate-label"
               :style="{visibility: signUpValidateMap.username ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="請輸入使用者名稱"
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
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="請輸入使用者密碼"
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
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="兩次密碼不符"
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
          <label class="input-label" for="email">電子郵件:</label>
          <input type="text" id="email" v-model="signUpUser.email">
          </div>
          <div class="validate-label"
               :style="{visibility: signUpValidateMap.email ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="請輸入電子郵件"
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
          <button class="default-button" @click="isNewUser=false">登入</button>
          <button v-if="isSignUpFormValidated" class="default-button" @click="signUp">註冊</button>
          <button v-else class="default-button" disabled>註冊</button>
        </div>
      </div>
      <form v-else class="sign-in-form">
        <div class="username column">
          <div class="input">
            <label class="input-label" for="sign-in-username">使用者名稱:</label>
            <input type="text" id="sign-in-username" v-model="signInUser.username">
          </div>
          <div class="validate-label"
               :style="{visibility: signInValidateMap.username ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="請輸入使用者名稱"
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
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="請輸入使用者密碼"
          >
            &#9432;
          </div>
        </div>
        <div class="button-group">
          <button v-if="isSignInFormValidated" class="default-button" @click="signIn">登入</button>
          <button v-else class="default-button" disabled>登入</button>
          <button class="default-button" @click="isNewUser=true">註冊</button>
        </div>
      </form>
    </form>
  </div>
</template>
<script>
import authMixins from '@/mixins/authMixins';
import { formatDate, initToolTip } from '@/utils/tools';

export default {
  mixins: [authMixins],
  data() {
    return {
      test: true,
      isNewUser: false,
      signUpUser: {
        username: null,
        password: null,
        confirmPassword: null,
        nickname: null,
        email: null,
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
        username: null,
        password: null,
      },
      signInValidateMap: {
        username: false,
        password: false,
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
      this.signUpValidateMap.email = this.signUpUser.email === '';
    },

  },
  computed: {
    isSignInFormValidated() {
      return this.signInUser.username && this.signInUser.password;
    },
    isSignUpFormValidated() {
      return this.signUpUser.username && this.signUpUser.password && this.signUpUser.email && !this.signUpValidateMap.confirmPassword;
    },
  },
  methods: {
    signIn() {
      const url = `${process.env.VUE_APP_API}/sign-in`;
      this.$http.post(url, this.signInUser)
        .then((res) => {
          if (res.status === 200) {
            this.$dialog.alert({
              message: '登入成功',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => {
              this.user = res.data.data;
              this.setUpAuth();
              this.$router.push('/');
            });
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
              message: '註冊成功 請重新登入',
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
              message: '註冊失敗 請確認資訊',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => 0);
          }
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
