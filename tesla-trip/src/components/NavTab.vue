<template>
  <van-tabs class="nav-tab" color="#000000" background="#F0F0F0" v-model:active="tabName" @click-tab="redirectPage">
    <van-tab title="首頁" name="home"></van-tab>
    <van-tab title="旅途里程" name="trip"></van-tab>
    <van-tab title="充電站景點" name="attraction"></van-tab>
    <van-tab title="個人檔案" name="profile"></van-tab>
  </van-tabs>
</template>

<script>
export default {
  data() {
    return {
      tabName: this.$route.name.toLowerCase(),
      pathMap: {
        home: '/',
        trip: '/trip',
        attraction: '/attraction',
        profile: '/profile',
      },
    };
  },
  methods: {
    redirectPage() {
      const path = this.pathMap[this.tabName];
      this.$router.push(path);
    },
  },
};
</script>
