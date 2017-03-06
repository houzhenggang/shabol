let app = getApp(),
		util = require('../../util/util.js'),
		UT = require('../../util/request.js');
Page({
	data: {
		id:'',
	  list:[],      //发布列表
		closeList:[],   //关闭列表
		page:1,
		loading:false,
		shareHidden:true,
		sharesContent:{},
		loadingText:"加载中...",
		editName:'',
		editInfo:'',
		editPhoneNum:'',
		uid:'',
		active:0
	},
	replaceWithType:function(list){  //转换类型
			list.forEach(function(item){
				if(item.truckLength.indexOf('不限') >= 0 && item.ProductId.indexOf('不限') >= 0){
						item.truckLength = '';
						item.ProductId = '不限';
				}
			});
			return list;
	},
	getRequest:function(o,suc,err){   //进行请求
		wx.request({
			url:app.ajaxurl,
			data:o,
			success:function(res){
				UT.isFunction(suc) && suc(res.data)
			},
			fail:function(res){
				UT.isFunction(err) && err(res.data)
			}
		})
	},
	allReadyAddItem:function(){  //已发布
		this.setData({
			active:0,
			isEnd:false,
			page:1,
			loadingText:"加载中...",
		})
		this.listRender(app.uid,this)
	},
	allReadyCloseItem:function(){   //已关闭
		this.setData({
			active:1,
			isEnd:false,
			page:1,
			loadingText:"加载中...",
		})
		this.listRender(app.uid,this)
	},
	listRender:function(...options){		// 列表渲染
		if(this.data.active == 0){
			let me = this,
				uid = options[0];
			this.setData({
				uid:uid
			})
			var listData = {
				c:'cargood',
				m:'getlist',
				category:0,
				userid:uid,
				page:1,
				ts:+new Date(),
				version:1
			}
			this.getRequest(listData,(res)=>{
				res = res['data'];
				if(res.status == 1){
					me.setData({
						list:me.replaceWithType(res.list)
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
							avatar:userInfo.avatarUrl,
							sharesContent:{
								title:(me.data.editName !== '' ? me.data.editName : nickname) + '的货源信息',
								desc:me.data.editInfo !== '' ? me.data.editInfo : '十万信息部都在用，发货更方便，找车更简单！',
								path:'/pages/share/share?uid=' + uid + '&nickname=' + nickname + '&avatar='+ userInfo.avatarUrl
							}
						})
					})
				}else{  //最后一个的时候status为0，把数组为空
					me.setData({
						list:[]
					})
				}
				me.setData({
						loading:true
				})
			})
		}else{
			var closeListData = {
				c:'cargood',
				m:'getlist',
				category:1,
				userid:options[0],
				page:1,
				ts:+new Date(),
				version:1
			}
			this.getRequest(closeListData,(res)=>{
				let that = options[1];
				res = res['data'];
				if(res.status){
					that.setData({
						closeList:res.list
					})
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
			})
		}
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
				ts:+new Date(),
				version:1
			},
			success:function(res){
				var newListData = that.data['list'];
				newListData.splice(index,1)
				if(newListData.length < 5){
					that.listRender(app.uid,that)
				}
				that.setData({
					list:newListData
				})
				util.analytics({
					t:'event',
					ec:'点击关闭按钮',
					ea:id,
					el:'',
					dp:'/list/list'
				})
			}
		})
		wx.showToast({
			title:'已关闭',
			icon:'success',
			duration:1e3
		})
		setTimeout(function(){
			wx.hideToast();
		},1e3)
	},
	share:function(e){
		app.getUserInfo(function(userInfo){//跳转到分享页面需要的参数
			let nickname = userInfo.nickName;
			wx.navigateTo({
				url:'../share/share?uid=' + app.uid + '&nickname=' + nickname + '&avatar='+ userInfo.avatarUrl
			})
		})

		util.analytics({
			t:'event',
			ec:'点击转发按钮',
			ea:e.target.dataset.id,
			el:'',
			dp:'/list/list'
		})
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
			dp:'/list/list'
		})
		var removeData = {
			c:'cargood',
			m:'UpdateStatus',
			category:2,
			id:e.target.id,
			userid:app.uid,
			ts:+new Date(),
			version:1
		}
		this.getRequest(removeData,(res)=>{
			var newListData = that.data['closeList'];
			newListData.splice(index,1)
			if(newListData.length < 6){
				that.listRender(app.uid,that)
			}
			that.setData({
				closeList:newListData
			});
			wx.showToast({
				title:'已删除',
				icon:'success',
				duration:1e3
			})
			setTimeout(function(){
				wx.hideToast();
			},1e3);
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
			dp:'/list/list'
		})
		var publishData = {
			c:'cargood',
			m:'UpdateStatus',
			category:0,
			id:e.target.id,
			userid:app.uid,
			ts:+new Date(),
			version:1
		}
		this.getRequest(publishData,(res)=>{
			var newListData = that.data['closeList'];
			newListData.splice(index,1)
			if(newListData.length < 5){
				that.listRender(app.uid,that)
			}
			wx.showToast({
				title:'已发布',
				icon:'success',
				duration:1e3
			})
			setTimeout(function(){
				wx.hideToast();
				that.setData({
					closeList:newListData,
					active:0
				})
				that.listRender(app.uid,that)
			},1e3)
			if(!app.republished)
			app.republished = true;
		})
	},
	loadMore:function(){
		if(this.data.active == 0){
			let that = this,
					oldList = this.data['list'];
			this.setData({
				page:this.data['page'] + 1
			})
			var listData = {
				c:'cargood',
				m:'getlist',
				category:0,
				userid:app.uid,
				page:this.data['page'],
				ts:+new Date(),
				version:1
			}
			this.getRequest(listData,(res)=>{
				res = res['data'];
				if(res.status){
					that.setData({
						list:oldList.concat(res.list)
					})
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
			})
		}else{
			let that = this,
				oldList = this.data['closeList'];
				this.setData({
					page:this.data['page'] + 1
				})
			var closeListData = {
				c:'cargood',
				m:'getlist',
				category:1,
				userid:app.uid,
				page:this.data['page'],
				ts:+new Date(),
				version:1
			}
			this.getRequest(closeListData,(res)=>{
				res = res['data'];
				if(res.status){
					that.setData({
						closeList:oldList.concat(res.list)
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
			})
		}
	},
	getEditInfo:function(){
    var that = this;
		app.getUserInfo(function(userInfo){//获取用户信息
			let nickname = userInfo.nickName;
			wx.request({
	      url:app.ajaxurl,
	      data:{
	        c:'cargood',
	        m:'getuserdetailsinfo',
	        uid:app.uid,
	        nickName:nickname
	      },
	      success:function(res){
					if(res.data.data.nickName === 'undefined'){//如果是返回undefined，那就更改名字为微信名字
						wx.request({
							url:app.ajaxurl,
							data:{
								c:'cargood',
				        m:'updateusernickname',
								uid:app.uid,
								nickName:nickname,
								version:1
							}
						})
					}else{
						that.setData({
		          editName:res.data.data.nickName,
		          editInfo:res.data.data.info,
		          editPhoneNum:res.data.data.tel
		        })

						wx.setStorage({   //从服务器缓存
              key:'editInfomation',
              data:{
                Name:res.data.data.nickName,
                Info:res.data.data.info,
                Tel:res.data.data.tel == 0 ? '' :res.data.data.tel,
                Btel:res.data.data.viceTel == 0 ? '' : res.data.data.viceTel
              }
            })
						that.onPullDownRefresh()
					}
	      }
	    })
		})
  },
	onLoad:function(options){
		var that = this;
		app.uid = wx.getStorageSync('userid');
		if(this.data.active == 0){
			app.listFinished = true;
			util.analytics({
				t:'pageview',
				dh:'wuliu.360che.com',
				cd1:app.uid,
				dt:'货源列表',
				dp:'/list/list'
			})
			setTimeout(function(){
				app.listFinished = false;
				that.getEditInfo()
			},1e3);
		}else{
			util.analytics({
				t:'pageview',
				dh:'wuliu.360che.com',
				cd1:app.uid,
				dt:'关闭页面',
				dp:'/close/close'
			})
			// if(!app.uid){
			// 	util.getUserInfo(this.listRender,this);
			// }else{
			// 	this.listRender(app.uid,this);
			// }
		}
		if(!app.uid){
			util.getUserInfo(this.listRender,this)
		}else{
			this.listRender(app.uid,this);
			util.analyticsDefaultData['cid'] = app.uid;
		}
	},
	onShow:function(){
		this.setData({
			active:0
		})
		if(this.data.active == 0){
			if(app.listFinished) return;
			util.analytics({
				t:'pageview',
				dh:'wuliu.360che.com',
				cd1:app.uid,
				dt:'货源列表',
				dp:'/list/list'
			})
			if(app.submited || app.republished){
				this.setData({
					loading:false
				})
				this.listRender(app.uid,this)
				app.submited = false;
				app.republished = false;
			}
		}else{
			this.listRender(app.uid,this);
		}
		this.onPullDownRefresh()
		var value = wx.getStorageSync('editInfomation')//获取缓存
		this.setData({
			editName:value.Name,
			editInfo:value.Info,
			editPhoneNum:value.Tel
		})
	},
	onPullDownRefresh:function(){
		let that = this;
		that.listRender(app.uid,that);
		that.setData({///刷新需要重置page为1
			page:1,
			isEnd:false,
			loadingText:'加载中...'
		})
		setTimeout(function(){
			wx.stopPullDownRefresh();
		},1e3);
	},
	onShareAppMessage:function(){
		util.analytics({
			t:'event',
			ec:'分享成功',
			ea:'分享货源列表页',
			el:app.uid,
			dp:'/list/list'
		});
		return this.data['sharesContent']
	},
	onReachBottom:function(){
		if(this.data['isEnd']) return;
		this.loadMore()
	}
})
