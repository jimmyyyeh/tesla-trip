<template>
  <nav class="nav-pagination">
    <ul class="pagination">
      <!-- 上一頁 -->
      <li class="page-item" v-if="(pager.page-1)>0">
        <a class="page-link" tabindex="-1" aria-disabled="true"
           @click="refreshMethod(pager.page-1)">&lt;</a>
      </li>
      <li class="page-item disabled" v-else>
        <a class="page-link" tabindex="-1" aria-disabled="true">&lt;</a>
      </li>
      <!-- 中間頁數 -->
      <div class="previous-pages">
        <div class="previous-page" v-for="i in slicePages" :key="i">
          <li class="page-item" v-if="(pager.page-i)>0">
            <a class="page-link" @click="refreshMethod(pager.page-i)">{{ pager.page - i }}</a>
          </li>
        </div>
      </div>
      <div class="current-page">
        <li class="page-item active" aria-current="page">
          <a class="page-link">{{ pager.page }}</a>
        </li>
      </div>
      <div class="next-pages">
        <div class="next-page" v-for="i in slicePages" :key="i">
          <li class="page-item" v-if="(pager.page+i)<=pager.pages">
            <a class="page-link" @click="refreshMethod(pager.page+i)">{{ pager.page + i }}</a>
          </li>
        </div>
      </div>
      <!-- 中間頁數 -->
      <!-- 下一頁 -->
      <li class="page-item" v-if="(pager.page+1)<=pager.pages" @click="refreshMethod(pager.page+1)">
        <a class="page-link">&gt;</a>
      </li>
      <li class="page-item disabled" v-else>
        <a class="page-link">&gt;</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      slicePages: 3,
    };
  },
  props: ['pager', 'refreshMethod'],
};
</script>
