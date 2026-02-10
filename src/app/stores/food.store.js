import { ref } from 'vue';
import { defineStore } from 'pinia';
export const useFoodStore = defineStore('food', () => {
    const foods = ref([
        { id: 'huevos', name: 'Huevos', category: 'Desayuno' },
        { id: 'arroz', name: 'Arroz', category: 'Comida' },
        { id: 'fruta', name: 'Fruta', category: 'Snack' }
    ]);
    const addFood = (name, category) => {
        const id = `${name.toLowerCase().replaceAll(' ', '-')}-${Date.now()}`;
        foods.value.push({ id, name, category });
    };
    return {
        foods,
        addFood
    };
});
