let app = getApp(),
	util = require('../../util/util.js');

Page({
	data: {
	  	list:[],
		loading:false,
	},
	onLoad:function(){
		app.uid = wx.getStorageSync('userid');
		console.log(app.id);
		if(!app.uid){
			util.getUserInfo(this.listRender,this);
		}else{
			this.listRender(app.uid,this);
		}
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
				res = res.data;
				options[1].setData({
					list:res.data['list'],
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
			that = this;
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
				},1e3)
			},
		})
	},
	republish:function(e){
		let index = e.target.dataset['index'],
			that = this;
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
				},1e3)
			}
		})
	}
})
