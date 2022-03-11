import Cookies from 'js-cookie';

export default {
  data() {
    return {
      user: null,
      config: null,
      signInRequiredPage: ['car', 'profile', 'trip', 'product', 'redeem'],
    };
  },
  computed: {
    isSignIn() {
      return this.user !== null;
    },
    isSignInRequired() {
      return this.signInRequiredPage.includes(this.$route.name);
    },
  },
  methods: {
    returnAuth() {
      this.$router.push('/auth');
    },
    setCookie() {
      const expireTime = (1 / 24 / 60) * 30;
      Cookies.set('tesla-trip-sign-in', JSON.stringify(this.user), { expires: expireTime });
    },
    setConfig() {
      this.config = {
        headers: {
          Authorization: this.user.token,
        },
      };
    },
    setAuth() {
      this.setCookie();
      this.setConfig();
    },
    removeCookie() {
      Cookies.remove('tesla-trip-sign-in');
      this.$router.push('/');
    },
    async requestRefreshToken() {
      const url = `${process.env.VUE_APP_API}/refresh-token`;
      const payload = {
        refresh_token: this.user.refresh_token,
      };
      try {
        const res = await this.$http.post(url, payload);
        return res;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async refresh() {
      const res = await this.requestRefreshToken();
      if (res && res.status === 200) {
        this.user = res.data.data;
        this.setAuth();
      } else {
        const refs = this.$refs;
        this.alert.title = '授權逾時 請重新登入';
        this.alert.message = '確認';
        this.alert.isCancelShow = false;
        this.alert.confirmFunction = this.removeCookie;
        refs.alertModal.showModal();
      }
    },
    async initAuth() {
      const signInCookie = Cookies.get('tesla-trip-sign-in');
      if (signInCookie) {
        this.user = JSON.parse(signInCookie);
        await this.refresh();
      } else {
        if (!this.isSignInRequired) {
          return;
        }
        const refs = this.$refs;
        this.alert.title = '請先登入';
        this.alert.message = '確認';
        this.alert.isCancelShow = false;
        this.alert.confirmFunction = this.returnAuth;
        refs.alertModal.showModal();
      }
    },
  },
  async mounted() {
    await this.initAuth();
    if (!this.isSignIn) {
      return;
    }
    if (this.isSignInRequired) {
      this.initData();
    }
  },
};
