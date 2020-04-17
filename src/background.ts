export interface IFilterConfig {
  type: string // string for now.
  urlPattern: string
  matchRegExp: string
  replaceString: string
}

interface IStoredFilter extends IFilterConfig {
  enabled: boolean
  tabId: number
}

const storedFilters: {[key: string]: IStoredFilter} = {}

const getMatchingEnabledFilters = (tabId: number, url: string): IStoredFilter[] => {
  return Object.values(storedFilters).filter(filterConfig => filterConfig.enabled && filterConfig.tabId === tabId && url.match(filterConfig.urlPattern))
}

const getGlobalRequestListener = (): ((details: {requestId: string, tabId: number, url: string}) => void) => {
  return (details: {requestId: string, tabId: number, url: string}): void => {
    const applyingFilters = getMatchingEnabledFilters(details.tabId, details.url)

    const filter: StreamFilter = browser.webRequest.filterResponseData(details.requestId) as StreamFilter

    const decoder = new TextDecoder('utf-8')
    const encoder = new TextEncoder()

    filter.ondata = (event: {data: BufferSource}) => {
      let rawStr = decoder.decode(event.data, { stream: true })
      applyingFilters.forEach((applyingFilter) => {
        rawStr = rawStr.replace(new RegExp(applyingFilter.matchRegExp, 'g'), applyingFilter.replaceString)
      })
      filter.write(encoder.encode(rawStr))
      filter.disconnect()
    }
  }
}

let currentListener = getGlobalRequestListener()

const updateFilter = (filter: IFilterConfig, enabled: boolean, tabId: number, filterId: string): void => {
  storedFilters[filterId] = { ...filter, tabId, enabled }
  refreshFilter()
  console.log(storedFilters)
}

const refreshFilter = (): void => {
  browser.webRequest.onBeforeRequest.removeListener(currentListener)
  currentListener = getGlobalRequestListener()
  browser.webRequest.onBeforeRequest.addListener(
    currentListener,
    { urls: ['http://*/', 'https://*/'], types: ['main_frame'] },
    ['blocking']
  )
}

const BackgroundMessageType = ['filter', 'refresh'] as const
export type BackgroundMessageType = typeof BackgroundMessageType[number]

export interface FilterMessage {messageType: 'filter', enabled: boolean, filter: IFilterConfig, tabId: number, filterId: string}
export interface RefreshMessage {messageType: 'refresh'}

type BackgroundMessage = FilterMessage | RefreshMessage

browser.runtime.onConnect.addListener((p: browser.runtime.Port) => {
  p.onMessage.addListener((rawMessage) => {
    const message = rawMessage as BackgroundMessage
    switch (message.messageType) {
      case 'filter':
        updateFilter(message.filter, message.enabled, message.tabId, message.filterId)
        break
      case 'refresh':
        refreshFilter()
        break
    }
  })
})

browser.webRequest.onBeforeRequest.addListener(
  currentListener,
  { urls: ['http://*/', 'https://*/'], types: ['main_frame'] },
  ['blocking']
)
