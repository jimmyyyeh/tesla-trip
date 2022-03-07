<template>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="container">
      <div class="car-form">
        <div class="car-selector selector">
          <div class="car-group">
            <label class="selector-label" for="cars">車輛:</label>
            <select name="cars" id="cars" v-model="carIndex">
              <option v-for="(car, index) in cars" :key="index" :value="index">{{ car }}</option>
            </select>
          </div>
          <div class="button-group">
            <button class="default-button" v-show="!isCarInfoShow"
                    @click="isCarInfoShow=!isCarInfoShow">+
            </button>
          </div>
        </div>
        <div class="car-info" v-show="isCarInfoShow">
          <div class="manufacture-date-selector selector">
            <label class="selector-label" for="manufacture-date">- 出廠日期:</label>
            <input type="date" id="manufacture-date" v-model="carInfo.manufactureDate">
          </div>
          <div class="model-selector selector">
            <label class="selector-label" for="models">- 型號:</label>
            <select name="models" id="models" v-model="carInfo.model">
              <option v-for="(model, index) in models" :key="index" :value="model">{{
                  model
                }}
              </option>
            </select>
          </div>
          <div class="spec-selector selector" v-show="carInfo.model !== '請選擇'">
            <label class="selector-label" for="specs">* 規格:</label>
            <select name="specs" id="specs" v-model="carInfo.spec">
              <option v-for="(spec, index) in specs[carInfo.model]" :key="index" :value="spec">{{
                  spec
                }}
              </option>
            </select>
          </div>
          <div class="button-group">
            <button class="default-button" v-show="isCarInfoShow" @click="removeCar"> 刪除</button>
            <button v-if="isValidate" class="default-button" v-show="isCarInfoShow"
                    @click="upsertCar">{{ carID ? '更新' : '新增' }}
            </button>
            <button v-else class="default-button" disabled v-show="isCarInfoShow" @click="upsertCar">
              {{ carID ? '更新' : '新增' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authMixins from '@/mixins/authMixins';

export default {
  mixins: [authMixins],
  data() {
    return {
      isValidate: false,
      isCarInfoShow: false,
      nickname: '',
      carIndex: 0,
      carID: null,
      cars: ['請選擇'],
      carMap: {},
      carInfo: {
        model: '請選擇',
        spec: '請選擇',
        manufactureDate: this.formatDate(new Date()),
      },
      models: ['請選擇', 'ModelS', 'Model3', 'ModelX', 'ModelY'],
      specs: {
        ModelS: ['請選擇', 'Model S', 'Model S Plaid'],
        Model3: ['請選擇', 'Real-Wheel Drive', 'Lone Range AWD', 'Performance'],
        ModelX: ['請選擇', 'Model X', 'Model X Plaid'],
        ModelY: ['請選擇', 'Lone Range AWD', 'Performance'],
      },
    };
  },
  watch: {
    carIndex(value) {
      if (value === '請選擇') {
        this.carID = null;
        this.carInfo = {
          model: '請選擇',
          spec: '請選擇',
          manufactureDate: this.formatDate(new Date()),
        };
      } else {
        this.carID = this.carMap[value - 1];
        this.getCars(this.carID);
        this.isCarInfoShow = true;
      }
    },
    carInfo: {
      handler() {
        const isModelSelected = this.carInfo.model && this.carInfo.model !== '請選擇';
        const isSpecSelected = this.carInfo.spec && this.carInfo.spec !== '請選擇';
        this.isValidate = isModelSelected && isSpecSelected;
      },
      deep: true,
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
              this.cars = ['請選擇'];
              this.carMap = {};
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
      if (this.carID) {
        url = `${url}/${this.carID}`;
        method = 'put';
        alertMsg = '更新成功';
      }

      const payload = {
        spec: this.carInfo.spec,
        model: this.carInfo.model,
        manufacture_date: this.carInfo.manufactureDate,
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
            this.refreshToken(response.data, response.data.error_code, this.upsertCar);
          }
        });
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
