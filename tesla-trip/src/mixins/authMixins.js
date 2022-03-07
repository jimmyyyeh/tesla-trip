import Cookies from 'js-cookie';

export default {
  data() {
    return {
      user: null,
      isSignIn: false,
      config: null,
      signInRequiredPage: ['car', 'profile', 'trip'],
    };
  },
  methods: {
    initAuth() {
      const signInCookie = Cookies.get('tesla-trip-sign-in');
      this.isSignIn = true;
      this.user = JSON.parse(signInCookie);
      this.config = {
        headers: {
          Authorization: this.user.token,
        },
      };
    },
    setCookie() {
      const expireTime = (1 / 24 / 60) * 30;
      Cookies.set('tesla-trip-sign-in', JSON.stringify(this.user), { expires: expireTime });
    },
    setUpAuth() {
      this.setCookie();
      this.initAuth();
    },
    checkAuth() {
      const signInCookie = Cookies.get('tesla-trip-sign-in');
      if (!signInCookie) {
        if (this.signInRequiredPage.includes(this.$route.name)) {
          this.$dialog.alert({
            message: '請先登入',
            confirmButtonText: '確認',
            confirmButtonColor: '#646566',
          }).then(() => {
            this.$router.push('/auth');
          });
        }
      } else {
        this.initAuth();
        this.refreshToken();
      }
    },
    refreshToken() {
      const url = `${process.env.VUE_APP_API}/refresh-token`;
      const payload = {
        refresh_token: this.user.refresh_token,
      };
      this.$http.post(url, payload)
        .then((res) => {
          if (res.status === 200) {
            this.user = res.data.data;
            this.setUpAuth();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            this.$dialog.alert({
              message: '授權逾時',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => {
              Cookies.remove('tesla-trip-sign-in');
              this.$router.push('/');
            }).catch(() => {
              this.$router.push('/');
            });
          }
        });
    },
    signOut() {
      this.$dialog.alert({
        message: '確定要登出嗎',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        confirmButtonColor: '#646566',
        cancelButtonColor: '#646566',
      }).then(() => {
        Cookies.remove('tesla-trip-sign-in');
        this.$router.push('/');
      }).catch(() => {
        this.$router.push('/');
      });
    },
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
    this.checkAuth();
  },
};
