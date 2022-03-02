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
        v-model="spec"
        readonly
        label="規格"
        placeholder="規格"
        @click="isSpecPickerShow=!isSpecPickerShow"
      />
      <van-popup class="picker" :show="isSpecPickerShow">
        <van-picker
          title="規格"
          :columns="specs[model]"
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
          v-model="manufactureDate"
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
      model: '',
      isModelPickerShow: false,
      specs: {
        ModelS: ['Model S', 'Model S Plaid'],
        Model3: ['Real-Wheel Drive', 'Lone Range AWD', 'Performance'],
        ModelX: ['Model X', 'Model X Plaid'],
        ModelY: ['Lone Range AWD', 'Performance'],
      },
      spec: '',
      isSpecPickerShow: false,
      manufactureDate: new Date(),
      isDatePickerShow: false,
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
    this.model = this.models[0];
    this.spec = this.specs[this.model][0];
  },
};
</script>
