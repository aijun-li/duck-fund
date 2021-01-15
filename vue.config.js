module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.anonymorse.fund',
        productName: 'Duck Fund',
        publish: ['github'],
        releaseInfo: {
          releaseNotes:
            '1. [优化] 支持自动重发请求\n2. [修复] 清空搜索输入框后清空搜索建议'
        }
      }
    }
  }
}
