<template>
  <NavTab></NavTab>
  <img class="under-construction" src="https://i.imgur.com/mS71Dki.png" alt="Under construction">
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';

export default {
  mixins: [authMixins, pageMixins],
};

</script>
