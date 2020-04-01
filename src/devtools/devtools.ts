const handleShown = (): void => {
  console.log('panel is shown')
}

console.log('loaded');
browser.devtools.panels.create(
  'HttpResponseIjiry',
  'icons/icon.png',
  'panel/panel.html'
).then((newPanel) => {
    console.log('foooo');
  newPanel.onShown.addListener(handleShown);
})
