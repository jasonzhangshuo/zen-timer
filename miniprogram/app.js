// app.js
App({
  onLaunch() {
    console.log('禅修冥想计时器小程序启动');
    
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    console.log('系统信息:', systemInfo);
    
    // 保存到全局
    this.globalData.systemInfo = systemInfo;
  },

  onShow() {
    console.log('小程序显示');
  },

  onHide() {
    console.log('小程序隐藏');
  },

  globalData: {
    systemInfo: null
  }
});
