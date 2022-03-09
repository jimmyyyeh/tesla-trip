<template>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="container">
      <div class="profile-form">
        <div class="username column">
          <div class="input">
            <label class="input-label">使用者名稱:</label>
            <label class="input-label">{{ profile.username }}</label>
          </div>
        </div>
        <div class="birthday column">
          <div class="input">
            <label class="input-label">生日:</label>
            <label class="input-label">{{ profile.birthday }}</label>
          </div>
        </div>
        <div class="sex column">
          <div class="input">
            <label class="input-label">性別:</label>
            <label class="input-label">{{ profile.sex === 1 ? '男' : '女' }}</label>
          </div>
        </div>
        <div class="point column">
          <div class="input">
            <label class="input-label">積分:</label>
            <label class="input-label">{{ profile.point }}</label>
          </div>
        </div>
        <hr>
        <div class="nickname column">
          <div class="input">
            <label class="input-label">暱稱:</label>
            <input type="text" v-model="profile.nickname">
          </div>
          <div class="validate-label"
               :style="{visibility: validateMap.nickname ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="validateMsg.nickname"
          >
            &#9432;
          </div>
        </div>
        <div class="email column">
          <div class="input">
            <label class="input-label">電子郵件:</label>
            <input type="text" v-model="profile.email">
          </div>
          <div class="validate-label"
               :style="{visibility: validateMap.email ? 'visible' : 'hidden'}"
               data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="validateMsg.email"
          >
            &#9432;
          </div>
        </div>
        <div class="button-group">
          <button v-if="isProfileFormValidated" class="default-button" @click="updateProfile">更新</button>
          <button v-else class="default-button" disabled>更新</button>
        </div>
      </div>
    </div>
  </div>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>
<script>
import authMixins from '@/mixins/authMixins';
import { initToolTip } from '@/utils/tools';
import { Pattern } from '@/assets/constant/constant';

export default {
  mixins: [authMixins],
  data() {
    return {
      alert: {
        title: '',
        message: '',
        isCancelShow: false,
        confirmFunction: (() => {}),
      },
      profile: {
        username: null,
        nickname: null,
        email: null,
        birthday: null,
        sex: 1,
        point: 0,
      },
      validateMap: {
        nickname: false,
        email: false,
      },
      validateMsg: {
        nickname: '請輸入暱稱',
        email: '請輸入電子郵件',
      },
    };
  },
  computed: {
    isProfileFormValidated() {
      return !Object.values(this.validateMap).includes(true) && !Object.values(this.profile).includes('');
    },
  },
  watch: {
    'profile.nickname': function () {
      this.validateMap.nickname = this.profile.nickname === '';
    },
    'profile.email': function () {
      if (this.profile.email === '') {
        this.validateMsg.email = '請輸入電子郵件';
      } else if (!this.profile.email.match(Pattern.EMAIL)) {
        this.validateMsg.email = '電子郵件格式不符';
      }
      this.validateMap.email = this.profile.email === '' || !this.profile.email.match(Pattern.EMAIL);
    },
  },
  methods: {
    getProfile() {
      const url = `${process.env.VUE_APP_API}/profile`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.profile = res.data.data;
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    updateProfile() {
      const url = `${process.env.VUE_APP_API}/profile`;
      const payload = {
        nickname: this.profile.nickname,
        email: this.profile.email,
      };
      this.$http.put(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.user = res.data.data;
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '更新成功';
            this.alert.confirmFunction = this.getProfile;
            refs.alertModal.showModal();
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
  mounted() {
    if (this.isSignIn) {
      this.getProfile();
    }
  },
  updated() {
    initToolTip();
  },
};
</script>
