<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

type MenuOption = {
  id: string
  label: string
}

defineProps<{
  options: MenuOption[]
}>()

defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">Acciones</MenuButton>
    <MenuItems class="absolute right-0 z-20 mt-2 w-40 rounded-md border border-slate-200 bg-white p-1 shadow">
      <MenuItem v-for="option in options" :key="option.id" v-slot="{ active }">
        <button
          class="block w-full rounded px-2 py-1 text-left text-sm"
          :class="active ? 'bg-slate-100' : ''"
          @click="$emit('select', option.id)"
        >
          {{ option.label }}
        </button>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>
