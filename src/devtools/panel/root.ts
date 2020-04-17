import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import MainFrame from './main-frame/main-frame.vue'
import { IFilterConfig, FilterMessage, RefreshMessage } from '../../background'
Vue.use(VueCompositionApi)

export interface IHttpResponseTweakConfig {
  [id: string]: IFilterConfig
}

const defaultData: IHttpResponseTweakConfig = {
  hogehoge: {
    type: 'foo',
    urlPattern: 'https?://example.com',
    matchRegExp: 'Example',
    replaceString: 'MyOwnExample'
  },
  fugafuga: {
    type: 'foo',
    urlPattern: 'baz',
    matchRegExp: '',
    replaceString: ''
  }
}

const getStoredData = browser.storage.sync.get({
  http_response_tweek_v1: {
    filterConf: defaultData
  }
})

const initialConfiguraiton: {filterConf: IHttpResponseTweakConfig} = { filterConf: {} }

const saveConfigurations = (configuration: IHttpResponseTweakConfig): void => {
  console.log(JSON.stringify(configuration))
  browser.storage.sync.set({
    http_response_tweek_v1: {
      filterConf: configuration
    }
  })
  const refreshMessage: RefreshMessage = { messageType: 'refresh' }
  backgroundPort.postMessage(refreshMessage)
}

const backgroundPort = browser.runtime.connect()

const setFilterEnabled = ({ filterId, enabled }: {filterId: string, enabled: boolean}): void => {
  console.log('setFilterEnabled')
  console.log(filterId)
  console.log(enabled)
  const filterMessage: FilterMessage = {
    messageType: 'filter',
    enabled: enabled,
    filter: vm.filterConf[filterId],
    tabId: browser.devtools.inspectedWindow.tabId,
    filterId: filterId
  }
  backgroundPort.postMessage(filterMessage)
}

const vm = new Vue({
  el: '#vue_root',
  data: initialConfiguraiton,
  template: '<main-frame :filterConf="filterConf" @saveConfigurations="saveConfigurations" @setFilterEnabled="setFilterEnabled"></main-frame>',
  methods: {
    saveConfigurations,
    setFilterEnabled
  },
  components: {
    MainFrame
  }
})

getStoredData.then((data) => {
  // browser.storage.sync.set({
  //   http_response_tweek_v1: {
  //     filterConf: defaultData
  //   }
  // })
  vm.filterConf = data.http_response_tweek_v1.filterConf
})

getStoredData.catch((e) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`Storage error: ${e}`)
})

export default vm
