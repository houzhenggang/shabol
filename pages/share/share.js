let app = getApp(),
    util = require('../../util/util.js');
Page({
	data: {
	  	list:[],
        uid:'',
		loading:false,
		shareHidden:true,
		sharesContent:{},
        nickname:'',
        total:{
            view:0,
            favorite:0
        }
	},
	listRender:function(...options){		// 列表渲染
		let me = this,
            uid = this.uid,
            nickname = this.data.nickname;
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
						title:nickname + '的货源信息',
						desc:'十万信息部都在用，发货更方便，找车更简单！',
						path:'/pages/share/share?uid=' + uid + '&nickname=' + nickname
					}
				});
			}
		})
	},
	onLoad:function(options){
        var that = this;
        this.uid = options['uid'],
        this.setData({
            uid:this.uid,
            nickname:options['nickname']
        });
        this.listRender(this.uid,this);
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
