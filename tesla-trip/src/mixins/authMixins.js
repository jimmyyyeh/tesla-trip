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
  },
  mounted() {
    this.getAuth();
  },
};
