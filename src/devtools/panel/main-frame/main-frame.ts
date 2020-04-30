import { defineComponent, SetupContext, PropType } from '@vue/composition-api'
import { IHttpResponseTweakConfig } from '../root'
import FilterConfigurations from '../filter-configurations/filter-configurations.vue'
import LicenseNotation from '../license-notation/license-notation.vue'

export default defineComponent({
  components: {
    FilterConfigurations,
    LicenseNotation
  },
  props: {
    filterConf: {
      type: Map as PropType<IHttpResponseTweakConfig>
    }
  },
  setup(props, context: SetupContext) {
    const handleSaveConfigurations = (filterConf: IHttpResponseTweakConfig): void => {
      context.emit('saveConfigurations', filterConf)
    }

    const handleSetFilterEnabled = (param: { filterId: string, enabled: boolean }): void => {
      context.emit('setFilterEnabled', param)
    }

    const handleDeleteConfiguration = (filterConf: IHttpResponseTweakConfig, id: string): void => {
      context.emit('deleteConfiguration', filterConf, id)
    }

    const handleAddNewConfiguration = (): void => {
      context.emit('addNewConfiguration', props.filterConf)
    }

    return {
      handleSaveConfigurations,
      handleSetFilterEnabled,
      handleDeleteConfiguration,
      handleAddNewConfiguration
    }
  }
})
