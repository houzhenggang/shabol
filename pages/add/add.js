let app = getApp(),
	util = require('../../util/util.js');
Page({
	data:{
		loading:false,
		products:["平板车","栏板车","高栏车","厢式车","冷藏车","槽罐车","骨架车","大件运输","自卸车","不限车型"],
		selecedIndex:2,
		truckLength:["不限车长","4.2米","6.8米","9.6米","13米","15米","17.5米"],
		currentIndex:4,
		start:"请选择出发地",
		end:"请选择目的地",
		msinfo:'',
		ProductId:2,
		addMsg:'',
		msg:'',
		Uname:'',
		Tel:'',
		Btel:'',
		id:'',
		formit:0,
	},
	init:function(){
		if(!app.regionStatus){
			if(app._itemId){
				this.setData({
					id:app._itemId
				});
				this.reEdit();
			}else{
				this.getContact();
				this.setData({
					loading:true,
					// selecedIndex:2,
					// ProductId:2,
					msg:'',
					start:"请选择出发地",
					end:"请选择目的地",
					formit:0,
					id:''
				});
			};
		}
		app.regionStatus = false;
		this.regionSelectCallback('fromid','start','startOptions');
		this.regionSelectCallback('toid','end','endOptions');
	},
	setContact:function(o){					// 设置联系方式
		wx.setStorage({
			key:'contact',
			data:o
		})
	},
	getContact:function(){					// 获取联系方式
		let that = this;
		wx.getStorage({
			key:'contact',
			success:function(res){
				let data = res.data;
				that.setData({
					Uname:data.Uname,
					Tel:data.Tel,
					Btel:data.Btel
				});
			}
		})
	},
	reEdit:function(){
		let that = this;
		wx.request({
				url:app.ajaxurl,
				data:{
					c:'cargood',
					m:'GetDetailsInfo',
					id:app._itemId,
					ts:+new Date()
				},
				success:function(res){
					let o = res.data;
					if(o.info == 'ok'){
						let data = o.data;
						let selectedId = that.data['products'].indexOf(data.ProductId);
						let currentIndex = that.data['truckLength'].indexOf(data.truckLength);
						that.setData({
							start:data.FromProName + ',' + data.FromCityName,
							end:data.ToProName + ',' + data.ToCityName,
							ProductId:selectedId,
							selecedIndex:selectedId,
							currentIndex:currentIndex,
							msg:data.msInfo,
							Uname:data.Uname,
							Tel:data.Tel,
							Btel:data.Btel,
							formit:1
						});
						app._itemId = null;
					}
					setTimeout(function(){
						that.setData({
							loading:true
						})
					},1e3)
				}
		})
	},
	regionSelectCallback:function(key,name,options){
		let that = this;
		wx.getStorage({
			key:key,
			success:function(res){
				let data = res.data;
				that.setData({
					[name]:data.province['name'] + ',' + data.city['name'],
					[options]:data.province['id'] + ',' + data.city['id']
				});
			}
		})
	},
	onLoad:function(){
		if(this.loaded) return;
		this.init();
	},
	onShow:function(){
		if(this.loaded){
			this.init();
		}else{
			this.loaded = true;
		}
	},
	productChangeHandle:function(o){
		this.setData({
			selecedIndex:o['detail'].value
		});
	},
	truckLengChangeHandle:function(o){
		this.setData({
			currentIndex:o['detail'].value
		});
	},
	selectRegion:function(e){
		let name = e.target.dataset['name'];
		app.regionStatus = true;
		wx.navigateTo({
			url:'option?name=' + name
		});
	},
	bindTextAreaBlur:function(e){
		this.setData({
			msinfo:e.detail.value
		})
	},
	errorInfo:function(v){
		wx.showModal({
			title: '错误提示',
			content:v,
			showCancel: false
		})
	},
	_submit:function(o,title){
		let that = this;
		wx.request({
			url:app.ajaxurl,
			data:o,
			success:function(res){
				res = res.data;
				if(res.info == 'ok'){
					wx.showToast({
						title:title,
						icon:'success',
						duration:1e3
					});
					that.setContact({
						Uname:o['uname'],
						Tel:o['tel'],
						Btel:o['btel']
					});
					setTimeout(function(){
						app.submited = true;
						wx.hideToast();
						wx.switchTab({
							url:'../list/list'
						})
					},1e3);
					util.analytics({
						t:'event',
						ec:'发布货源成功',
						ea:that.data['id'] ? that.data['id'] : res.data['id'],
						el:o['fromplace'] + '|' + o['toplace']
					});
				}
			}
		})
	},
	formSubmit:function(e){
		let formData = e.detail.value,
			pageData = this.data,
			pattern = new RegExp('^1(([38]\\d)|(4[57])|(5[012356789])|(7[01678]))\\d{8}$');
		if(!pageData['startOptions']){
			this.errorInfo('请选择出发地')
		}else if(!pageData['endOptions']){
			this.errorInfo('请选择目的地')
		}else if(!formData['username']){
			this.errorInfo('请输入联系人')
		}else if(!formData['tel'] || !pattern.test(formData['tel'])){
			this.errorInfo('请输入正确的联系电话')
		}else if(formData['btel'] && formData['btel'] == formData['tel']){
			this.errorInfo('备用电话不能与联系电话相同')
		}else{
			let submitData = {
				c:'cargood',
				m:'addSource',
				openid:app.uid,
				uname:formData['username'],
				tel:formData['tel'],
				btel:formData['btel'],
				fromid:pageData['startOptions'],
				toid:pageData['endOptions'],
				productid:parseInt(formData['productid']) + 1,
				msinfo:pageData['msinfo'],
				fromplace:pageData['start'],
				toplace:pageData['end'],
				truckLength:formData['truckLength'],
				ts:+new Date()
			};
			if(!pageData['id']){		// 发布
				this._submit(submitData,'提交成功')
			}else{									// 修改
				submitData['id'] = pageData['id'];
				this._submit(submitData,'修改成功')
			}
		}
	}
})
