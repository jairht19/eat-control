import { storeToRefs } from 'pinia';
import { useFoodStore } from '@/app/stores/food.store';
import { useMonthStore } from '@/app/stores/month.store';
import StickyHeader from './StickyHeader.vue';
import TableCell from './TableCell.vue';
const monthStore = useMonthStore();
const foodStore = useFoodStore();
const { days } = storeToRefs(monthStore);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "overflow-auto rounded-lg border border-slate-200 bg-white" },
});
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.table, __VLS_intrinsics.table)({
    ...{ class: "w-full border-collapse" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-collapse']} */ ;
const __VLS_0 = StickyHeader;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    labels: (__VLS_ctx.days.map((day) => day.day)),
}));
const __VLS_2 = __VLS_1({
    labels: (__VLS_ctx.days.map((day) => day.day)),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
for (const [food] of __VLS_vFor((__VLS_ctx.foodStore.foods))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
        key: (food.id),
        ...{ class: "border-t border-slate-100" },
    });
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-slate-100']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
        ...{ class: "sticky left-0 z-10 bg-white px-3 py-2 text-sm font-medium text-slate-700" },
    });
    /** @type {__VLS_StyleScopedClasses['sticky']} */ ;
    /** @type {__VLS_StyleScopedClasses['left-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-slate-700']} */ ;
    (food.name);
    for (const [day] of __VLS_vFor((__VLS_ctx.days))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            key: (day.date),
            ...{ class: "px-1 py-1 text-center" },
        });
        /** @type {__VLS_StyleScopedClasses['px-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        const __VLS_5 = TableCell;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
            ...{ 'onCycle': {} },
            value: (__VLS_ctx.monthStore.getValue(food.id, day.date) ?? 0),
        }));
        const __VLS_7 = __VLS_6({
            ...{ 'onCycle': {} },
            value: (__VLS_ctx.monthStore.getValue(food.id, day.date) ?? 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        let __VLS_10;
        const __VLS_11 = ({ cycle: {} },
            { onCycle: (...[$event]) => {
                    __VLS_ctx.monthStore.cycleValue(food.id, day.date);
                    // @ts-ignore
                    [days, days, foodStore, monthStore, monthStore,];
                } });
        var __VLS_8;
        var __VLS_9;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
