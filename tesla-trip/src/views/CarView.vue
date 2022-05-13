<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="container">
      <div class="car-form">
        <div class="field">
          <div class="car-selector selector">
            <div class="toolbar">
              <button class="image-button" @click="isCarInfoShow=!isCarInfoShow; carIndex=0">
                <img
                  src="https://i.imgur.com/WRvX8iL.png" alt="edit"/>
              </button>
              <button class="image-button" @click="confirmRemoveCar" v-show="carID">
                <img
                  src="https://i.imgur.com/ECKUIzz.png" alt="delete"/>
              </button>
            </div>
            <div class="car-group">
              <label class="selector-label" for="cars">車輛:</label>
              <select name="cars" id="cars" v-model="carIndex">
                <option v-for="(car, index) in cars" :key="index" :value="index">{{ car }}</option>
              </select>
            </div>
          </div>
          <div class="car-info" :style="{visibility: isCarInfoShow ? 'visible' : 'hidden'}">
            <div class="manufacture-date-selector selector">
              <label class="selector-label" for="manufacture-date">出廠日期:</label>
              <input type="date" id="manufacture-date" v-model="carInfo.manufactureDate">
            </div>
            <div class="model-selector selector">
              <label class="selector-label" for="models">型號:</label>
              <select name="models" id="models" v-model="carInfo.model">
                <option v-for="(model, index) in models" :key="index" :value="model">{{
                    model
                  }}
                </option>
              </select>
            </div>
            <div class="spec-selector selector" v-show="carInfo.model !== '請選擇'">
              <label class="selector-label" for="specs">規格:</label>
              <select name="specs" id="specs" v-model="carInfo.spec">
                <option v-for="(spec, index) in specs[carInfo.model]" :key="index" :value="spec">{{
                    spec
                  }}
                </option>
              </select>
            </div>
            <div class="upload-image">
              <input class="upload" id="upload" name="upload" type="file" accept="image/*"
                     @change="previewImage"/>
              <button class="image-button" onclick="document.getElementById('upload').click();" v-show="!carID && !carInfo.hasImage && carInfo.model !== '請選擇'">
                <img
                  src="https://i.imgur.com/Jz0PlYK.png" alt="edit"/>
              </button>
            </div>
          </div>
        </div>
        <div class="preview-image">
          <img :src="preview" alt="preview" v-show="carInfo.hasImage && isCarInfoShow"/>
        </div>
        <div class="button-group" v-show="isCarInfoShow">
          <button v-if="isValidate" class="default-button" v-show="!carID"
                  @click="insertCar">確認
          </button>
          <button v-else class="default-button" disabled v-show="!carID">
            確認
          </button>
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
        file: null,
        hasImage: false,
      },
      models: ['請選擇'],
      specs: {
        ModelS: ['請選擇'],
        Model3: ['請選擇'],
        ModelX: ['請選擇'],
        ModelY: ['請選擇'],
      },
      image: {
        name: null,
        size: null,
      },
      preview: '',
    };
  },
  watch: {
    carIndex(value) {
      if (value === 0) {
        this.carID = null;
        this.carInfo = {
          model: '請選擇',
          spec: '請選擇',
          manufactureDate: formatDate(new Date()),
        };
        this.isCarInfoShow = false;
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
    getCarModels() {
      const url = `${process.env.VUE_APP_API}/car/car-model`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const dataList = res.data.data;
            dataList.forEach((data) => {
              if (!this.models.includes(data.model)) {
                this.models.push(data.model);
                this.specs[data.model] = [data.spec];
              } else {
                this.specs[data.model].push(data.spec);
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
              this.carInfo.hasImage = selectedCar.has_image;
              this.preview = selectedCar.has_image ? `${process.env.VUE_APP_IMAGE_DOMAIN}/image/car/${selectedCar.id}.jpg` : 'https://i.imgur.com/mhuHPIG.png';
            } else {
              this.cars = ['請選擇'];
              this.carMap = {};
              dataList.forEach((data, index) => {
                this.cars.push(data.car);
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
        file: this.carInfo.file,
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
            const refs = this.$refs;
            this.alert.title = '失敗';
            this.alert.message = '新增車輛失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
    removeCar() {
      const url = `${process.env.VUE_APP_API}/car/${this.carInfo.id}`;
      this.$http.delete(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '車輛已刪除';
            this.alert.confirmFunction = this.getCars;
            this.carIndex = 0;
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '刪除車輛失敗 請重新操作';
            refs.alertModal.showModal();
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
    previewImage(event) {
      const input = event.target;
      if (input.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.preview = e.target.result;
          this.carInfo.file = e.target.result; // base64
          this.carInfo.hasImage = true;
        };
        this.image = input.files[0];
        reader.readAsDataURL(input.files[0]);
      }
    },
    clearImage() {
      this.image = {
        name: null,
        size: null,
      };
      this.preview = '';
    },
    initData() {
      this.getCarModels();
      this.getCars();
    },
  },
};
</script>
