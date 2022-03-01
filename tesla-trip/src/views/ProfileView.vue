<style>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-form {
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
    <van-form class="profile-form">
      <van-field
        v-model="name"
        label="姓名"
        placeholder="姓名"
        :rules="[{ required: true, message: '請輸入姓名' }]"
      />
      <van-field
        v-model="model"
        readonly
        label="型號"
        placeholder="型號"
        @click="showModelPicker=!showModelPicker"
      />
      <van-popup class="picker" :show="showModelPicker">
        <van-picker
          title="型號"
          :columns="models"
          confirm-button-text="確認"
          cancel-button-text="關閉"
          @change="updateModel"
          @confirm="showModelPicker=false"
          @cancel="showModelPicker=false"
        />
      </van-popup>
      <van-field
        v-model="spec"
        readonly
        label="規格"
        placeholder="規格"
        @click="showSpecPicker=!showSpecPicker"
      />
      <van-popup class="picker" :show="showSpecPicker">
        <van-picker
          title="規格"
          :columns="specs[model]"
          confirm-button-text="確認"
          cancel-button-text="關閉"
          @change="updateSpec"
          @confirm="showSpecPicker=false"
          @cancel="showSpecPicker=false"
        />
      </van-popup>
      <van-field
        v-model="displayDate"
        readonly
        label="出廠日期"
        placeholder="出廠日期"
        @click="showDatePicker=!showDatePicker"
      />
      <van-popup class="picker" :show="showDatePicker">
        <van-datetime-picker
          v-model="manufactureDate"
          type="date"
          title="請選擇出廠日期"
          confirm-button-text="確認"
          cancel-button-text="關閉"
          @confirm="showDatePicker=false"
          @cancel="showDatePicker=false"
        />
      </van-popup>
      <van-field class="submit" readonly>
        <template #button>
          <van-button class="submit-button" @click="updateProfile">確認</van-button>
        </template>
      </van-field>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      models: ['ModelS', 'Model3', 'ModelX', 'ModelY'],
      model: 'Model3',
      showModelPicker: false,
      specs: {
        ModelS: ['Model S', 'Model S Plaid'],
        Model3: ['Real-Wheel Drive', 'Lone Range AWD', 'Performance'],
        ModelX: ['Model X', 'Model X Plaid'],
        ModelY: ['Lone Range AWD', 'Performance'],
      },
      spec: 'SR+',
      showSpecPicker: false,
      manufactureDate: new Date(),
      showDatePicker: false,
    };
  },
  computed: {
    displayDate() {
      return `${this.manufactureDate.getFullYear()}-${this.manufactureDate.getMonth() + 1}-${this.manufactureDate.getDate()}`;
    },
  },
  methods: {
    updateModel(model) {
      this.model = model;
    },
    updateSpec(spec) {
      this.spec = spec;
    },
    updateProfile() {
      console.log('update');
    },
  },
  mounted() {
    this.spec = this.specs[this.model][0];
  },
};
</script>
