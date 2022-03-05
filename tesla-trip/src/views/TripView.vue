<template>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="search-bar">
      <van-button class="create-button" size="small" icon="plus" @click="showTripModal"/>
    </div>
    <table class="table trip-table">
      <thead>
      <tr>
        <th scope="col">日期</th>
        <th scope="col">車型</th>
        <th scope="col">滿電里程(KM)</th>
        <th scope="col">平均電力(Wh/km)</th>
        <th scope="col">電量總計(kWh)</th>
        <th scope="col">起點</th>
        <th scope="col">終點</th>
        <th scope="col">是否充電</th>
        <th scope="col">充電%數</th>
        <th scope="col">充電費用</th>
        <th scope="col">最終電量</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(trip, index) in trips" :key="index">
        <td> {{ trip.trip_date }}</td>
        <td> {{ trip.car }}</td>
        <td> {{ trip.mileage }}</td>
        <td> {{ trip.consumption }}</td>
        <td> {{ trip.total }}</td>
        <td> {{ trip.start }} ({{ trip.start_battery_level }}%)</td>
        <td> {{ trip.end }} ({{ trip.end_battery_level }}%)</td>
        <td> {{ trip.is_charge ? '是' : '否' }}</td>
        <td> {{ trip.charge || '-' }}</td>
        <td> {{ trip.fee || '-' }}</td>
        <td> {{ trip.final_battery_level }}%</td>
      </tr>
      </tbody>
    </table>
  </div>
  <SignInModal ref="signInModal" :initMethod="initData"></SignInModal>
  <TripModal ref="tripModal" :cars="cars" :carMap="carMap" :chargers="chargers" :areas="areas"
             :config="config"></TripModal>
  <PaginateComponent :refresh-method="getTrips" :pager="pager" v-show="isSignIn"></PaginateComponent>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import SignInModal from '@/components/SignInModal.vue';
import TripModal from '@/components/TripModal.vue';
import PaginateComponent from '@/components/PaginateComponent.vue';

export default {
  mixins: [authMixins],
  components: {
    SignInModal,
    TripModal,
    PaginateComponent,
  },
  data() {
    return {
      pager: {
        page: 1,
        per_page: 10,
        pages: 1,
        total: 1,
      },
      cars: [],
      carMap: {},
      trips: [],
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
    getCars() {
      const url = `${process.env.VUE_APP_API}/car`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            dataList.forEach((data, index) => {
              this.cars.push(`${data.model}/${data.spec}/${data.manufacture_date}`);
              this.carMap[index] = data.id;
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
    getTrips(page) {
      let url = `${process.env.VUE_APP_API}/trip`;
      if (page) {
        url = `${url}?page=${page}`;
      }
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.trips = res.data.data;
            this.pager = res.data.pager;
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
      this.getCars();
      this.getTrips();
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
