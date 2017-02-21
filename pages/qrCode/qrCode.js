// pages/qrCode/qrCode.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  previewImage:function(){
    wx.previewImage({
      urls: [
              'https://s.kcimg.cn/m/images/usePage/code1.png',
              'https://s.kcimg.cn/m/images/usePage/code2.png'
            ] // 需要预览的图片http链接列表
    })
  }
})
