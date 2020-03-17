//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    isPlayMusic: false,
    doubanBase: "http://t.yushu.im",
    navHeight: 0
  }
})