var app = getApp();
Page({
    data:{
        userInfo:{},
        total:{
            view:0,
            favorite:0
        },
        EditName:'',
        EditInfo:''
    },
    onLoad:function(){
      var that = this;
        app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
            userInfo:userInfo,
          })
        })
        wx.request({  //请求服务器上得info
          url:app.ajaxurl,
          data:{
            c:'cargood',
            m:'getuserdetailsinfo',
            uid:app.uid,
            nickName:this.data.userInfo.nickName
          },
          success:function(res){
            that.setData({
              EditName:res.data.data.nickName,
              EditInfo:res.data.data.info,
          })
            wx.setStorage({   //从服务器缓存
              key:'editInfomation',
              data:{
                Name:res.data.data.nickName,
                Info:res.data.data.info,
                Tel:res.data.data.tel == 0 ? '' :res.data.data.tel,
                Btel:res.data.data.viceTel == 0 ? '' : res.data.data.viceTel
              }
            })
          }
        })
    },
    onShow:function(){
      var that = this
      var infomation = wx.getStorageSync('editInfomation')
      if(infomation){
        that.setData({
          EditName:infomation.Name,
          EditInfo:infomation.Info
        })
      }
    },
    edit:function(){
      wx.navigateTo({
        url:'../editMine/index'
      })
    }
})
