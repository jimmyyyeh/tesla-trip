<template>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="overlay" v-show="isLoading">
      <div class="spinner-grow"></div>
    </div>
    <div class="container" v-show="!isLoading">
      <div class="toolbar">
        <div class="selector-group">
          <div class="my-trip-selector selector">
            <label class="selector-label">我的旅程:</label>
            <div>
              <input type="radio" name="is-my-trip" value="1" v-model="filter.isMyTrip"/>
              <label class="radio-label">是</label>
              <input type="radio" name="is-my-trip" value="0" v-model="filter.isMyTrip"/>
              <label class="radio-label">否</label>
            </div>
          </div>
          <div class="charger-selector selector">
            <label class="selector-label" for="chargers">超充站:</label>
            <select name="chargers" id="chargers" v-model="filter.charger">
              <option v-for="(charger, index) in chargers" :key="index" :value="charger">{{ charger }}</option>
            </select>
          </div>
          <div class="start-selector selector">
            <label class="selector-label" for="starts">起點:</label>
            <select name="starts" id="starts" v-model="filter.start">
              <option v-for="(area, index) in areas" :key="index" :value="area">{{ area }}</option>
            </select>
          </div>
          <div class="end-selector selector">
            <label class="selector-label" for="ends">終點:</label>
            <select name="ends" id="ends" v-model="filter.end">
              <option v-for="(area, index) in areas" :key="index" :value="area">{{ area }}</option>
            </select>
          </div>
          <div class="model-selector selector">
            <label class="selector-label" for="models">車款:</label>
            <select name="models" id="models" v-model="filter.model">
              <option v-for="(model, index) in modelOptions" :key="index" :value="model">{{ model }}</option>
            </select>
          </div>
          <div class="spec-selector selector" v-show="specOptions[filter.model]">
            <label class="selector-label" for="specs">型號:</label>
            <select name="specs" id="specs" v-model="filter.spec">
              <option v-for="(spec, index) in specOptions[filter.model]" :key="index" :value="spec">{{ spec }}</option>
            </select>
          </div>
        </div>
        <div class="button-group">
          <button class="default-button" @click="clearFilter">重設條件</button>
          <button class="default-button" @click="showTripModal">新增旅程</button>
        </div>
      </div>
      <div class="trip">
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
            <td v-if="trip.is_charge" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-html="true" :title="getChargeInfo(trip)">
              &#9432;
            </td>
            <td v-else> - </td>
          </tr>
          </tbody>
        </table>
      </div>
      <PaginateComponent :refresh-method="getTrips" :pager="pager" v-show="isSignIn"></PaginateComponent>
    </div>
  </div>
  <TripModal ref="tripModal" :cars="cars" :carMap="carMap" :chargers="chargers" :chargerMap="chargerMap" :areas="areas"
             :config="config"></TripModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import TripModal from '@/components/TripModal.vue';
import PaginateComponent from '@/components/PaginateComponent.vue';
import { formatUrl } from '@/utils/tools';
import { Tooltip } from 'bootstrap';

export default {
  mixins: [authMixins],
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
      isLoading: true,
      cars: ['請選擇'],
      carMap: {},
      trips: [],
      chargers: ['請選擇'],
      chargerMap: {},
      areas: ['請選擇'],
      modelOptions: ['請選擇', 'ModelS', 'Model3', 'ModelX', 'ModelY'],
      specOptions: {
        ModelS: ['請選擇', 'Model S', 'Model S Plaid'],
        Model3: ['請選擇', 'Real-Wheel Drive', 'Lone Range AWD', 'Performance'],
        ModelX: ['請選擇', 'Model X', 'Model X Plaid'],
        ModelY: ['請選擇', 'Lone Range AWD', 'Performance'],
      },
      filter: {
        charger: '請選擇',
        start: '請選擇',
        end: '請選擇',
        model: '請選擇',
        spec: '請選擇',
        isMyTrip: '0',
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
            this.refreshToken(response.data, response.data.error_code);
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
    getTrips(page) {
      let url = `${process.env.VUE_APP_API}/trip`;
      if (this.filter.isMyTrip === '1') {
        url = `${url}/${this.user.id}`;
      }
      const queryFilter = this.getTripsFilter();
      queryFilter.page = page;
      url = formatUrl(url, queryFilter);
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.trips = res.data.data;
            this.pager = res.data.pager;
            this.isLoading = false;
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            this.refreshToken(response.data, response.data.error_code);
            this.getTrips(page);
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
            this.refreshToken(response.data, response.data.error_code);
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
            this.refreshToken(response.data, response.data.error_code);
          }
        });
    },
    getChargeInfo(trip) {
      return `充電站: ${trip.charger}<br>補電電量: ${trip.charge}%<br>充電費用: ${trip.fee}元`;
    },
    clearFilter() {
      Object.keys(this.filter).forEach((key) => {
        this.filter[key] = '請選擇';
      });
    },
    initData() {
      this.getCars();
      this.getTrips();
      this.getChargers();
      this.getAreas();
    },
    initToolTip() {
      Array.from(document.querySelectorAll('td[data-bs-toggle="tooltip"]'))
        .forEach((tooltipNode) => new Tooltip(tooltipNode));
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
  updated() {
    this.initToolTip();
  },
};
</script>
