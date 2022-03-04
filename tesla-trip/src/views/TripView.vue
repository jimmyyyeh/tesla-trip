<template>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <van-form class="trip-form" validate-trigger="onChange" @change="validateForm">
      <van-field
        v-model="mileage"
        type="number"
        label="滿電里程"
        placeholder="滿電里程"
        :rules="[{ required: true, message: '請輸入滿電里程' }]"
      >
        <template #extra>
          KM
        </template>
      </van-field>
      <van-field
        v-model="consumption"
        type="number"
        label="平均電力"
        placeholder="平均電力"
        :rules="[{ validator: numValidator, message:'請輸入0-9999999的數字'}]"
      >
        <template #extra>
          Wh/km
        </template>
      </van-field>
      <van-field
        v-model="total"
        type="number"
        label="電量總計"
        placeholder="電量總計"
        :rules="[{ validator: numValidator, message:'請輸入0-9999999的數字'}]"
      >
        <template #extra>
          kWh
        </template>
      </van-field>
      <van-field :border="false" readonly>
        <template #button>
          <van-button size="small" icon="plus" @click="isTripGroupShow=true"/>
        </template>
      </van-field>
      <van-cell-group v-show="isTripGroupShow" inset>
        <van-field
          v-model="start"
          label="起點"
          placeholder="起點"
          readonly
          :rules="[{ validator: districtValidator, message:'請選擇區域'}]"
          @click="isStartPickerShow=!isStartPickerShow"
        />
        <van-popup class="picker" :show="isStartPickerShow">
          <van-picker
            title="起點"
            :columns="areas"
            confirm-button-text="確認"
            cancel-button-text="關閉"
            @change="updateStart"
            @confirm="isStartPickerShow=false"
            @cancel="isStartPickerShow=false"
          />
        </van-popup>
        <van-field
          v-model="startBatteryLevel"
          type="number"
          label="起點電量"
          placeholder="起點電量"
          :rules="[{ validator: chargeValidator, message: startChargeMsg}]"
        >
          <template #extra>
            %
          </template>
        </van-field>
        <van-field
          v-model="end"
          label="終點"
          placeholder="終點"
          readonly
          :rules="[{ validator: districtValidator, message:'請選擇區域'}]"
          @click="isEndPickerShow=!isEndPickerShow"
        />
        <van-popup class="picker" :show="isEndPickerShow">
          <van-picker
            title="終點"
            :columns="areas"
            confirm-button-text="確認"
            cancel-button-text="關閉"
            @change="updateEnd"
            @confirm="isEndPickerShow=false"
            @cancel="isEndPickerShow=false"
          />
        </van-popup>
        <van-field
          v-model="endBatteryLevel"
          type="number"
          label="終點電量"
          placeholder="終點電量"
          :rules="[{ validator: chargeValidator, message: endChargeMsg}]"
        >
          <template #extra>
            %
          </template>
        </van-field>
        <van-field name="radio" label="是否進行充電">
          <template #input>
            <van-radio-group v-model="isCharge" direction="horizontal">
              <van-radio checked-color="#646566" name="1">是</van-radio>
              <van-radio checked-color="#646566" name="0">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-cell-group v-show="isCharge === '1'" inset>
          <van-field
            v-model="charger"
            readonly
            label="充電站"
            placeholder="充電站"
            :rules="[{ validator: chargerValidator, message:'請選擇充電站'}]"
            @click="isChargerPickerShow=!isChargerPickerShow"
          />
          <van-popup class="picker" :show="isChargerPickerShow" :lock-scroll="false">
            <van-picker
              title="充電站"
              :columns="chargers"
              confirm-button-text="確認"
              cancel-button-text="關閉"
              @change="updateCharger"
              @confirm="isChargerPickerShow=false"
              @cancel="isChargerPickerShow=false"
            />
          </van-popup>
          <van-field
            v-model="charge"
            type="number"
            label="充電%數"
            placeholder="充電%數"
            :rules="[{ validator: finalValidator, message:`請輸入0-${leftBatteryLevel}的數字`}]"
          >
            <template #extra>
              %
            </template>
          </van-field>
          <van-field
            v-model="fee"
            type="number"
            label="充電費用"
            placeholder="充電費用"
            :rules="[{ validator: numValidator, message:'請輸入0-9999999的數字'}]"
          >
            <template #extra>
              TWD
            </template>
          </van-field>
        </van-cell-group>
      </van-cell-group>
      <van-field class="submit" readonly>
        <template #button>
          <van-button v-if="!isFormValidate" class="submit-button" :class="'van-button--disabled'" disabled @click="insertTrip">確認</van-button>
          <van-button v-else class="submit-button" @click="insertTrip">確認</van-button>
        </template>
      </van-field>
    </van-form>
    <div class="trip-list">
      <table class="trip-table">
        <thead>
        <tr>
          <th>起點</th>
          <th>起點電量</th>
          <th>終點</th>
          <th>終點電量</th>
          <th>充電後電量</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(trip, index) in trips" :key=index>
          <td>{{ trip.start }}</td>
          <td>{{ trip.start_battery_level }}%</td>
          <td>{{ trip.end }}</td>
          <td>{{ trip.end_battery_level }}%</td>
          <td v-if="trip.isCharge"> {{ trip.final_battery_level }}%</td>
          <td v-else> -</td>
          <td>
            <van-button size="small" icon="minus" @click="removeTrip(index)"/>
          </td>
        </tr>
        </tbody>
      </table>
      <van-field class="submit" readonly>
        <template #button>
          <van-button class="submit-button" @click="confirmCreateTrip" v-show="trips.length > 0">送出
          </van-button>
        </template>
      </van-field>
    </div>
  </div>
  <SignInModal ref="signInModal" :initMethod="initData"></SignInModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import SignInModal from '@/components/SignInModal.vue';

