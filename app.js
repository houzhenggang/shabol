App({
    onLaunch:function(){
        this.ajaxurl='https://56-api.kcimg.cn/';
    },
    globalData: {
      hasLogin: false,
      wxCode: ''
    },
    getUserInfo:function(cb){
        let that = this
        if(this.globalData.userInfo){
          typeof cb == "function" && cb(this.globalData.userInfo)
        }else{
          //调用登录接口
          wx.login({
            success: function () {
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo
                  typeof cb == "function" && cb(that.globalData.userInfo)
                }
              })
            }
          })
        }
    }
});
