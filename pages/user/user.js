var app = getApp();
Page({
    data:{
        userInfo:{},
        total:{
            view:0,
            favorite:0
        }
    },
    onLoad:function(){
      var that = this;
      app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
          userInfo:userInfo,
        })
      })
    }
})
