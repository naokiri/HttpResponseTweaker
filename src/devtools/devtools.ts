const theme = browser.devtools.panels.themeName

const iconPath = (theme === 'dark')
  ? 'icons/offline_bolt-white-48dp.svg'
  : 'icons/offline_bolt-black-48dp.svg'

browser.devtools.panels.create(
  'HttpResponseTweaker',
  iconPath,
  'panel/root.html'
)
