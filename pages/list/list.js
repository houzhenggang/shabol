let app = getApp(),
	util = require('../../util/util.js');

Page({
	data: {
	  	list:[],
			id:''
	},
	onLoad:function(e){
		app.uid = wx.getStorageSync('userid');
		if(!app.uid){
			util.getUserInfo(this.listRender,this);
		}else{
			this.listRender(app.uid,this);
		}
	},
	onShow:function(){
		this.listRender(app.uid,this);
	},
	listRender:function(...options){
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'getlist',
				category:0,
				userid:options[0],
				page:1,
				ts:+new Date()
			},
			success:function(res){
				options[1].setData({
					list:res.data['list']
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
	jumpToAdd:function(){
		wx.switchTab({
			url:'../add/add'
		})
	},
	edit:function(e){
		app._itemId = e.target.dataset.id;
		wx.switchTab({
			url:'../add/add'
		})
	},
	close:function(e){
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
	}
})
