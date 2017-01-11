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
        total:{
            view:0,
            favorite:0
        },
        loadingText:"加载中..."
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
                res = res.data['data'];
				if(res.status){
					me.setData({
                        list:res.list,
    					sharesContent:{
    						title:nickname + '的货源信息',
    						desc:'十万信息部都在用，发货更方便，找车更简单！',
    						path:'/pages/share/share?uid=' + uid + '&nickname=' + nickname
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
	},
	onReachBottom:function(){
		if(this.data['isEnd']) return;
		this.loadMore();
	}
})
