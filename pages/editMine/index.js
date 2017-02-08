let app = getApp()
Page({
  data: {
    userInfo:'',
    us:[
        {label:'名字',content:'',index:0,placeHolder:''},
        {label:'介绍',content:'',placeHolder:'十万信息部都在用，发货更方便，找车更简单！',index:1},
        {label:'手机号',content:'',placeHolder:'请绑定手机号',index:2},
        {label:'备用手机号',content:'',placeHolder:'请绑定备用手机号',index:3}
      ],
    isStore:true
  },
  onLoad: function(options) {
      var that = this;
      app.uid = wx.getStorageSync('userid');
      app.getUserInfo(function(userInfo){
        //获取个人信息
        that.setData({
          userInfo:userInfo,
          'us[0].placeHolder':userInfo.nickName,
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
            'us[0].content':res.data.data.nickName,
            'us[1].content':res.data.data.info,
            'us[2].content':res.data.data.tel == 0 ? '' :res.data.data.tel,
            'us[3].content':res.data.data.viceTel == 0 ? '' : res.data.data.viceTel
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
    wx.getStorage({//获取手机缓存
      key:'editInfomation',
      success:function(res){
        that.setData({
          'us[0].content':res.data.Name,
          'us[1].content':res.data.Info,
          'us[2].content':res.data.Tel,
          'us[3].content':res.data.Btel
        })
      }
    })
  },
  jump:function(options){  //跳转更改页。
    var that = this;
    wx.navigateTo({
      url: '../editInfo/index?id=' + options.currentTarget.dataset.index
    })
  }
})
