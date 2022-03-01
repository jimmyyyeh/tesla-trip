<template>
  <van-tabs class="nav-tab" color="#000000" v-model:active="tabName" @click-tab="redirectPage">
    <van-tab title="首頁" name="home"></van-tab>
    <van-tab title="旅途里程" name="trip"></van-tab>
    <van-tab title="充電站景點" name="attraction"></van-tab>
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