export default {
  mixins: [authMixins],
  components: {
    SignInModal,
  },
  data() {
    return {
      mileage: 0,
      consumption: 0,
      total: 0,
      isTripGroupShow: false,
      charger: '請選擇',
      chargers: ['請選擇'],
      isChargerPickerShow: false,
      start: '請選擇, 請選擇',
      startBatteryLevel: 0,
      end: '請選擇, 請選擇',
      endBatteryLevel: 0,
      isCharge: '0',
      charge: 0,
      fee: 0,
      isStartPickerShow: false,
      isEndPickerShow: false,
      areas: [
        {
          text: '請選擇',
          children: [{ text: '請選擇' }],
        },
      ],
      trips: [],
      isFormValidate: false,
    };
  },
  computed: {
    leftBatteryLevel() {
      return 100 - parseInt(this.endBatteryLevel, 10);
    },
    finalBatteryLevel() {
      return parseInt(this.endBatteryLevel, 10) + parseInt(this.charge, 10);
    },
    startChargeMsg() {
      return parseInt(this.startBatteryLevel, 10) > parseInt(this.endBatteryLevel, 10) ? '請輸入0-100的數字' : '起點電量必須大於終點電量';
    },
    endChargeMsg() {
      return parseInt(this.startBatteryLevel, 10) > parseInt(this.endBatteryLevel, 10) ? '請輸入0-100的數字' : '終點電量必須小於起點電量';
    },
  },
  methods: {
    chargeValidator(value) {
      const intValue = parseInt(value, 10);
      return intValue >= 0 && intValue <= 100 && parseInt(this.startBatteryLevel, 10) > parseInt(this.endBatteryLevel, 10);
    },
    numValidator(value) {
      const intValue = parseInt(value, 10);
      return intValue >= 0 && intValue <= 9999999;
    },
    finalValidator(value) {
      const intValue = parseInt(value, 10);
      return intValue >= 0 && intValue <= 100 - parseInt(this.endBatteryLevel, 10);
    },
    districtValidator(value) {
      return !value.includes('請選擇');
    },
    chargerValidator(value) {
      if (this.isCharge !== '0') {
        return !value.includes('請選擇');
      }
      return true;
    },
    updateCharger(charger) {
      this.charger = charger;
    },
    updateStart(start) {
      this.start = `${start[0].text}, ${start[1].text}`;
    },
    updateEnd(end) {
      this.end = `${end[0].text}, ${end[1].text}`;
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
          console.log(error);
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    insertTrip() {
      if (this.trips.length >= 10) {
        this.$dialog.alert({
          message: '每趟里程不得超過10筆紀錄',
          confirmButtonText: '確認',
          confirmButtonColor: '#646566',
        }).then(() => 0);
      }
      const trip = {
        mileage: parseInt(this.mileage, 10),
        consumption: parseFloat(this.consumption),
        total: parseFloat(this.total),
        start: this.start,
        end: this.end,
        start_battery_level: parseInt(this.startBatteryLevel, 10),
        end_battery_level: parseInt(this.endBatteryLevel, 10),
        is_charge: this.isCharge === '1',
        charge: parseInt(this.charge, 10) || null,
        fee: parseInt(this.fee, 10) || null,
        final_battery_level: this.finalBatteryLevel,
      };
      this.start = '請選擇, 請選擇';
      this.end = '請選擇, 請選擇';
      this.startBatteryLevel = 0;
      this.endBatteryLevel = 0;
      this.isTripGroupShow = false;
      this.isCharge = '0';
      this.charger = '請選擇';
      this.charge = 0;
      this.fee = 0;
      console.log(trip);
      this.trips.push(trip);
    },
    removeTrip(index) {
      this.trips = this.trips.filter((trip, tripIndex) => tripIndex !== index);
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
        message: '確定要儲存里程嗎?',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        showCancelButton: true,
        confirmButtonColor: '#646566',
        cancelButtonColor: '#646566',
      }).then(() => {
        this.createTrip();
      }).catch(() => 0);
    },
    validateForm() {
      this.isFormValidate = document.getElementsByClassName('van-field__error-message').length === 0;
    },
    initData() {
      this.getChargers();
      this.getAreas();
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
