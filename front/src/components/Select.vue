<template>
  <select name="tag" v-model="value" class="form-select" @change="$emit('select', $event.target.value)">
    <option v-for="option in options" :key="option.tag" :value="option.id">{{option.name}}</option>
  </select>
</template>
<script>
export default {
  props: ['options', 'selectedOption'],
  data() {
    return {
      value: ''
    }
  },

  mounted() {
    this.value = this.selectedOption
  }
}
</script>

