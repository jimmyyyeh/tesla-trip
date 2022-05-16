<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png"
           data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="overlay" v-show="isLoading">
      <div class="spinner-grow"></div>
    </div>
    <div class="container" v-show="!isLoading">
      <div class="filter-bar">
        <div class="button-group">
          <button class="default-button" @click="showTripModal">新增</button>
          <button class="default-button" @click="clearFilter">重設</button>
        </div>
        <div class="selector-group">
          <div class="my-trip-selector selector">
            <label class="selector-label">我的旅程</label>
            <div class="radio-group">
              <input type="radio" name="is-my-trip" value="1" v-model="filter.is_my_trip"/>
              <label class="radio-label">是</label>
              <input type="radio" name="is-my-trip" value="0" v-model="filter.is_my_trip"/>
              <label class="radio-label">否</label>
            </div>
          </div>
          <div class="charger-selector selector">
            <label class="selector-label" for="chargers">超充站</label>
            <select name="chargers" id="chargers" v-model="filter.charger">
              <option v-for="(charger, index) in chargers" :key="index" :value="charger">{{
                  charger
                }}
              </option>
            </select>
          </div>
          <div class="start-selector selector">
            <label class="selector-label" for="starts">起點</label>
            <select name="starts" id="starts" v-model="filter.start">
              <option v-for="(area, index) in areas" :key="index" :value="area">{{ area }}</option>
            </select>
          </div>
          <div class="end-selector selector">
            <label class="selector-label" for="ends">終點</label>
            <select name="ends" id="ends" v-model="filter.end">
              <option v-for="(area, index) in areas" :key="index" :value="area">{{ area }}</option>
            </select>
          </div>
          <div class="model-selector selector">
            <label class="selector-label" for="models">車款</label>
            <select name="models" id="models" v-model="filter.model">
              <option v-for="(model, index) in modelOptions" :key="index" :value="model">{{
                  model
                }}
              </option>
            </select>
          </div>
          <div class="spec-selector selector">
            <label class="selector-label" for="specs">型號</label>
            <select name="specs" id="specs" v-model="filter.spec">
              <option v-for="(spec, index) in specOptions[filter.model] || ['請選擇']" :key="index"
                      :value="spec">
                {{ spec }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="trip-list">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">日期</th>
            <th scope="col">車型</th>
            <th scope="col">滿電里程</th>
            <th scope="col">平均電力</th>
            <th scope="col">電量總計</th>
            <th scope="col">起點</th>
            <th scope="col">終點</th>
            <th scope="col">充電資訊</th>
            <th scope="col">評分</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(trip, index) in trips" :key="index">
            <td> {{ trip.trip_date }}</td>
            <td> {{ trip.car }}</td>
            <td> {{ trip.mileage }}KM</td>
            <td> {{ trip.consumption }}Wh/km</td>
            <td> {{ trip.total }}kWh</td>
            <td> {{ trip.start }} ({{ trip.start_battery_level }}%)</td>
            <td> {{ trip.end }} ({{ trip.end_battery_level }}%)</td>
            <td>
              <div class="charge-info" data-bs-toggle="tooltip" data-bs-placement="left"
                   data-bs-html="true" :title="getChargeInfo(trip)">
                <button class="image-button">
                  <img v-if="trip.is_charge" src="https://i.imgur.com/cTFmJ8Q.png"
                       alt="charge info"/>
                  <label v-else> - </label>
                </button>
              </div>
            </td>
            <td>
              <div class="rate">
                <button class="image-button" @click="rateTrip(trip.id)">
                  <img
                    :src="trip.is_rate ? 'https://i.imgur.com/sokgJxr.png' : 'https://i.imgur.com/ZfGOkQY.png'"
                    alt="rate"/>
                </button>
                <label> {{ trip.trip_rate_count || 0 }}</label>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="trip-list-mobile">
        <div class="trip" v-for="(trip, index) in trips" :key="index">
          <h6 class="header">{{ trip.car }}</h6>
          <div class="trip-content">
            <ul class="content">
              <li>{{ trip.date }}</li>
              <li>{{ trip.start }} ({{ trip.start_battery_level }}%)</li>
              <li>{{ trip.end }} ({{ trip.end_battery_level }}%)</li>
              <li>平均電力: {{ trip.consumption }}Wh/km</li>
              <li>電量總計: {{ trip.total }}kWh</li>
            </ul>
            <div class="rate">
              <button class="image-button" @click="rateTrip(trip.id)">
                <img
                  :src="trip.is_rate ? 'https://i.imgur.com/sokgJxr.png' : 'https://i.imgur.com/ZfGOkQY.png'"
                  alt="rate"/>
              </button>
              <label> {{ trip.trip_rate_count || 0 }}</label>
            </div>
          </div>
        </div>
      </div>
      <PaginateComponent :refresh-method="getTrips" :pager="pager"
                         v-show="isSignIn"></PaginateComponent>
    </div>
  </div>
  <TripModal ref="tripModal" :cars="cars" :carMap="carMap" :chargers="chargers"
             :chargerMap="chargerMap" :areas="areas"
             :config="config"></TripModal>
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
import TripModal from '@/components/TripModal.vue';
import PaginateComponent from '@/components/PaginateComponent.vue';
import { formatUrl, initToolTip } from '@/utils/tools';

export default {
  mixins: [authMixins, pageMixins],
  components: {
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
      isLoading: false,
      cars: ['請選擇'],
      carMap: {},
      trips: [],
      chargers: ['請選擇'],
      chargerMap: {},
      areas: ['請選擇'],
      modelOptions: ['請選擇'],
      specOptions: {
      },
      filter: {
        charger: '請選擇',
        start: '請選擇',
        end: '請選擇',
        model: '請選擇',
        spec: '請選擇',
        is_my_trip: '0',
      },
    };
  },
  watch: {
    filter: {
      handler() {
        this.getTrips();
      },
      deep: true,
    },
  },
  methods: {
    returnHome() {
      this.$router.push('/');
    },
    getCarModels() {
      const url = `${process.env.VUE_APP_API}/car/car-model`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            dataList.forEach((data) => {
              if (!this.modelOptions.includes(data.model)) {
                this.modelOptions.push(data.model);
                this.specOptions[data.model] = [data.spec];
              } else {
                this.specOptions[data.model].push(data.spec);
              }
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    getCars() {
      const url = `${process.env.VUE_APP_API}/car`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            this.cars = ['請選擇'];
            this.carMap = {};
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
          }
        });
    },
    getTripsFilter() {
      const queryFilter = { ...this.filter };
      Object.keys(queryFilter).forEach((key) => {
        if (queryFilter[key].includes('請選擇')) {
          queryFilter[key] = null;
        }
      });
      queryFilter.start = queryFilter.start ? queryFilter.start.split(',')[1].trim() : null;
      queryFilter.end = queryFilter.end ? queryFilter.end.split(',')[1].trim() : null;
      const chargerIndex = Object.values(this.chargers).indexOf(queryFilter.charger);
      queryFilter.charger = this.chargerMap[chargerIndex] - 1;
      return queryFilter;
    },
    getTrips(page, isAppend) {
      let url = `${process.env.VUE_APP_API}/trip`;
      const queryFilter = this.getTripsFilter();
      queryFilter.page = page;
      url = formatUrl(url, queryFilter);
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            if (isAppend) {
              this.trips = this.trips.concat(res.data.data);
            } else {
              this.trips = res.data.data;
            }
            this.pager = res.data.pager;
            this.isLoading = false;
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    getChargers() {
      const url = `${process.env.VUE_APP_API}/super-charger`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            dataList.forEach((data, index) => {
              this.chargers.push(`${data.city}-${data.name}`);
              this.chargerMap[index] = data.id;
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    formatArea(city, areas) {
      areas.forEach((area) => {
        this.areas.push(`${city}, ${area.area}`);
      });
    },
    getAreas() {
      const url = `${process.env.VUE_APP_API}/administrative-district`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataObject = res.data.data;
            Object.keys(dataObject).forEach((city) => {
              this.formatArea(city, dataObject[city]);
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    getChargeInfo(trip) {
      return trip.is_charge ? `充電站: ${trip.charger}<br>補電電量: ${trip.charge}%<br>充電費用: ${trip.fee}元` : '';
    },
    rateTrip(tripID) {
      const url = `${process.env.VUE_APP_API}/trip-rate`;
      const payload = {
        trip_id: tripID,
      };
      this.$http.post(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.getTrips(this.pager.page);
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    clearFilter() {
      Object.keys(this.filter).forEach((key) => {
        this.filter[key] = '請選擇';
      });
      this.filter.is_my_trip = '0';
    },
    initData() {
      this.getCarModels();
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
  updated() {
    initToolTip();
  },
  mounted() {
    const tripListMobile = document.getElementsByClassName('trip-list-mobile')[0];
    let currentPage = 1;
    tripListMobile.addEventListener('scroll', () => {
      if (tripListMobile.offsetHeight + tripListMobile.scrollTop >= tripListMobile.scrollHeight) {
        if (currentPage < this.pager.pages) {
          currentPage += 1;
          this.getTrips(currentPage, true);
        }
      }
    });
  },
};
</script>
