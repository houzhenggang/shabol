let app = getApp(),
    util = require('../../util/util.js');
Page({
  data:{
    id:'',
    loading:false,
    shareHidden:true,
    sharesContent:{},
    Tel:'',
    list:[],
    uid:'',
    editName:'',
    editInfo:'',
    editPhoneNum:''
  },
  makePhoneCall:function(){           // 拨打电话
    util.analytics({
			t:'event',
			ec:'点击拨打电话',
			ea:this.data['id'],
			el:'',
			dp:'/detail/detail'
		});
    wx.makePhoneCall({
        phoneNumber:this.data.Tel
    })
  },
  share:function(){
    let that = this;
		this.setData({
			shareHidden:this.data['shareHidden'] ? false : true
		});
		setTimeout(function(){
            that.setData({
				shareHidden:true
			});
		},1e3);
  },
  close:function(){
    let that = this;
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'UpdateStatus',
				category:1,
				id:this.data['id'],
				userid:app.uid,
				ts:+new Date()
			},
			success:function(res){
				if(res.data.info == 'ok'){
          wx.showToast({
      			title:'已关闭',
      			icon:'success',
      			duration:1e3
      		});
          app.republished = true;
          setTimeout(function(){
  			    wx.hideToast();
            wx.switchTab({
              url:'../list/list'
            })
  		    },1e3)
        }else{
          wx.showModal({
      			title: '错误提示',
      			content:'关闭失败，请稍候重试！',
      			showCancel: false
      		})
        }
			}
		})
  },
  findMore:function(){////查看货主的更多货源
    wx.navigateTo({
			url:'/pages/share/share?uid=' + this.data.uid + '&nickname=' + this.data.nickname + '&avatar=' + this.data.avatar
		})
  },
  delete:function(e){
		wx.request({
		  url: app.ajaxurl,
		  data: {
				c:'cargood',
				m:'UpdateStatus',
				category:2,
				id:this.data['id'],
				userid:app.uid,
				ts:+new Date()
			},
		  success: function(res) {
        if(res.data['info'] == 'ok'){
  				wx.showToast({
  					title:'已删除',
  					icon:'success',
  					duration:1e3
  				});
  				setTimeout(function(){
  					wx.hideToast();
            wx.navigateBack({
              delta: 1
            })
  				},1e3)
        }else{
          wx.showModal({
      			title: '错误提示',
      			content:'删除失败，请稍后重试',
      			showCancel: false
      		})
        }
			}
		})
	},
	republish:function(e){
    let that = this;
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'UpdateStatus',
				category:0,
				id:this.data['id'],
				userid:app.uid,
				ts:+new Date()
			},
			success:function(res){
				wx.showToast({
					title:'已发布',
					icon:'success',
					duration:1e3
				})
				setTimeout(function(){
					wx.hideToast();
          that.setData({
              close:false
          })
				},1e3);
				if(!app.republished)
				app.republished = true;
			}
		})
	},
  replaceType:function(list){//更改类型
    if(list.truckLength.indexOf('不限') >= 0 && list.ProductId.indexOf('不限') >= 0){
      list.truckLength = '';
      list.ProductId = '不限'
    }
    return list
  },
    onLoad:function(options){
      var value = wx.getStorageSync('editInfomation')//获取缓存
      this.setData({
        editName:value.Name,
        editInfo:value.Info,
        editPhoneNum:value.Tel
      })
      let that        = this,
          id          = options['id'],
          uid         = options['uid'],
          nickname    = options['nickname'],
          close       = options['close'],
          avatar      = options['avatar'];//需要通过点击跳转的时候传递参数
      wx.request({
          url:app.ajaxurl,
          data:{
              c:'cargood',
              m:'GetDetailsInfo',
              id:id,
              ts:+new Date()
          },
          success:function(res){
              res = res.data;
              var FromCityName = res.data.FromCityName,
              FromProName = res.data.FromProName,
              ProductId = res.data.ProductId,
              truckLength = res.data.truckLength,
              ToCityName = res.data.ToCityName,
              ToProName = res.data.ToProName,
              ToAeraName = res.data.ToAeraName;
              that.setData({
                  loading:true,
                  list:res.data
              });
              that.setData(that.replaceType(res.data));
              util.analytics({
          			t:'pageview',
          			dh:'wuliu.360che.com',
          			cd1:app.uid,
          			dt:'货源详情' + '|' + FromProName + '|' + FromCityName + '|' + ProductId + '|' + truckLength + '到' + '|' + ToProName + '|' + ToCityName + '|' + ToAeraName,
          			dp:'/detail/detail'
          		});
          }
      });
      this.setData({
          id:id
      });
      if(uid && uid !== app.uid){                 // 非发布者查看详情
          this.setData({
              uid:uid,
              avatar:avatar,    //存图片
          })
      }
      if(close){
          this.setData({
              close:close
          })
      }else{
        this.setData({
          sharesContent:{
            title:(this.data.editName !== '' ? this.data.editName : nickname) + '的货源详情  ' + '电话:' + this.data.editPhoneNum,
            desc:this.data.editInfo !== '' ? this.data.editInfo : '十万信息部都在用，发货更方便，找车更简单！',
            path:'/pages/detail/detail?id=' + id + '&uid=' + (uid ? uid : app.uid) + '&nickname='+ nickname + '&avatar=' + avatar
          }
        })
      }
    },
    onShareAppMessage:function(){
      if(!this.data['close']){
        util.analytics({
    			t:'event',
    			ec:'分享成功',
    			ea:'分享货源详情页',
    			el:this.data['id'],
    			dp:'/detail/detail?id=' + this.data['id'] + '&uid=' + (this.data.uid ? this.data.uid : app.uid)
    		})
        return this.data['sharesContent']
      }
	},
  toAdd:function(){
    wx.switchTab({
      url:'../add/add'
    })
    util.analytics({
			t:'event',
			ec:'我也要使用小程序发货',
			ea:'分享出去页面跳转add页面',
			el:'',
			dp:'/share/share'
		});
  }
})
