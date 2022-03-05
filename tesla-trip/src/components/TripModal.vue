<template>
  <div class="modal fade" id="trip-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="trip-form">
            <div class="car-selector selector column">
              <label class="selector-label" for="cars">車輛:</label>
              <select name="cars" id="cars" v-model="carIndex">
                <option v-for="(car, index) in cars" :key="index" :value="index">{{ car }}</option>
              </select>
            </div>
            <div class="date-selector column">
              <label class="selector-label" for="date">日期:</label>
              <input type="date" id="date" v-model="trip.tripDate">
            </div>
            <div class="mileage column">
              <label class="selector-label" for="mileage">滿電里程:</label>
              <input type="number" id="mileage" v-model="trip.mileage">
            </div>
            <div class="consumption column">
              <label class="selector-label" for="consumption">平均電力:</label>
              <input type="number" id="consumption" v-model="trip.consumption">
            </div>
            <div class="total column">
              <label class="selector-label" for="total">電量總計:</label>
              <input type="number" id="total" v-model="trip.total">
            </div>
            <div class="start-selector selector column">
              <label class="selector-label" for="starts">起點:</label>
              <select name="starts" id="starts" v-model="trip.start">
                <option v-for="(area, index) in areas" :key="index" :value="area">{{
                    area
                  }}
                </option>
              </select>
              <label class="selector-label" for="start-battery-level">電量:</label>
              <input type="number" id="start-battery-level" v-model="trip.startBatteryLevel">
              <label class="validate-label" v-show="!validateMap.startBatteryLevel">請輸入0-100間的數字</label>
            </div>
            <div class="end-selector selector column">
              <label class="selector-label" for="ends">終點:</label>
              <select name="ends" id="ends" v-model="trip.end">
                <option v-for="(area, index) in areas" :key="index" :value="area">{{
                    area
                  }}
                </option>
              </select>
              <label class="selector-label" for="end-battery-level">電量:</label>
              <input type="number" id="end-battery-level" v-model="trip.endBatteryLevel">
              <label class="validate-label" v-show="!validateMap.endBatteryLevel">請輸入0-100間的數字</label>
            </div>
            <div class="charge-selector column">
              <label class="selector-label">是否充電:</label>
              <div class="charge-group">
                <input type="radio" name="is-charge" value="1" v-model="trip.isCharge"/>
                <label class="selector-label">是</label>
                <input type="radio" name="is-charge" value="0" v-model="trip.isCharge"/>
                <label class="selector-label">否</label>
              </div>
            </div>
            <div class="charge-group" v-show="trip.isCharge === '1'">
              <div class="charger-selector column">
                <label class="selector-label" for="chargers">超充站:</label>
                <select name="chargers" id="chargers" v-model="chargerIndex">
                  <option v-for="(charger, index) in chargers" :key="index" :value="index">
                    {{ charger }}
                  </option>
                </select>
              </div>
              <div class="charge column">
                <label class="selector-label" for="charge">充電%數:</label>
                <input type="number" id="charge" v-model="trip.charge">
                <label class="validate-label" v-show="!validateMap.charge">請輸入0-{{leftBatteryLevel}}間的數字</label>
              </div>
              <div class="fee column">
                <label class="selector-label" for="fee">充電費用:</label>
                <input type="number" id="fee" v-model="trip.fee">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="isValidate" class="default-button" @click="insertTrip">送出</button>
          <button v-else class="default-button" disabled>送出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixins from '@/mixins/modalMixins';

