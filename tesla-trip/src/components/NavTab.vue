<template>
  <div class="nav-bar">
    <div class="logo">
      <input type="image" src="https://i.imgur.com/um46tbY.png" alt="logo">
    </div>
    <ul class="nav">
      <li class="nav-item" :class="tabName === 'home' ? 'active' : ''" @click="redirectPage('home')">首頁</li>
      <li class="nav-item" :class="tabName === 'trip' ? 'active' : ''" @click="redirectPage('trip')">旅途里程</li>
      <li class="nav-item" :class="tabName === 'car' ? 'active' : ''" @click="redirectPage('car')">愛車資料</li>
      <li class="nav-item" :class="tabName === 'product' ? 'active' : ''" @click="redirectPage('product')">點數兌換</li>
      <li class="nav-item" :class="tabName === 'stock' ? 'active' : ''" @click="redirectPage('stock')">庫存管理</li>
      <li class="nav-item" :class="tabName === 'profile' ? 'active' : ''" @click="redirectPage('profile')">個人檔案</li>
      <li class="nav-item" :class="tabName === 'auth' ? 'active' : ''" @click="redirectPage('auth')">{{ $parent.isSignIn ? '登出': '登入' }}</li>
    </ul>
  </div>
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
        car: '/car',
        product: '/product',
        stock: '/stock',
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
