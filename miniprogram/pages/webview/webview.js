// pages/webview/webview.js
Page({
  data: {
    webviewUrl: 'https://zen.jason2026.top'
  },

  onLoad(options) {
    console.log('加载 web-view 页面');
  },

  onShow() {
    console.log('web-view 页面显示');
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '禅修冥想计时器 - 寻径·归真',
      path: '/pages/webview/webview',
      imageUrl: '' // 可以设置分享图片
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '禅修冥想计时器 - 寻径·归真',
      query: '',
      imageUrl: ''
    }
  }
});
