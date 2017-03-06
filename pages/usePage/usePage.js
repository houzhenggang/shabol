let app = getApp(),
	 util = require('../../util/util.js');
Page({
  data:{},
  onLoad:function(options){
    app.uid = wx.getStorageSync('userid');
		util.analytics({
			t:'pageview',
			dh:'wuliu.360che.com',
			cd1:app.uid,
			dt:'使用教程',
			dp:'/usePage/usePage'
		})
  },
  telToUs:function(){
    wx.makePhoneCall({
        phoneNumber:'15169139007'
    })
  }
})
