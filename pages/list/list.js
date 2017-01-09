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
				me.setData({
					list:res.data.data['list'],
					loading:true
				});
		        app.getUserInfo(function(userInfo){
		          let nickname = userInfo.nickName;
		          me.setData({
					nickname:nickname,
				  	sharesContent:{
  						title:nickname + '的货源信息',
  						desc:'十万信息部都在用，发货更方便，找车更简单！',
  						path:'/pages/share/share?uid=' + uid + '&nickname=' + nickname
  					}
		          })
		        })
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
		let that = this;
		this.setData({
			shareHidden:this.data['shareHidden'] ? false : true
		});
		setTimeout(function(){
			that.setData({
				shareHidden:true
			});
		},500);
	},
	onLoad:function(options){
		app.listFinished = true;
		app.uid = wx.getStorageSync('userid');
		!app.uid ? util.getUserInfo(this.listRender,this) : this.listRender(app.uid,this);
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
		return this.data['sharesContent']
	}
})
