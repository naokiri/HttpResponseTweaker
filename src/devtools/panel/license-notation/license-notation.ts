import { defineComponent } from '@vue/composition-api'

// TODO: Something doesn't work with baseUrl here.
import licensesJson from '../../../gen/licenses.json'

export default defineComponent({
  setup(props) {
    return {
      licenses: licensesJson
    }
  }
})
