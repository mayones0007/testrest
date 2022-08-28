<template>
<div>
  <div v-if="!isEditMode" class="card">
    <img :src="`http://localhost:3000/img/${dish.name}.jpeg`" alt="dish" class="card-img-top">
    <div class="card-body">
      <h6 class="title">{{dish.name}}</h6>
      <h6 class="title">{{dish.price}}₽</h6>
      <div class="card-text">
        <h6 class="title">{{dish.name}}</h6>
        <p><small class="description">{{dish.description}}</small></p>
        <button @click="this.isEditMode = !this.isEditMode" class="btn btn-success">Редактировать</button>
      </div>
    </div>
  </div>
  <div v-if="isEditMode" class="card">
    <img :src="`http://localhost:3000/img/${dish.name}.jpeg`" alt="dish" class="image card-img-top">
    <input type="file" id="file" ref="file" accept="image/jpeg" @change="handleFilesUploads()" class="file">
    <label for="file" class="label">Изменить фото</label>
    <Select :options="categories" :selectedOption="dish.tag" @select="editCategory"/>
    <input type="text" placeholder="Имя" class="form-control" v-model="editedDish.name">
    <Select :options="regions" :selectedOption="dish.region"  @select="editRegion"/>
    <input type="text" placeholder="Описание" class="form-control" v-model="editedDish.description">
    <input type="text" placeholder="Цена" class="form-control" v-model="editedDish.price">
    <button @click="updateDish" class="btn btn-info">Сохранить</button>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import Select from './Select.vue'
import { categories, regions } from '../select-options.data'
export default {
  props: ['dish'],
  components: {
    Select
  },
  data: () => ({
    categories: categories,
    regions: regions,
    editedDish: {
      name: '',
      tag: '',
      region: '',
      description: '',
      price: '',
    },
    file: '',
    isEditMode: false,
  }),
  methods:{
    async updateDish(){
      try {
        const formData = new FormData()
        formData.append('id', Number(this.dish.id))
        formData.append('name', this.editedDish.name)
        formData.append('tag', this.editedDish.tag)
        formData.append('region', this.editedDish.region)
        formData.append('description', this.editedDish.description)
        formData.append('price', this.editedDish.price)
        formData.append('image', this.file)
        await axios.patch('http://localhost:3000/food', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        })
        await axios.get('http://localhost:3000/food')
      } catch(e) {
        alert("Ошибка HTTP: " + e.response.data.message)
      }
      this.isEditMode = false;
    },
    handleFilesUploads(){
      this.file = this.$refs.file.files[0];
    },
    editCategory(value) {
      this.editedDish.tag = value;
    },
    editRegion(value) {
      this.editedDish.region = value;
    },
    getDictionaryItem(dict, id) {
      return (dict.find(item =>  item.id === id )).name
    }
  },

  mounted() {
    this.editedDish = this.dish;
  }
}
</script>

<style>
.card-img-top {
  height: 250px;
  object-fit: cover;
}
.card {
  width: 18rem;
  position: relative;
}
.card-text {
  padding: 10px;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index:1;
  background-color: white;
  transition: 100ms;
}
.card:hover .card-text {
  opacity: 1;
}
.title{
  font-weight: 700;
}
.description{
  color:rgb(128, 128, 128);
}
.btn {
  width: 100%;
}

.file{
  display: none;
}
.image {
  position: relative;
}
.label {
  position: absolute;
  top: 23%;
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: white;
  background-color: rgba(0, 0, 0, 0.459);
}
</style>