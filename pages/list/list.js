let app = getApp(),
	util = require('../../util/util.js');
Page({
	data: {
		id:'',
	  	list:[],
		page:1,
		loading:false,
		shareHidden:true,
		sharesContent:{},
		loadingText:"加载中..."
	},
	listRender:function(...options){		// 列表渲染
		let me = this,
			uid = options[0];
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
					me.setData({
						list:res.list
					});
					if(res.list.length < 10){			// 如当前数据<10条，不再进行加载
						me.setData({
							isEnd:true,
							loadingText:"没有更多了.."
						})
					}
			        app.getUserInfo(function(userInfo){
			          let nickname = userInfo.nickName;
			          me.setData({
						nickname:nickname,
					  	sharesContent:{
	  						title:nickname + '的货源信息',
	  						desc:'十万信息部都在用，发货更方便，找车更简单！',
	  						path:'/pages/share/share?uid=' + uid + '&nickname=' + nickname + '&avatar='+ userInfo.avatarUrl
	  					}
			          })
			        })
				}
				me.setData({
                    loading:true
                });
			}
		})
	},
	jumpToAdd:function(){				// 去发布
		wx.switchTab({
			url:'../add/add'
		})
	},
	edit:function(e){					// 修改
		app._itemId = e.target.dataset.id;
		util.analytics({
			t:'event',
			ec:'点击修改按钮',
			ea:app._itemId,
			el:'',
			dp:'/list/list'
		});
		wx.switchTab({
			url:'../add/add'
		});
	},
	close:function(e){					// 关闭
		let index 	= e.target.dataset['index'],
			that 	= this,
			id 		= e.target.id;
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'UpdateStatus',
				category:1,
				id:id,
				userid:app.uid,
				ts:+new Date()
			},
			success:function(res){
				var newListData = that.data['list'];
				newListData.splice(index,1)
				that.setData({
					list:newListData
				});
				util.analytics({
					t:'event',
					ec:'点击关闭按钮',
					ea:id,
					el:'',
					dp:'/list/list'
				})
			}
		});
		wx.showToast({
			title:'已关闭',
			icon:'success',
			duration:1e3
		});
		setTimeout(function(){
			wx.hideToast();
		},1e3)
	},
	share:function(e){
		let that = this;
		this.setData({
			shareHidden:this.data['shareHidden'] ? false : true
		});
		setTimeout(function(){
			that.setData({
				shareHidden:true
			});
		},1e3);
		util.analytics({
			t:'event',
			ec:'点击转发按钮',
			ea:e.target.dataset.id,
			el:'',
			dp:'/list/list'
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
				userid:app.uid,
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
	onLoad:function(options){
		app.listFinished = true;
		app.uid = wx.getStorageSync('userid');
		if(!app.uid){
			util.getUserInfo(this.listRender,this)
		}else{
			this.listRender(app.uid,this);
			util.analyticsDefaultData['cid'] = app.uid;
		}
		setTimeout(function(){
			app.listFinished = false;
		},1e3);
	},
	onShow:function(){
		if(app.listFinished) return;
		if(app.submited || app.republished){
			this.setData({
				loading:false
			});
			this.listRender(app.uid,this);
			app.submited = false;
			app.republished = false;
		}
	},
	onPullDownRefresh:function(){
		let that = this;
		that.listRender(app.uid,that);
        setTimeout(function(){
            wx.stopPullDownRefresh();
        },1e3);
	},
	onShareAppMessage:function(){
		util.analytics({
			t:'event',
			ec:'分享成功',
			ea:'货源列表页',
			el:'',
			dp:'/list/list'
		});
		return this.data['sharesContent']
	},
	onReachBottom:function(){
		if(this.data['isEnd']) return;
		this.loadMore();
	}
})
