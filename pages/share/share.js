let app = getApp(),
    util = require('../../util/util.js');
Page({
	data: {
	  	list:[],
		loading:false,
		shareHidden:true,
		sharesContent:{},
	},
	listRender:function(...options){		// 列表渲染
		let me = this,
            uid = this.uid;
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
					loading:true,
					sharesContent:{
						title:'关注-0pid-，快速收到一手货源信息！',
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
	onLoad:function(options){
		this.uid = options['uid'];
        this.listRender(this.uid,this)
	},
	onPullDownRefresh:function(){
		this.listRender(this.uid,this);
        setTimeout(function(){
            wx.stopPullDownRefresh();
        },1e3);
	},
	onShareAppMessage:function(){
		return this.data['sharesContent']
	}
})
