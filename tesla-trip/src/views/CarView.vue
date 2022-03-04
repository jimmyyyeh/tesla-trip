<template>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <van-form class="car-form">
      <div class="car-selector">
        <van-field
          v-model="car"
          readonly
          rows="1"
          label="車輛"
          placeholder="車輛"
          @click="isCarPickerShow=!isCarPickerShow"
        />
        <van-button class="create-button" size="small" icon="plus" @click="addCar"/>
        <van-button class="create-button" size="small" icon="minus" @click="removeCar"/>
      </div>
      <van-popup class="picker" :show="isCarPickerShow">
        <van-picker
          title="車輛"
          :columns="cars"
          confirm-button-text="確認"
          cancel-button-text="關閉"
          @change="updateCar"
          @confirm="isCarPickerShow=false"
          @cancel="isCarPickerShow=false"
        />
      </van-popup>
      <van-cell-group inset v-show="isCarInfoShow">
        <van-field
          v-model="carInfo.model"
          readonly
          label="型號"
          placeholder="型號"
          @click="isModelPickerShow=!isModelPickerShow"
        />
        <van-popup class="picker" :show="isModelPickerShow">
          <van-picker
            title="型號"
            :columns="models"
            confirm-button-text="確認"
            cancel-button-text="關閉"
            @change="updateModel"
            @confirm="isModelPickerShow=false"
            @cancel="isModelPickerShow=false"
          />
        </van-popup>
        <van-field
          v-model="carInfo.spec"
          readonly
          label="規格"
          placeholder="規格"
          @click="isSpecPickerShow=!isSpecPickerShow"
        />
        <van-popup class="picker" :show="isSpecPickerShow">
          <van-picker
            title="規格"
            :columns="specs[carInfo.model]"
            confirm-button-text="確認"
            cancel-button-text="關閉"
            @change="updateSpec"
            @confirm="isSpecPickerShow=false"
            @cancel="isSpecPickerShow=false"
          />
        </van-popup>
        <van-field
          v-model="displayDate"
          readonly
          label="出廠日期"
          placeholder="出廠日期"
          @click="isDatePickerShow=!isDatePickerShow"
        />
        <van-popup class="picker" :show="isDatePickerShow">
          <van-datetime-picker
            v-model="carInfo.manufactureDate"
            type="date"
            title="請選擇出廠日期"
            confirm-button-text="確認"
            cancel-button-text="關閉"
            @confirm="isDatePickerShow=false"
            @cancel="isDatePickerShow=false"
          />
        </van-popup>
        <van-field class="submit" readonly>
          <template #button>
            <van-button v-if="isValidate" class="submit-button" @click="upsertCar">
              {{ carInfo.id ? '更新' : '確認' }}
            </van-button>
            <van-button v-else class="submit-button" disabled @click="upsertCar">
              {{ carInfo.id ? '更新' : '確認' }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
    </van-form>
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
      isCarInfoShow: false,
      isValidate: false,
      nickname: '',
      car: '請選擇',
      cars: ['請選擇'],
      carMap: {},
      isCarPickerShow: false,
      carInfo: {
        model: '',
        spec: '',
        manufactureDate: new Date(),
      },
      models: ['請選擇', 'ModelS', 'Model3', 'ModelX', 'ModelY'],
      isModelPickerShow: false,
      specs: {
        ModelS: ['請選擇', 'Model S', 'Model S Plaid'],
        Model3: ['請選擇', 'Real-Wheel Drive', 'Lone Range AWD', 'Performance'],
        ModelX: ['請選擇', 'Model X', 'Model X Plaid'],
        ModelY: ['請選擇', 'Lone Range AWD', 'Performance'],
      },
      isSpecPickerShow: false,
      isDatePickerShow: false,
    };
  },
  computed: {
    displayDate() {
      const date = this.carInfo.manufactureDate;
      if (typeof date === 'string') {
        return date;
      }
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
  },
  watch: {
    carInfo: {
      handler() {
        this.isValidate = this.carInfo.model && this.carInfo.spec;
      },
      deep: true,
    },
  },
  methods: {
    updateCar(car, index) {
      const carID = this.carMap[index - 1];
      this.getCars(carID);
      this.car = car;
      this.isCarInfoShow = true;
    },
    updateModel(model) {
      this.carInfo.model = model;
    },
    updateSpec(spec) {
      this.carInfo.spec = spec;
    },
    getCars(carID) {
      let url = `${process.env.VUE_APP_API}/car`;
      if (carID) {
        url = `${url}/${carID}`;
      }

      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            if (carID) {
              const selectedCar = dataList[0];
              this.carInfo.id = selectedCar.id;
              this.carInfo.model = selectedCar.model;
              this.carInfo.spec = selectedCar.spec;
              this.carInfo.manufactureDate = selectedCar.manufacture_date;
            } else {
              dataList.forEach((data, index) => {
                this.cars.push(`${data.model}/${data.spec}/${data.manufacture_date}`);
                this.carMap[index] = data.id;
              });
            }
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
    upsertCar() {
      let url = `${process.env.VUE_APP_API}/car`;
      let method = 'post';
      let alertMsg = '新增成功';
      if (this.car.id) {
        url = `${url}/${this.carInfo.id}`;
        method = 'put';
        alertMsg = '更新成功';
      }

      const payload = {
        spec: this.carInfo.spec,
        model: this.carInfo.model,
        manufacture_date: this.displayDate,
      };
      this.$http[method](url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.$dialog.alert({
              message: alertMsg,
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => {
              this.getCars();
            });
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            this.getCars();
          }
        });
    },
    addCar() {
      this.isCarInfoShow = true;
    },
    removeCar() {
      const url = `${process.env.VUE_APP_API}/car/${this.carInfo.id}`;
      this.$http.delete(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.$dialog.alert({
              message: '刪除成功',
              confirmButtonText: '確認',
              confirmButtonColor: '#646566',
            }).then(() => {
              this.getCars();
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
    initData() {
      this.getCars();
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