export default {
  mixins: [modalMixins],
  props: ['cars', 'carMap', 'chargers', 'chargerMap', 'areas', 'config'],
  data() {
    return {
      carIndex: 0,
      chargerIndex: 0,
      trips: [],
      trip: {},
      initTrip: {
        car_id: null,
        charger_id: null,
        mileage: 0,
        consumption: 0,
        total: 0,
        start: '請選擇',
        end: '請選擇',
        startBatteryLevel: 0,
        endBatteryLevel: 0,
        isCharge: '0',
        charge: 0,
        fee: 0,
        tripDate: this.formatDate(new Date()),
      },
      validateMap: {
        car: false,
        start: false,
        end: false,
        charger: true,
        startBatteryLevel: true,
        endBatteryLevel: true,
        charge: true,
      },
    };
  },
  computed: {
    finalBatteryLevel() {
      return this.trip.endBatteryLevel + this.trip.charge;
    },
    leftBatteryLevel() {
      return 100 - this.trip.endBatteryLevel;
    },
    isValidate() {
      return !Object.values(this.validateMap).includes(false);
    },
  },
  watch: {
    trip: {
      handler() {
        this.validateMap.car = this.trip.car_id !== null;
        this.validateMap.start = this.trip.start !== '請選擇';
        this.validateMap.end = this.trip.end !== '請選擇';
        if (this.trip.isCharge === '1') {
          this.validateMap.charger = this.trip.charger_id !== null;
          this.validateMap.charge = this.trip.charge >= 0 && this.trip.charge <= (100 - this.trip.endBatteryLevel);
        } else {
          this.validateMap.charger = true;
          this.validateMap.charge = true;
          this.trip.charger = null;
          this.trip.charge = null;
          this.trip.fee = null;
        }
        this.validateMap.startBatteryLevel = this.trip.startBatteryLevel >= 0 && this.trip.startBatteryLevel <= 100;
        this.validateMap.endBatteryLevel = this.trip.endBatteryLevel >= 0 && this.trip.endBatteryLevel <= 100;
      },
      deep: true,
    },
    carIndex(value) {
      if (value === '請選擇') {
        this.trip.car_id = null;
      } else {
        this.trip.car_id = this.carMap[value - 1];
      }
    },
    chargerIndex(value) {
      if (value === '請選擇') {
        this.trip.charger_id = null;
      } else {
        this.trip.charger_id = this.chargerMap[value - 1];
      }
    },
  },
  methods: {
    formatDate(date_) {
      // TODO 共用
      if (typeof date_ === 'string') {
        return date_;
      }
      const month = `${date_.getMonth() + 1}`.padStart(2, '0');
      const day = `${date_.getDate()}`.padStart(2, '0');
      return `${date_.getFullYear()}-${month}-${day}`;
    },
    insertTrip() {
      const trip = {
        car_id: this.trip.car_id,
        charger_id: this.trip.charger_id,
        mileage: parseInt(this.trip.mileage, 10),
        consumption: parseFloat(this.trip.consumption),
        total: parseFloat(this.trip.total),
        start: this.trip.start,
        end: this.trip.end,
        start_battery_level: parseInt(this.trip.startBatteryLevel, 10),
        end_battery_level: parseInt(this.trip.endBatteryLevel, 10),
        is_charge: this.trip.isCharge === '1',
        charge: parseInt(this.trip.charge, 10) || null,
        fee: parseInt(this.trip.fee, 10) || null,
        final_battery_level: this.finalBatteryLevel,
        trip_date: this.trip.tripDate,
      };
      this.trips = [];
      this.trips.push(trip);
      this.confirmCreateTrip();
    },
    createTrip() {
      const url = `${process.env.VUE_APP_API}/trip`;
      this.$http.post(url, this.trips, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.$dialog.alert({
              message: '儲存旅程成功',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => {
              this.trips = [];
              this.trip = { ...this.initTrip };
              this.$parent.getTrips();
              this.hideModal();
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
    confirmCreateTrip() {
      this.$dialog.confirm({
        message: '確定要新增里程嗎?',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        showCancelButton: true,
        confirmButtonColor: '#646566',
        cancelButtonColor: '#646566',
      }).then(() => {
        this.createTrip();
      }).catch(() => 0);
    },
  },
  created() {
    this.trip = { ...this.initTrip };
  },
};
</script>
