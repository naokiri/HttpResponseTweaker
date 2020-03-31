console.log('Hello World from your main file!')

const listener = (details: { requestId: string }): object => {
  const filter: StreamFilter = browser.webRequest.filterResponseData(details.requestId) as StreamFilter

  const decoder = new TextDecoder('utf-8')
  const encoder = new TextEncoder()

  filter.ondata = (event: { data: BufferSource }) => {
    let str = decoder.decode(event.data, { stream: true })
    // Just change any instance of Example in the HTTP response
    // to WebExtension Example.
    str = str.replace(/Example/g, 'WebExtension Example')
    filter.write(encoder.encode(str))
    filter.disconnect()
  }

  return {}
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  { urls: ['https://example.com/*'], types: ['main_frame'] },
  ['blocking']
)
