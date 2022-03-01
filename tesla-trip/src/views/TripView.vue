<style>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trip-form {
  width: 60%;
  height: 70vh;
  border: #646566 1px solid;
  margin: 10px;
  position: relative;
}

.picker {
  width: 50vw;
}

.submit {
  position: absolute;
  bottom: 0;
  right: 0;
}

.submit-button {
  background-color: #646566;
  color: #FFFFFF;
  border-radius: 5px;
}

</style>

<template>
  <NavTab></NavTab>
  <div class="wrap">
    <van-form class="trip-form">
      <van-field
        v-model="mileage"
        label="滿電里程"
        placeholder="滿電里程"
        :rules="[{ required: true, message: '請輸入滿電里程' }]"
      >
        <template #extra>
          KM
        </template>
      </van-field>
      <van-field
        v-model="charger"
        readonly
        label="充電站"
        placeholder="充電站"
        @click="showChargerPicker=!showChargerPicker"
      />
      <van-popup class="picker" :show="showChargerPicker">
        <van-picker
          title="充電站"
          :columns="chargers"
          confirm-button-text="確認"
          cancel-button-text="關閉"
          @change="updateCharger"
          @confirm="showChargerPicker=false"
          @cancel="showChargerPicker=false"
        />
      </van-popup>
      <van-field
        v-model="start"
        label="起點"
        placeholder="起點"
        :rules="[{ required: true, message: '請輸入起點地標' }]"
      />
      <van-field
        v-model="startBatteryLevel"
        label="起點電量"
        placeholder="起點電量"
        :rules="[{ validator: percentageValidator, message:'請輸入0-100的數字'}]"
      />
      <van-field
        v-model="end"
        label="終點"
        placeholder="終點"
        :rules="[{ required: true, message: '請輸入終點地標' }]"
      />
      <van-field
        v-model="endBatteryLevel"
        label="終點電量"
        placeholder="終點電量"
        :rules="[{ validator: percentageValidator, message:'請輸入0-100的數字'}]"
      />
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
          v-model="percentage"
          label="充電%數"
          placeholder="充電%數"
          :rules="[{ validator: percentageValidator, message:'請輸入0-100的數字'}]"
        >
          <template #extra>
            %
          </template>
        </van-field>
        <van-field
          v-model="fee"
          label="充電費用"
          placeholder="充電費用"
          :rules="[{ validator: numValidator, message:'請輸入0-9999999的數字'}]"
        >
          <template #extra>
            TWD
          </template>
        </van-field>
      </van-cell-group>
      <van-field class="submit" readonly>
        <template #button>
          <van-button class="submit-button" @click="createTrip">確認</van-button>
        </template>
      </van-field>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mileage: '',
      charger: '',
      chargers: ['台北圓山', '台北內湖'],
      showChargerPicker: false,
      start: '',
      startBatteryLevel: 0,
      end: '',
      endBatteryLevel: 0,
      isCharge: '0',
      percentage: 0,
      fee: 0,
    };
  },
  methods: {
    percentageValidator(value) {
      return value >= 0 && value <= 100;
    },
    numValidator(value) {
      return value >= 0 && value <= 9999999;
    },
    updateCharger(charger) {
      this.charger = charger;
    },
    createTrip() {
      console.log('create');
    },
  },
  mounted() {
    this.charger = this.chargers[0];
  },
};
</script>
