var app = getApp(),
    util = require('../../util/util.js');
Page({
    data:{
        userInfo:{},
        total:{
            view:0,
            favorite:0
        },
        EditName:'',
        EditInfo:'',
        UnNewName:''
    },
    onLoad:function(){
      var that = this;
        app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
            userInfo:userInfo,
          })
        })
        util.analytics({
    			t:'pageview',
    			dh:'wuliu.360che.com',
    			cd1:app.uid,
    			dt:'我的页面',
    			dp:'/user/user'
    		});
        wx.request({  //请求服务器上得info
          url:app.ajaxurl,
          data:{
            c:'cargood',
            m:'getuserdetailsinfo',
            uid:app.uid,
            nickName:this.data.userInfo.nickName
          },
          success:function(res){
            if(res.data.data.nickName === 'undefined'){//如果是返回undefined，那就更改名字为微信名字
  						wx.request({
  							url:app.ajaxurl,
  							data:{
  								c:'cargood',
  				        m:'updateusernickname',
  								uid:app.uid,
  								nickName:that.data.userInfo.nickName
  							},
                success:function(){
                  that.setData({
                    UnNewName:res.data.data.nickName
                  })
                }
  						})
  					}
						that.setData({
		          EditName:res.data.data.nickName === 'undefined' ? that.data.UnNewName : res.data.data.nickName,
		          EditInfo:res.data.data.info
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
      util.analytics({
  			t:'event',
  			ec:'进入个人信息页',
  			ea:'我的页面',
  			el:'',
  			dp:'/user/user'
  		});
    }
})
