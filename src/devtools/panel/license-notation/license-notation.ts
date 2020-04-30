import { defineComponent } from '@vue/composition-api'

// TODO: Something doesn't work with baseUrl here.
import genLicensesJson from '../../../resources/licenses-gen.json'
import staticLicenseJson from '../../../resources/licenses.json'

export default defineComponent({
  setup(props) {
    return {
      licenses: Object.assign(genLicensesJson, staticLicenseJson)
    }
  }
})
