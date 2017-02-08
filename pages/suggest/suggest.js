var app = getApp();
Page({
  data:{
    info:'',

  },
  InputInfo:function(e){
    this.setData({
      info:e.detail.value
    })
  },
  formSubmit:function(){
    if(this.data.info !== ''){
      if(this.data.info <= 3){
        wx.request({
          url:app.ajaxurl,
          data:{
            action:'FeedBack',
            ismobile:2,
            content:this.data.info
          },
          success:function(res){
            wx.showModal({
        			title: '反馈提示',
        			content:'感谢您的反馈！',
        			showCancel: false
        		})
            setTimeout(() => {
              wx.switchTab({
                url:'../list/list'
              })
            }, 1500)
          }
        })
      }else{
        wx.showModal({
          title: '错误信息',
          content:'建议内容不能少于4个字符哦',
          showCancel: false
        })
      }
    }else{
      wx.showModal({
        title: '错误信息',
        content:'建议内容不能为空哦',
        showCancel: false
      })
    }
  }
})
