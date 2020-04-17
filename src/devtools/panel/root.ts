import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import { v4 as uuid } from 'uuid'
import MainFrame from './main-frame/main-frame.vue'
import { IFilterConfig, FilterMessage, RefreshMessage } from '../../background'
Vue.use(VueCompositionApi)

// Using Map to delete safely just in case.
export type IHttpResponseTweakConfig = Map<string, IFilterConfig>

const defaultEntry: IFilterConfig = {
  type: 'foo',
  urlPattern: 'https?://example.com',
  matchRegExp: 'Example',
  replaceString: 'MyOwnExample'
}

const defaultData: IHttpResponseTweakConfig = new Map([
  ['hogehoge', Object.assign({}, defaultEntry)]])

const backgroundPort = browser.runtime.connect()
const refreshMessage: RefreshMessage = { messageType: 'refresh' }

const initialConfiguraiton: {filterConf: IHttpResponseTweakConfig} = { filterConf: new Map() }

const saveConfigurations = (configuration: IHttpResponseTweakConfig): void => {
  updateConfigurations(configuration)
  backgroundPort.postMessage(refreshMessage)
}

const setFilterEnabled = ({ filterId, enabled }: {filterId: string, enabled: boolean}): void => {
  const filter = vm.filterConf.get(filterId)
  if (filter !== undefined) {
    const filterMessage: FilterMessage = {
      messageType: 'filter',
      enabled: enabled,
      filter,
      tabId: browser.devtools.inspectedWindow.tabId,
      filterId: filterId
    }
    backgroundPort.postMessage(filterMessage)
  }
}

const deleteConfiguration = (configuration: IHttpResponseTweakConfig, id: string): void => {
  setFilterEnabled({ filterId: id, enabled: false })
  configuration.delete(id)

  updateConfigurations(configuration)
}

const addNewConfiguration = (configuration: IHttpResponseTweakConfig): void => {
  const newFilterId = uuid()
  configuration.set(newFilterId, Object.assign({}, defaultEntry))

  updateConfigurations(configuration)
}

const vm = new Vue({
  el: '#vue_root',
  data: initialConfiguraiton,
  template: `<main-frame :filterConf="filterConf"
    @saveConfigurations="saveConfigurations"
    @setFilterEnabled="setFilterEnabled"
    @deleteConfiguration="deleteConfiguration"
    @addNewConfiguration="addNewConfiguration">
    </main-frame>`,
  methods: {
    saveConfigurations,
    setFilterEnabled,
    deleteConfiguration,
    addNewConfiguration
  },
  components: {
    MainFrame
  }
})

const updateConfigurations = (configuration: IHttpResponseTweakConfig): void => {
  console.log('update')
  console.log(configuration)
  browser.storage.sync.set({
    http_response_tweek_v1: {
      filterConf: Array.from(configuration)
    }
  }).then(refreshConfigurations)
}

const refreshConfigurations = (): void => {
  const getStoredData = browser.storage.sync.get({
    http_response_tweek_v1: {
      filterConf: defaultData
    }
  })

  getStoredData.then((data) => {
    console.log(data)
    vm.filterConf = new Map(data.http_response_tweek_v1.filterConf)
  })

  getStoredData.catch((e) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Storage error: ${e}`)
  })
}

// browser.storage.sync.set({
//   http_response_tweek_v1: {
//     filterConf: Array.from(defaultData)
//   }
// })

refreshConfigurations()

export default vm
