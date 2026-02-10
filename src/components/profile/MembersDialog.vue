<script setup lang="ts">
import BaseDialog from '@/components/base/BaseDialog.vue'

defineProps<{
  open: boolean
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <BaseDialog :open="open" title="Miembros" @close="$emit('close')">
    <p class="text-sm text-slate-600">Gestión de miembros del perfil (pendiente de Firestore).</p>
  </BaseDialog>
</template>
