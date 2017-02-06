let app = getApp(),
    util = require('../../util/util.js');
Page({
	data: {
  	list:[],
    uid:'',
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
				ts:+new Date()
			},
			success:function(res){
        res = res.data['data'];
				if(res.status){
          let listData = res.list
					me.setData({
            list:listData,
            tel:listData[0].Tel,
  					sharesContent:{
              title:(me.data.editName !== '' ? me.data.editName : nickname) + '的货源信息',
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
				ts:+new Date()
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
      wx.makePhoneCall({
          phoneNumber:this.data.tel
      })
  },
  getEditInfo:function(){
    var that = this;
    wx.request({
      url:app.ajaxurl,
      data:{
        c:'cargood',
        m:'getuserdetailsinfo',
        uid:app.uid,
        nickName:this.data.nickname
      },
      success:function(res){
        that.setData({
          editName:res.data.data.nickName,
          editInfo:res.data.data.info,
          editPhoneNum:res.data.data.tel
        })
      }
    })
  },
	onLoad:function(options){
    console.log(options)
    var that = this;
    this.uid = options['uid'];
    util.analyticsDefaultData['cid'] = app.uid;
    app.uid = wx.getStorageSync('userid');
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
    this.getEditInfo()
	},
	onPullDownRefresh:function(){
		this.listRender(this.uid,this);
        setTimeout(function(){
            wx.stopPullDownRefresh();
        },1e3);
	},
	onShareAppMessage:function(){
		return this.data['sharesContent']
	},
	onReachBottom:function(){
		if(this.data['isEnd']) return;
		this.loadMore();
	}
})
