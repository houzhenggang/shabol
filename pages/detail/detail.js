let app = getApp();
Page({
    data:{
        id:'',
        loading:false,
        shareHidden:true,
        sharesContent:{},
        Tel:'',
        list:[],
        uid:''
    },
    makePhoneCall:function(){           // 拨打电话
        wx.makePhoneCall({
            phoneNumber:this.data.Tel
        })
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
		},1e3);
    },
    close:function(){
        let that = this;
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'cargood',
				m:'UpdateStatus',
				category:1,
				id:this.data['id'],
				userid:app.uid,
				ts:+new Date()
			},
			success:function(res){
				if(res.data.info == 'ok'){
                    wx.showToast({
            			title:'已关闭',
            			icon:'success',
            			duration:1e3
            		});
                    setTimeout(function(){
            			wx.hideToast();
            		},1e3)
                }else{
                    wx.showModal({
            			title: '错误提示',
            			content:'关闭失败，请稍候重试！',
            			showCancel: false
            		})
                }
			}
		});
    },
    onLoad:function(options){
        let that    = this,
            id      = options['id'],
            uid     = options['uid'],
            nickname = options['nickname'];
        if(uid && uid !== app.uid){                 // 非发布者查看详情
            this.setData({
                uid:uid
            })
        }
        this.setData({
            sharesContent:{
                title:nickname + '的货源详情',
                desc:'十万信息部都在用，发货更方便，找车更简单！',
                path:'/pages/detail/detail?id=' + id + '&uid=' + (uid ? uid : app.id) + '&nickname='+ nickname
            }
        })
        wx.request({
            url:app.ajaxurl,
            data:{
                c:'cargood',
                m:'GetDetailsInfo',
                id:id,
                ts:+new Date()
            },
            success:function(res){
                res = res.data;
                that.setData({
                    loading:true,
                    id:options['id']
                });
                that.setData(res.data);
            }
        });
    },
    onShareAppMessage:function(){
		return this.data['sharesContent']
	}
})
