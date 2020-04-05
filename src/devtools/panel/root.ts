import Vue from 'vue'
import FilterField from './filter-field/filter-field.vue'

interface FilterConfig {
  type: string // string for now.
  domain: string
}

interface HttpResponseTweakConfig {
  filters?: FilterConfig[]
};

const getStoredData = browser.storage.sync.get({
  http_response_tweek_v1: {
    // filters: [{
    //   type: 'foo',
    //   domain: 'bar'
    // }, {
    //   type: 'foo',
    //   domain: 'baz'
    // }]
    filters: []
  }
})

const initialConfiguraiton: HttpResponseTweakConfig = { filters: [{ type: '', domain: '' }] }
const vm = new Vue({
  el: '#main_frame',
  data: initialConfiguraiton,
  template: '<div><filter-field v-for="filter in filters" :key="filter.domain"></filter-field><div>+ button</div></div>',
  components: {
    FilterField
  }
})

getStoredData.then((data) => {
  console.log(JSON.stringify(data))
  vm.filters = data.http_response_tweek_v1.filters as FilterConfig[]
  console.log('vm:' + JSON.stringify(vm.filters))
  console.log('cc:' + JSON.stringify(initialConfiguraiton.filters))
})

getStoredData.catch((e) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`Storage error: ${e}`)
})

console.log('root loaded')
export default vm
