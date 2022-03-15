<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas">
    <div class="offcanvas-header">
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
      <ul>
        <li @click="redirectPage('home')" data-bs-dismiss="offcanvas">首頁</li>
        <li @click="redirectPage('trip')" data-bs-dismiss="offcanvas">旅途里程</li>
<!--        <li @click="redirectPage('car')" data-bs-dismiss="offcanvas">愛車資料</li>-->
        <li @click="redirectPage('product')" data-bs-dismiss="offcanvas">點數兌換</li>
        <li @click="redirectPage('profile')" data-bs-dismiss="offcanvas">個人檔案</li>
        <li @click="redirectPage('auth')" data-bs-dismiss="offcanvas">{{ $parent.isSignIn ? '登出': '登入' }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pathMap: {
        home: '/',
        trip: '/trip',
        attraction: '/attraction',
        car: '/car',
        product: '/product',
        profile: '/profile',
        auth: '/auth',
      },
    };
  },
  methods: {
    redirectPage(name) {
      const path = this.pathMap[name];
      this.$router.push(path);
    },
  },
};
</script>
