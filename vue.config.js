module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.anonymorse.fund',
        productName: 'Duck Fund',
        publish: ['github'],
        releaseInfo: {
          releaseNotes: '1. [修复] 解决基金名过长导致的重叠问题'
        }
      }
    }
  }
}
