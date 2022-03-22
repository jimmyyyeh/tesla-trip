<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png"
           data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container home-container">
      <div class="content">
        <div class="display">
          <img src="https://i.imgur.com/tDs7NCD.png" alt="trip">
          <div class="description">
            <h1>紀錄旅程</h1>
            <br>
            <h2>分享並記錄你的旅程 並賺取更多的旅途幣</h2>
          </div>
        </div>
        <div class="display">
          <img src="https://i.imgur.com/n9MaXj3.png" alt="redeem">
          <div class="description">
            <h1>旅途幣</h1>
            <br>
            <h2>透過旅途幣來換杯美味咖啡 享受充電時光</h2>
          </div>
        </div>
        <div class="display">
          <img src="https://i.imgur.com/oAL4DQ5.png" alt="rate">
          <div class="description">
            <h1>讚賞車友</h1>
            <br>
            <h2>接受到分享旅程的幫助 回饋給車友對應的旅途幣</h2>
          </div>
        </div>
        <div class="display">
          <img src="https://i.imgur.com/xvNN5rP.png" alt="tesla">
          <div class="description">
            <button @click="goRegister">馬上加入</button>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="icons">
          <button class="image-button" @click="openSocialMedia('facebook')">
            <img src="https://i.imgur.com/kwZoQty.png" alt="facebook">
          </button>
          <button class="image-button" @click="openSocialMedia('instagram')">
            <img src="https://i.imgur.com/bMlXrgs.png" alt="instagram">
          </button>
          <button class="image-button" @click="openSocialMedia('linkedin')">
            <img src="https://i.imgur.com/o4k8cuB.png" alt="linkedin">
          </button>
          <button class="image-button" @click="sendEmail">
            <img src="https://i.imgur.com/lfvN3N6.png" alt="email">
          </button>
        </div>
        <div class="copyright">
          <label>Copyright © 2022 Jimmyyyeh. All rights reserved.</label>
        </div>
      </div>
    </div>
  </div>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';

export default {
  mixins: [authMixins, pageMixins],
  methods: {
    openSocialMedia(platform) {
      const socialMedia = {
        facebook: 'https://www.facebook.com/chienfeng0719',
        instagram: 'https://www.instagram.com/jimmyyyeh/?hl=zh-tw',
        linkedin: 'www.linkedin.com/in/jimmyyyeh',
      };
      window.open(socialMedia[platform]);
    },
    sendEmail() {
      window.location.href = 'mailto:chienfeng0719@hotmail.com';
    },
    goRegister() {
      this.$router.push('/auth');
    },
  },
};
</script>
