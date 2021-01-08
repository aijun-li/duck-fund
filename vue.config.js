module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.anonymorse.fund',
        productName: 'Duck Fund',
        publish: ['github'],
        releaseInfo: {
          releaseNotes: '1. [新增] 支持自动更新'
        }
      }
    }
  }
}
