<template>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container" v-show="!isSignIn">
      <div v-if="isNewUser" class="sign-up-form">
        <div class="username column">
          <label class="input-label" for="sign-up-username">使用者名稱:</label>
          <input type="text" id="sign-up-username" v-model="signUpUser.username">
          <label class="validate-label" v-show="!signUpValidateMap.username">請輸入使用者名稱</label>
        </div>
        <div class="password column">
          <label class="input-label" for="sign-up-password">密碼:</label>
          <input type="password" id="sign-up-password" v-model="signUpUser.password">
          <label class="validate-label" v-show="!signUpValidateMap.password">請輸入密碼</label>
        </div>
        <div class="confirm-password column">
          <label class="input-label" for="confirm-password">確認密碼:</label>
          <input type="password" id="confirm-password" v-model="signUpUser.confirmPassword">
          <label class="validate-label" v-show="!signUpValidateMap.confirmPassword">兩次密碼不符</label>
        </div>
        <div class="nickname column">
          <label class="input-label" for="nickname">暱稱:</label>
          <input type="text" id="nickname" v-model="signUpUser.nickname">
        </div>
        <div class="email column">
          <label class="input-label" for="email">電子郵件:</label>
          <input type="text" id="email" v-model="signUpUser.email">
          <label class="validate-label" v-show="!signUpValidateMap.email">請輸入電子郵件</label>
        </div>
        <div class="age column">
          <label class="input-label" for="age">年齡:</label>
          <input type="number" id="age" v-model="signUpUser.age">
          <label class="validate-label" v-show="!signUpValidateMap.age">請輸入年齡</label>
        </div>
        <div class="sex column">
          <label class="input-label">性別:</label>
          <div>
            <input type="radio" name="sex" value="1" v-model="signUpUser.sex"/>
            <label class="radio-label">男</label>
            <input type="radio" name="sex" value="2" v-model="signUpUser.sex"/>
            <label class="radio-label">女</label>
          </div>
        </div>
        <div class="button-group">
          <button v-if="isNewUserValidate" class="default-button" @click="signUp">註冊</button>
          <button v-else class="default-button" disabled>註冊</button>
        </div>
      </div>
      <div v-else class="sign-in-form">
        <div class="username column">
          <label class="input-label" for="sign-in-username">使用者名稱:</label>
          <input type="text" id="sign-in-username" v-model="signInUser.username">
          <label class="validate-label" v-show="!signUpValidateMap.username">請輸入使用者名稱</label>
        </div>
        <div class="password column">
          <label class="input-label" for="sign-in-password">密碼:</label>
          <input type="password" id="sign-in-password" v-model="signInUser.password">
          <label class="validate-label" v-show="!signUpValidateMap.password">請輸入密碼</label>
        </div>
        <div class="button-group">
          <button v-if="isSignInValidate" class="default-button" @click="signIn">登入</button>
          <button v-else class="default-button" disabled>登入</button>
          <button class="default-button" @click="isNewUser=true">註冊</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import authMixins from '@/mixins/authMixins';

export default {
  mixins: [authMixins],
  data() {
    return {
      isNewUser: false,
      signUpUser: {
        username: null,
        password: null,
        confirmPassword: null,
        nickname: null,
        email: null,
        age: null,
        sex: '1',
      },
      signUpValidateMap: {
        username: false,
        password: false,
        confirmPassword: true,
        email: false,
        age: false,
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
  computed: {
    isNewUserValidate() {
      return !Object.values(this.signUpValidateMap).includes(false);
    },
    isSignInValidate() {
      return !Object.values(this.signInValidateMap).includes(false);
    },
  },
  watch: {
    signUpUser: {
      handler() {
        this.signUpValidateMap.username = this.signUpUser.username !== null;
        this.signUpValidateMap.password = this.signUpUser.password !== null;
        this.signUpValidateMap.confirmPassword = this.signUpUser.password === this.signUpUser.confirmPassword;
        this.signUpValidateMap.email = this.signUpUser.email !== null;
        this.signUpValidateMap.age = this.signUpUser.age !== null;
      },
      deep: true,
    },
    signInUser: {
      handler() {
        this.signInValidateMap.username = this.signInUser.username !== null;
        this.signInValidateMap.password = this.signInUser.password !== null;
      },
      deep: true,
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
};
</script>
