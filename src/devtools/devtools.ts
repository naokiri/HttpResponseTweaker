const handleShown = (): void => {
  console.log('panel is shown')
}

console.log('loaded')
browser.devtools.panels.create(
  'HttpResponseIjiry',
  'icons/icon.png',
  'panel/root.html'
).then((newPanel) => {  
  newPanel.onShown.addListener(handleShown)
})
