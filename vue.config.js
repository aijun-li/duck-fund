module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.anonymorse.fund',
        productName: 'Duck Fund',
        publish: ['github'],
        releaseInfo: {
          releaseNotes: '1. [优化] 更新天天基金API'
        }
      }
    }
  }
}
