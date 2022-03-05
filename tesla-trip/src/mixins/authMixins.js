import Cookies from 'js-cookie';

export default {
  data() {
    return {
      user: null,
      isSignIn: false,
      token: null,
      config: null,
    };
  },
  methods: {
    initAuth() {
      const signInCookie = Cookies.get('tesla-trip-sign-in');
      this.isSignIn = true;
      this.user = JSON.parse(signInCookie);
      this.token = this.user.token;
      this.config = {
        headers: {
          Authorization: this.token,
        },
      };
    },
    getAuth() {
      const signInCookie = Cookies.get('tesla-trip-sign-in');
      if (!signInCookie) {
        const refs = this.$refs;
        refs.signInModal.showModal();
      } else {
        this.initAuth();
      }
    },
    setCookie() {
      const expireTime = (1 / 24 / 60) * 30;
      Cookies.set('tesla-trip-sign-in', JSON.stringify(this.user), { expires: expireTime });
    },
    setUpAuth() {
      this.setCookie();
      this.initAuth();
      this.initData();
    },
    refreshToken(data, errorCode, retryMethod) {
      if (errorCode !== 1004) {
        console.log(data);
      } else {
        const url = `${process.env.VUE_APP_API}/refresh-token`;
        const payload = {
          refresh_token: this.user.refresh_token,
        };
        this.$http.post(url, payload)
          .then((res) => {
            if (res.status === 200) {
              this.user = res.data.data;
              this.setUpAuth();
              retryMethod();
            }
          })
          .catch((error) => {
            const response = error.response;
            if (response) {
              console.log(response.data);
            }
          });
      }
    },
  },
  mounted() {
    this.getAuth();
  },
};
