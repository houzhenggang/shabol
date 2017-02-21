// pages/usePage/usePage.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  telToUs:function(){
    wx.makePhoneCall({
        phoneNumber:'18911900055'
    })
  }
})
