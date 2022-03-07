<template>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="container">
      <div class="profile-form">
        <div class="username column">
          <label class="input-label">使用者名稱:</label>
          <label class="input-label">{{ user.username }}</label>
        </div>
        <div class="birthday column">
          <label class="input-label">生日:</label>
          <label class="input-label">{{ user.birthday }}</label>
        </div>
        <div class="sex column">
          <label class="input-label">性別:</label>
          <label class="input-label">{{ user.sex === 1 ? '男' : '女' }}</label>
        </div>
        <div class="point column">
          <label class="input-label">積分:</label>
          <label class="input-label">{{ user.point }}</label>
        </div>
        <hr>
        <div class="nickname column">
          <label class="input-label">暱稱:</label>
          <input type="text" v-model="user.nickname">
        </div>
        <div class="email column">
          <label class="input-label">電子郵件:</label>
          <input type="text" v-model="user.email">
        </div>
        <div class="button-group">
          <button class="default-button" @click="updateProfile">更新</button>
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
      user: {
        username: null,
        nickname: null,
        email: null,
        birthday: null,
        sex: '1',
        point: 0,
      },
    };
  },
  methods: {
    updateProfile() {
      const url = `${process.env.VUE_APP_API}/profile`;
      const payload = {
        nickname: this.user.nickname,
        email: this.user.email,
      };
      this.$http.put(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.$dialog.alert({
              message: '更新成功',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => {
              this.user = res.data.data;
              this.setUpAuth();
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            this.refreshToken(response.data, response.data.error_code);
            this.updateProfile();
          }
        });
    },
  },
};
</script>
