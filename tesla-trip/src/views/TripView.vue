<template>
  <NavTab></NavTab>
  <SignInModal ref="signInModal" :initMethod="initData"></SignInModal>
  <TripModal ref="tripModal" :chargers="chargers" :areas="areas" :config="config"></TripModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import SignInModal from '@/components/SignInModal.vue';
import TripModal from '@/components/TripModal.vue';

export default {
  mixins: [authMixins],
  components: {
    SignInModal,
    TripModal,
  },
  data() {
    return {
      chargers: ['請選擇'],
      areas: [
        {
          text: '請選擇',
          children: [{ text: '請選擇' }],
        },
      ],
    };
  },
  methods: {
    getChargers() {
      const url = `${process.env.VUE_APP_API}/super-charger`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            dataList.forEach((data) => {
              this.chargers.push(`${data.city}-${data.name}`);
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            this.refreshToken(response.data, response.data.error_code);
          }
        });
    },
    formatArea(areas) {
      const temp = [];
      areas.forEach((area) => {
        temp.push({
          text: area.area,
        });
      });
      return temp;
    },
    getAreas() {
      const url = `${process.env.VUE_APP_API}/administrative-district`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataObject = res.data.data;
            Object.keys(dataObject).forEach((city) => {
              const children = {
                text: city,
                children: this.formatArea(dataObject[city]),
              };
              this.areas.push(children);
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            this.refreshToken(response.data, response.data.error_code);
          }
        });
    },
    initData() {
      this.getChargers();
      this.getAreas();
    },
    showTripModal() {
      const refs = this.$refs;
      refs.tripModal.showModal();
    },
  },
  mounted() {
    if (!this.isSignIn) {
      return;
    }
    this.initData();
  },
};
</script>
