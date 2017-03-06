let app = getApp(),
    util = require('../../util/util.js');
Page({
	data: {
  	list:[],
    uid:'',
    mineUID:'',
    page:1,
		loading:false,
		shareHidden:true,
		sharesContent:{},
    nickname:'',
    avatar:'',
    total:2255,
    tel:'17052552768',
    followText:'已关注',
    followStatus:'follow',
    loadingText:"加载中...",
    editName:'',
    editInfo:'',
    editPhoneNum:''
	},
	listRender:function(...options){		// 列表渲染
		let me = this,
        uid = this.uid,
        nickname = this.data.nickname,
        avatar = this.data.avatar;
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'getlist',
				category:0,
				userid:uid,
				page:1,
				ts:+new Date(),
        version:1,
        viewUid:app.uid
			},
			success:function(res){
        res = res.data['data'];
				if(res.status){
          let listData = res.list,
              total = res.num*3;
					me.setData({
            list:listData,
            total:total,
            tel:listData[0].Tel,
  					sharesContent:{
              title:(me.data.editName !== '' ? me.data.editName : nickname) + '的货源信息  ' + '电话:' +((me.data.editPhoneNum !== '' && me.data.editPhoneNum !== '0') ? me.data.editPhoneNum : me.data.tel),
							desc:me.data.editInfo !== '' ? me.data.editInfo : '十万信息部都在用，发货更方便，找车更简单！',
  						path:'/pages/share/share?uid=' + uid + '&nickname=' + nickname + '&avatar=' + avatar
  					}
					});
					if(res.list.length < 10){			// 如当前数据<10条，不再进行加载
						me.setData({
							isEnd:true,
							loadingText:"没有更多了.."
						})
					}
				}
        me.setData({
            loading:true
        });
			}
		})
	},
  loadMore:function(){
		let that = this,
			oldList = this.data['list'];
		this.setData({
			page:this.data['page'] + 1
		});
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'getlist',
				category:0,
				userid:this.uid,
				page:this.data['page'],
				ts:+new Date(),
  			version:1
			},
			success:function(res){
				res = res.data['data'];
				if(res.status){
					that.setData({
						list:oldList.concat(res.list)
					});
          if(res.list.length < 10){
						that.setData({
							isEnd:true,
							loadingText:"没有更多了.."
						})
					}
				}else{
					that.setData({
						isEnd:true,
						loadingText:"没有更多了.."
					})
				}
			}
		})
	},
  makePhoneCall:function(){
    if(this.data.editPhoneNum !== '' && this.data.editPhoneNum !== '0'){
      wx.makePhoneCall({
          phoneNumber:this.data.editPhoneNum
      })
    }else{
      wx.makePhoneCall({
          phoneNumber:this.data.tel
      })
    }
  },
  getEditInfo:function(uid){//获取分享人的信息
    var that = this;
    wx.request({
      url:app.ajaxurl,
      data:{
        c:'cargood',
        m:'getuserdetailsinfo',
        uid:uid,
        nickName:this.data.nickname
      },
      success:function(res){
        that.setData({
          editInfo:res.data.data.info,
          editName:res.data.data.nickName,
          editPhoneNum:res.data.data.tel
        })
        that.onPullDownRefresh()
      }
    })
  },
  onReady:function(){
    this.setData({
      mineUID:app.uid
    })
    if(!app.isShowShare && app.uid){
      var that = this;
      this.setData({
        shareHidden:this.data['shareHidden'] ? false : true
      });
      setTimeout(function(){
        that.setData({
          shareHidden:true
        });
      },1500);
    }
    app.isShowShare = true
  },
	onLoad:function(options){//options为list界面跳转带来的参数
    var that = this;
    this.uid = options['uid'];
    util.analyticsDefaultData['cid'] = app.uid;
    app.uid = wx.getStorageSync('userid');
    util.analytics({
      t:'pageview',
      dh:'wuliu.360che.com',
      cd1:app.uid,
      dt:'分享页面',
      dp:'/share/share'
    });
    if(!app.uid){
	    util.getUserInfo();
		}else{
			util.analyticsDefaultData['cid'] = app.uid;
		}
    this.setData({
      uid:this.uid,
      nickname:options['nickname'],
      avatar:options['avatar']
    });
    this.listRender(this.uid,this);
    this.getEditInfo(this.uid)
    this.onPullDownRefresh()
	},
	onPullDownRefresh:function(){
		this.listRender(this.uid,this);
    this.setData({///刷新需要重置page为1
			page:1,
			isEnd:false,
			loadingText:'加载中...'
		})
    setTimeout(function(){
        wx.stopPullDownRefresh();
    },1e3);
	},
	onShareAppMessage:function(){
		return this.data['sharesContent']
    util.analytics({
			t:'event',
			ec:'分享成功',
			ea:'分享货源列表转发页',
			el:app.uid,
			dp:'/share/share?uid=' + app.uid
		});
	},
	onReachBottom:function(){
		if(this.data['isEnd']) return;
		this.loadMore();
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
  },
  toQRCode:function(){
    wx.navigateTo({
      url:'../qrCode/qrCode'
    })
  },
  telToUs:function(){
    wx.makePhoneCall({
        phoneNumber:'15169139007'
    })
  }
})
