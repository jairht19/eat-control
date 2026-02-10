import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Menu | typeof __VLS_components.Menu} */
Menu;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    as: "div",
    ...{ class: "relative inline-block text-left" },
}));
const __VLS_2 = __VLS_1({
    as: "div",
    ...{ class: "relative inline-block text-left" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5 = {};
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type {typeof __VLS_components.MenuButton | typeof __VLS_components.MenuButton} */
MenuButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
var __VLS_10;
let __VLS_13;
/** @ts-ignore @type {typeof __VLS_components.MenuItems | typeof __VLS_components.MenuItems} */
MenuItems;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ class: "absolute right-0 z-20 mt-2 w-40 rounded-md border border-slate-200 bg-white p-1 shadow" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "absolute right-0 z-20 mt-2 w-40 rounded-md border border-slate-200 bg-white p-1 shadow" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-40']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
const { default: __VLS_18 } = __VLS_16.slots;
for (const [option] of __VLS_vFor((__VLS_ctx.options))) {
    let __VLS_19;
    /** @ts-ignore @type {typeof __VLS_components.MenuItem | typeof __VLS_components.MenuItem} */
    MenuItem;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        key: (option.id),
    }));
    const __VLS_21 = __VLS_20({
        key: (option.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    {
        const { default: __VLS_24 } = __VLS_22.slots;
        const [{ active }] = __VLS_vSlot(__VLS_24);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.$emit('select', option.id);
                    // @ts-ignore
                    [options, $emit,];
                } },
            ...{ class: "block w-full rounded px-2 py-1 text-left text-sm" },
            ...{ class: (active ? 'bg-slate-100' : '') },
        });
        /** @type {__VLS_StyleScopedClasses['block']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        (option.label);
        // @ts-ignore
        [];
        __VLS_22.slots['' /* empty slot name completion */];
    }
    var __VLS_22;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_16;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
