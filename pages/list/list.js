let app = getApp(),
	util = require('../../util/util.js');
Page({
	data: {
		id:'',
	  	list:[],
		loading:false,
		shareHidden:true,
		sharesContent:{},
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
				let nickName = '';
				app.getUserInfo(function(userInfo){
					nickName = userInfo.nickName
		        });
				me.setData({
					list:res.data.data['list'],
					loading:true,
					sharesContent:{
						title:'关注-' + nickName + '-，快速收到一手货源信息！',
						desc:'小宝物流十万信息部都在用，发货更方便，找车更简单！',
						path:'/pages/share/share?uid=' + uid
					}
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
		wx.switchTab({
			url:'../add/add'
		})
	},
	close:function(e){					// 关闭
		let index = e.target.dataset['index'],
			that = this;
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'UpdateStatus',
				category:1,
				id:e.target.id,
				userid:app.uid,
				ts:+new Date()
			},
			success:function(res){
				var newListData = that.data['list'];
				newListData.splice(index,1)
				that.setData({
					list:newListData
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
	share:function(){
		this.setData({
			shareHidden:this.data['shareHidden'] ? false : true
		});
	},
	onLoad:function(options){
		app.uid = wx.getStorageSync('userid');
		!app.uid ? util.getUserInfo(this.listRender,this) : this.listRender(app.uid,this);
	},
	onShow:function(){
		//this.listRender(app.uid,this);
	},
	onPullDownRefresh:function(){
		let that = this;
		that.listRender(app.uid,that);
        setTimeout(function(){
            wx.stopPullDownRefresh();
        },1e3);
	},
	onShareAppMessage:function(){
		return this.data['sharesContent']
	}
})
