<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container">
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
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
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
  },
};
</script>
