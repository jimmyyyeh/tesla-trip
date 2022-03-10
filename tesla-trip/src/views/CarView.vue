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
            <input type="button" class="create-button" v-show="!isCarInfoShow" @click="isCarInfoShow=!isCarInfoShow" value="+">
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
            <label class="selector-label" for="specs">- 規格:</label>
            <select name="specs" id="specs" v-model="carInfo.spec">
              <option v-for="(spec, index) in specs[carInfo.model]" :key="index" :value="spec">{{
                  spec
                }}
              </option>
            </select>
          </div>
          <div class="button-group">
            <button class="default-button" v-show="isCarInfoShow && carID" @click="confirmRemoveCar">刪除</button>
            <button v-if="isValidate" class="default-button" v-show="!carID"
                    @click="insertCar">新增
            </button>
            <button v-else class="default-button" disabled v-show="!carID">
              新增
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';
import { formatDate } from '@/utils/tools';

export default {
  mixins: [authMixins, pageMixins],
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
        manufactureDate: formatDate(new Date()),
      },
      models: ['請選擇', 'ModelS', 'Model3', 'ModelX', 'ModelY'],
      specs: {
        ModelS: ['請選擇', 'Model S', 'Model S Plaid'],
        Model3: ['請選擇', 'Real-Wheel Drive', 'Long Range AWD', 'Performance'],
        ModelX: ['請選擇', 'Model X', 'Model X Plaid'],
        ModelY: ['請選擇', 'Long Range AWD', 'Performance'],
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
          manufactureDate: formatDate(new Date()),
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
          }
        });
    },
    insertCar() {
      const url = `${process.env.VUE_APP_API}/car`;
      const payload = {
        spec: this.carInfo.spec,
        model: this.carInfo.model,
        manufacture_date: this.carInfo.manufactureDate,
      };
      this.$http.post(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '新增成功';
            this.alert.confirmFunction = this.getCars;
            refs.confirmModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    returnCar() {
      this.$router.push('/car');
    },
    removeCar() {
      const url = `${process.env.VUE_APP_API}/car/${this.carInfo.id}`;
      this.$http.delete(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '車輛已刪除';
            this.alert.confirmFunction = this.returnCar;
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    confirmRemoveCar() {
      const url = `${process.env.VUE_APP_API}/car/deduct-point/${this.carInfo.id}`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const total = res.data.data.total;
            const refs = this.$refs;
            this.alert.title = '確認刪除';
            this.alert.message = `刪除車輛會扣除 ${total}點 點數, 確定要刪除車輛嗎?`;
            this.alert.isCancelShow = true;
            this.alert.confirmFunction = this.removeCar;
            refs.confirmModal.showModal();
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
};
</script>
