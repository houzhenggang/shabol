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
                        wx.navigateBack({
                          delta:1
                        });
            		},1e3)
                }else{
                    wx.showModal({
            			title: '错误提示',
            			content:'关闭失败，请稍候重试！',
            			showCancel: false
            		})
                }
			}
		});
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
                        });
    				},1e3)
                }else{
                    wx.showModal({
            			title: '错误提示',
            			content:'删除失败，请稍后重试',
            			showCancel: false
            		})
                }
			},
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
				});
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
          close       = options['close'];
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
              that.setData({
                  loading:true
              });
              that.setData(res.data);
          }
      });
      this.setData({
          id:id
      });
      if(uid && uid !== app.uid){                 // 非发布者查看详情
          this.setData({
              uid:uid
          })
      }
      if(close){
          this.setData({
              close:close
          })
      }else{
          this.setData({
            sharesContent:{
              title:(this.data.editName !== '' ? this.data.editName : nickname) + '的货源详情',
              desc:this.data.editInfo !== '' ? this.data.editInfo : '十万信息部都在用，发货更方便，找车更简单！',
              path:'/pages/detail/detail?id=' + id + '&uid=' + (uid ? uid : app.id) + '&nickname='+ nickname
            }
          });
      }

    },
    onShareAppMessage:function(){
        if(!this.data['close']){
            util.analytics({
    			t:'event',
    			ec:'分享成功',
    			ea:'货源详情页',
    			el:this.data['id'],
    			dp:'/detail/detail'
    		});
            return this.data['sharesContent']
        }
	}
})
