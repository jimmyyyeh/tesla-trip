<template>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="container">
      <div class="profile-form">
        <div class="username column">
          <label class="input-label">使用者名稱:</label>
          <label class="input-label">{{ user.username }}</label>
        </div>
        <div class="nickname column">
          <label class="input-label">暱稱:</label>
          <label class="input-label">{{ user.nickname }}</label>
        </div>
        <div class="email column">
          <label class="input-label">電子郵件:</label>
          <label class="input-label">{{ user.email }}</label>
        </div>
        <div class="age column">
          <label class="input-label">年齡:</label>
          <label class="input-label">{{ user.age }}</label>
        </div>
        <div class="sex column">
          <label class="input-label">性別:</label>
          <label class="input-label">{{ user.sex === 1 ? '男' : '女' }}</label>
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
        age: null,
        sex: '1',
      },
    };
  },
};
</script>
