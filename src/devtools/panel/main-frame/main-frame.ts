import { defineComponent, reactive, SetupContext, PropType } from '@vue/composition-api'
import { IHttpResponseTweakConfig } from '../root'
import Vue from 'vue'

export default defineComponent({
  props: {
    filterConf: {
      type: Map as PropType<IHttpResponseTweakConfig>
    }
  },
  setup(props, context: SetupContext) {
    const state = reactive<{editingId: string | null, enabledState: {[key: string]: boolean}}>(
      {
        editingId: null,
        enabledState: {}
      }
    )

    const startEditing = (id: string): void => {
      state.editingId = id
      Vue.set(state.enabledState, id, false)
    }

    const saveEdited = (id: string): void => {
      state.editingId = null
      context.emit('saveConfigurations', props.filterConf)
    }

    const handleEditSave = (id: string, event: Event): void => {
      const isNewEdit = id !== state.editingId
      if (state.editingId !== null) {
        saveEdited(state.editingId)
      }
      if (isNewEdit) {
        startEditing(id)
      }
    }

    const handleToggleEnabled = (id: string, event: { target: HTMLInputElement }): void => {
      state.enabledState[id] = event.target.checked
      context.emit('setFilterEnabled', { filterId: id, enabled: event.target.checked })
    }

    const isEnabled = (id: string): boolean => {
      return state.enabledState[id] ?? false
    }

    const handleDeleteFilter = (id: string): void => {
      state.editingId = null
      context.emit('deleteConfiguration', props.filterConf, id)
    }

    const handleAddFilter = (): void => {
      context.emit('addNewConfiguration', props.filterConf)
    }

    return {
      state,
      handleEditSave,
      handleToggleEnabled,
      isEnabled,
      handleDeleteFilter,
      handleAddFilter
    }
  }
})
