let app = getApp(),
	util = require('../../util/util.js');

Page({
	data: {
	  	list:[],
		loading:false,
		page:1,
		loadingText:"加载中..."
	},
	onLoad:function(){
		let that = this;
		app.uid = wx.getStorageSync('userid');
		if(!app.uid){
			util.getUserInfo(this.listRender,this);
		}else{
			this.listRender(app.uid,this);
		}
		app.getUserInfo(function(userInfo){
			let nickname = userInfo.nickName;
			that.setData({
				nickname:nickname,
			})
		});
	},
	listRender:function(...options){
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'getlist',
				category:1,
				userid:options[0],
				page:1,
				ts:+new Date()
			},
			success:function(res){
				let that = options[1];
				res = res.data['data'];
				if(res.status){
					that.setData({
						list:res.list
					});
					if(res.list.length < 10){			// 如当前数据<10条，不再进行加载
						that.setData({
							isEnd:true,
							loadingText:"没有更多了.."
						})
					}
				}
				that.setData({
					loading:true
				})
			}
		})
	},
	onPullDownRefresh:function(){
		let that = this;
		that.listRender(app.uid,that);
        setTimeout(function(){
            wx.stopPullDownRefresh();
        },1e3);
	},
	remove:function(e){
		let index = e.target.dataset['index'],
			that = this,
			id = e.target.id;
		util.analytics({
			t:'event',
			ec:'点击删除按钮',
			ea:id,
			el:'',
			dp:'/close/close'
		});
		wx.request({
		  url: app.ajaxurl,
		  data: {
				c:'cargood',
				m:'UpdateStatus',
				category:2,
				id:e.target.id,
				userid:app.uid,
				ts:+new Date()
			},
		  success: function(res) {
				var newListData = that.data['list'];
				newListData.splice(index,1)
				that.setData({
					list:newListData
				});
				wx.showToast({
					title:'已删除',
					icon:'success',
					duration:1e3
				});
				setTimeout(function(){
					wx.hideToast();
				},1e3);
			},
		})
	},
	republish:function(e){
		let index = e.target.dataset['index'],
			that = this,
			id = e.target.id;
		util.analytics({
			t:'event',
			ec:'点击再次发布按钮',
			ea:id,
			el:'',
			dp:'/close/close'
		});
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'UpdateStatus',
				category:0,
				id:e.target.id,
				userid:app.uid,
				ts:+new Date()
			},
			success:function(res){
				var newListData = that.data['list'];
				newListData.splice(index,1)
				that.setData({
					list:newListData
				});
				wx.showToast({
					title:'已发布',
					icon:'success',
					duration:1e3
				});
				setTimeout(function(){
					wx.hideToast();
				},1e3);
				if(!app.republished)
				app.republished = true;
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
				category:1,
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
	onReachBottom:function(){
		if(this.data['isEnd']) return;
		this.loadMore();
	}
})
