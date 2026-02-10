import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
const formatDate = (date) => date.toISOString().slice(0, 10);
export const useMonthStore = defineStore('month', () => {
    const selectedMonth = ref(formatDate(new Date()).slice(0, 7));
    const entries = ref({});
    const days = computed(() => {
        const [year, month] = selectedMonth.value.split('-').map(Number);
        const totalDays = new Date(year, month, 0).getDate();
        return Array.from({ length: totalDays }, (_, index) => {
            const day = index + 1;
            const date = new Date(year, month - 1, day);
            return {
                day,
                date: formatDate(date)
            };
        });
    });
    const getValue = (foodId, date) => entries.value[`${foodId}|${date}`];
    const cycleValue = (foodId, date) => {
        const key = `${foodId}|${date}`;
        const current = entries.value[key] ?? 0;
        entries.value[key] = current >= 3 ? 0 : current + 1;
    };
    return {
        selectedMonth,
        days,
        getValue,
        cycleValue
    };
});
