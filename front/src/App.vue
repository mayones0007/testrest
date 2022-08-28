<template>
  <div class="page">
    <div class="filters">
      <div class="filters__select">Категория:<Select :options="categories" v-model="selectedTag"/></div>
      <div class="filters__select">Страна:<Select :options="regions" v-model="selectedRegion"/></div>
    </div>
    <div class="dishes">
      <DishCard 
        v-for="dish in this.currentDishes"
        :key="dish.id"
        :dish="dish"
      />
    </div>
    <form class="form">
      <h3>Добавить новое блюдо</h3>
      <input type="text" placeholder="Имя" v-model="name" class="form-control">
      <div class="filters">
        <div class="filters__select">Категория<Select :options="categories" v-model="tag"/></div>
        <div class="filters__select">Страна<Select :options="regions" v-model="region" placeholder="fff"/></div>
      </div>
      <input type="text" placeholder="Цена" v-model="price" class="form-control">
      <textarea placeholder="Описание" v-model="description" class="form-control"></textarea>
      <input class="file" type="file" id="file" ref="file" accept="image/jpeg" @change="handleFilesUploads()">
      <label class="btn btn-info" for="file">Добавить фото</label>
      <button @click="newDish" class="btn btn-success">Добавить блюдо</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import DishCard from './components/DishCard.vue'
import Select from './components/Select.vue'
import { categories, regions } from './select-options.data'

export default {
  name: 'App',
  components: {
    DishCard,
    Select
  },
  data: () => ({
    categories: categories,
    regions: regions,
    dishes: [],
    name: '',
    tag: '',
    region: '',
    description: '',
    price:'',
    file: '',
    selectedTag: '',
    selectedRegion: '',
  }),
  computed: {
    currentDishes() {
      if(this.selectedRegion && this.selectedTag){
        return this.dishes.filter((item) => item.region === this.selectedRegion && item.tag === this.selectedTag)
      } else if (this.selectedRegion){
        return this.dishes.filter((item) => item.region === this.selectedRegion)
      } else if (this.selectedTag) {
        return this.dishes.filter((item) => item.tag === this.selectedTag)
      }

      return this.dishes
    }
  },
  methods:{
    async getDishes() {
      try {
        const response = await axios.get('http://localhost:3000/food')
        this.dishes = response.data
      } catch(e) {
        alert("Ошибка HTTP: " + e.response.data.message)
      }
    },
    async newDish(){
      try {
        const formData = new FormData()
        formData.append('name', this.name)
        formData.append('tag', this.tag)
        formData.append('region', this.region)
        formData.append('price', this.price)
        formData.append('description', this.description)
        formData.append('image', this.file)
        await axios.post('http://localhost:3000/food', formData)
      } catch(e) {
        alert("Ошибка HTTP: " + e.response.data.message)
        this.name = this.tag = this.region = this.description = this.file = ''
      }
    },
    handleFilesUploads(){
      this.file = this.$refs.file.files[0];
    },
  },

  created(){
    this.getDishes()
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font: 1rem/1.5 var(--bs-font-sans-serif);
  margin-top: 60px;
}
.page {
  padding: 5%;

}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.filters__select {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  gap: 5px;
}
 

.dishes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 40px;
  margin: 40px 0;
}

.form {
  display: grid;
  gap: 20px;
  margin-top: 60px;
}

.file {
  display: none;
}
</style>
