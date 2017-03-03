let app = getApp(),
	util = require('../../util/util.js'),
	UT = require('../../util/request.js')
Page({
	data:{
		loading:false,
		products:[],//车型
		truckLength:[],//车长
		infomations:['普货','重货','泡货','设备','配件','百货','建材','饮料','化工','水果','蔬菜','木材','煤炭','石材','其他'],
		pays:['货到现金结算','货到打卡结算','货到凭回单结算','发车预付其余回单'],
		start:"请选择出发地",
		end:"请选择目的地",
		msg:'',
		Uname:'',
		Tel:'',
		Btel:'',
		id:'',
		formit:0,
		carType:'选择车辆信息',
		theSelectTruckLength:'',  //选择车长
		theSelectProducts:'',     //选择车型
		isShowTextArea:false,     //是否显示textarea
		activeCarIndex:'-1',     //点击选择车长的状态
		activeCarTypeIndex:'-1',   //车型状态
		activeInfomationIndex:'-1',  //选择货物类型
		activePayIndex:'-1',     //选择付款方式
		selfContent:[],       //添加自定义
	},
	init:function(){
		if(!app.regionStatus){
			if(app._itemId){
				this.setData({
					id:app._itemId
				});
				util.analytics({
					t:'pageview',
					dh:'wuliu.360che.com',
					cd1:app.uid,
					dt:'修改货源',
					dp:'/add/add'
				});
				this.reEdit();
			}else{
				this.getContact();
				this.setData({
					loading:true,
					msg:'',
					theSelectInfomation:'',
					theSelectPay:'',
					start:"请选择出发地",
					end:"请选择目的地",
					formit:0,
					id:''
				});
				util.analytics({
					t:'pageview',
					dh:'wuliu.360che.com',
					cd1:app.uid,
					dt:'添加货源',
					dp:'/add/add'
				})
			};
		}
		app.regionStatus = false;
		this.regionSelectCallback('fromid','start','startOptions');
		this.regionSelectCallback('toid','end','endOptions');
		var that = this;
		//获取车型车长缓存
		var value = wx.getStorageSync('chooseCars');
		var valueLength = wx.getStorageSync('chooseCarsLength');
		that.setData({
			products:value,
			truckLength:valueLength,
		})
		wx.getStorage({
			key:'carType',
			success:function(res){
				var truckLength = res.data.truckLength,
						products    = res.data.products;
				var activeCarIndex = that.data['truckLength'].indexOf(truckLength),
						activeCarTypeIndex =
				that.data['products'].indexOf(products);
				that.setData({
					carType: truckLength + ',' + products,
					theSelectTruckLength:truckLength,
					theSelectProducts:products,
					activeCarIndex:activeCarIndex,
					activeCarTypeIndex:activeCarTypeIndex
				})
			}
		})
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
	reEdit:function(){    //点击修改
		let that = this;
		wx.request({
				url:app.ajaxurl,
				data:{
					c:'cargood',
					m:'GetDetailsInfo',
					id:app._itemId,
					ts:+new Date(),
					version:1
				},
				success:function(res){
					that.setData({
						formit:1
					})
					let o = res.data;
					if(o.info == 'ok'){
						let data = o.data;
						let activeCarTypeIndex = that.data['products'].indexOf(data.ProductId);//车型
						let activeCarIndex = that.data['truckLength'].indexOf(data.truckLength);//车长

						that.setData({
							start:data.FromProName + ',' + data.FromCityName + ',' + (data.FromAeraName == '0' ? '' : data.FromAeraName),
							end:data.ToProName + ',' + data.ToCityName + ',' + (data.ToAeraName == '0' ? '' : data.ToAeraName),
							carType:data.truckLength + ',' + data.ProductId,
							theSelectTruckLength:data.truckLength,
							theSelectProducts:data.ProductId,
							activeCarTypeIndex:activeCarTypeIndex,
							activeCarIndex:activeCarIndex,
							theSelectPay:'',
							theSelectInfomation:'',
							msg:(data.msInfo == 'undefined' || data.msInfo == ',') ? '' : data.msInfo,
							Uname:data.Uname,
							Tel:data.Tel,
							Btel:data.Btel
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
	regionSelectCallback:function(key,name,options){//获取选择地区
		let that = this;
		wx.getStorage({
			key:key,
			success:function(res){
				let data = res.data;
					that.setData({
						[name]:data.province['name'] + ',' + data.city['name'] + ',' + (data.district['name'] == '全部' ? '' : data.district['name']),
						[options]:data.province['id'] + ',' + data.city['id'] + ',' + (data.district['id'] == '' ? '' : data.district['id'])
					})
			}
		})
	},
	getEditInfo:function(){//通过分享第一次进入的用户。
    var that = this;
		app.getUserInfo(function(userInfo){//获取用户信息
			let nickname = userInfo.nickName;
			wx.request({
	      url:app.ajaxurl,
	      data:{
	        c:'cargood',
	        m:'getuserdetailsinfo',
	        uid:app.uid,
	        nickName:nickname,
					version:1
	      },
	      success:function(res){
					if(res.data.data.nickName === 'undefined'){//如果是返回undefined，那就更改名字为微信名字
						wx.request({
							url:app.ajaxurl,
							data:{
								c:'cargood',
				        m:'updateusernickname',
								uid:app.uid,
								nickName:nickname
							}
						})
					}
	      }
	    })
		})
  },
	onLoad:function(){
		if(this.loaded) return;
		this.init();
		this.getEditInfo()
		this.getProvince()
	},
	onShow:function(){
		if(this.loaded){
			this.init();
		}else{
			this.loaded = true;
		}
	},
	getRequest:function(o,suc,err){ //进行请求上传
    wx.request({
      url:app.ajaxurl,
      data:o,
      success:function(res){
        UT.isFunction(suc) && suc( res.data )
      },
      fail:function(res){
        UT.isFunction(err) && err(res.data)
      }
    })
  },
	getProvince:function(){//进行省份请求
		var that = this
		var value = wx.getStorageSync('chooseCity')
		that.setData({
			proData:value.data,
			theSelect:'全国'
		})
	},
	getCity:function(e){//获取城市
		var that = this;
		var index = e.target.dataset.index;
		var p = this.data.proData,
				c = [];
		c.push(p[index].cityList)
		var selectPro = p[index].province_name;
		var selectProId = p[index].province_id;
		that.setData({
			showData:2,
			cityData:c[0],
			selectedProvince:{
				id:selectProId,
				name:selectPro
			},
			selectPro:selectPro,
			theSelect:selectPro,
			selectProId:selectProId
		})
	},
	getDistrict:function(e){//获取区县
		var index = e.target.dataset.index;
		var that = this;
		var selectCity = that.data.cityData[index].name;
		var selectCityId = index;
		var distData = that.data.cityData[index].list;
		that.setData({
			distData:distData,
			showData:3,
			selectCities:{
				id:index,
				name:selectCity
			},
			selectCity:selectCity,
			theSelect:selectCity,
			selectCityId:selectCityId
		})
	},
	backToAdd:function(){//返回到add界面
		this.setData({
			isShow:false,
			isShowTextArea:false
		})
	},
	backToFront:function(){//返回到省级
		this.setData({
			showData:1,
			theSelect:'全国'
		})
	},
	backToSecond:function(){//返回到市级
		this.setData({
			showData:2,
			theSelect:this.data.selectPro
		})
	},
	selectAll:function(e){//选择其他的区县
		var index = e.target.dataset.index;
		var that = this;
		var selectDist = that.data.distData[index];
		var selectDistId = index;
		if(app.selectPro){
			that.setData({
				isShow:false,
				isShowTextArea:false,
				selectedCity:{
						id:index,
						name:selectDist
				},
				start:that.data.selectPro + ',' + that.data.selectCity + ',' + selectDist,
				startOptions:that.data.selectProId + ',' + that.data.selectCityId + ',' + selectDistId
			})
			wx.setStorage({
					key:'fromid',
					data:{
							province:this.data['selectedProvince'],
							city:this.data['selectCities'],
							district:this.data['selectedCity']
					}
			})
		}else{
			that.setData({
				isShow:false,
				isShowTextArea:false,
				selectedCity:{
						id:index,
						name:selectDist
				},
				end:that.data.selectPro + ',' + that.data.selectCity + ',' + selectDist,
				endOptions:that.data.selectProId + ',' + that.data.selectCityId + ',' + selectDistId
			})
			wx.setStorage({
					key:'toid',
					data:{
							province:this.data['selectedProvince'],
							city:this.data['selectCities'],
							district:this.data['selectedCity']
					}
			});
		}
	},
	chooseAll:function(e){//选择全部的时候
		var that = this;
		var index = e.target.id;
		var selectDist = '全部'
		if(app.selectPro){
			that.setData({
				isShow:false,
				isShowTextArea:false,
				selectedCity:{
						id:e.target.id,
						name:selectDist
				},
				start:that.data.selectPro + ',' + that.data.selectCity + ',' + (selectDist == '全部' ? '' : selectDist),
				startOptions:that.data.selectProId + ',' + that.data.selectCityId
			})
			wx.setStorage({
					key:'fromid',
					data:{
							province:this.data['selectedProvince'],
							city:this.data['selectCities'],
							district:this.data['selectedCity']
					}
			})
		}else{
			that.setData({
				isShow:false,
				isShowTextArea:false,
				selectedCity:{
						id:e.target.id,
						name:selectDist
				},
				end:that.data.selectPro + ',' + that.data.selectCity + ',' + (selectDist == '全部' ? '' : selectDist),
				endOptions:that.data.selectProId + ',' + that.data.selectCityId
			})
			wx.setStorage({
					key:'toid',
					data:{
							province:this.data['selectedProvince'],
							city:this.data['selectCities'],
							district:this.data['selectedCity']
					}
			})
		}
	},
	selectCar:function(){//选择车辆信息
		this.setData({
			isShowSelectCar:true,
			isShowTextArea:true
		})
	},
	backToSelectCar:function(){ //返回add
		this.setData({
			isShowSelectCar:false,
			isShowTextArea:false
		})
	},
	selectTruckLength:function(e){//选择车长
		var index = e.target.dataset.index;
		var that = this;
		var selectTruckLength = that.data.truckLength[index]
		that.setData({
			activeCarIndex:index,
			selectTruckLengthId:index,
			theSelectTruckLength:selectTruckLength
		})
	},
	selectProducts:function(e){//选择车型
		var index = e.target.dataset.index;
		var that = this;
		var selectProducts = that.data.products[index]
		that.setData({
			activeCarTypeIndex:index,
			selectProductsId:index,
			theSelectProducts:selectProducts
		})
	},
	trueSelectCarType:function(){//确认选择
		var data = this.data;
		if(data.theSelectTruckLength == ''){
			this.errorInfo('请选择车长')
		}else if(data.theSelectProducts == ''){
			this.errorInfo('请选择车型')
		}else{
			this.setData({
				isShowSelectCar:false,
				isShowTextArea:false,
				carType:data.theSelectTruckLength + ',' + data.theSelectProducts
			})
			wx.setStorage({//存储车辆信息
				key:'carType',
				data:{
					truckLength:data.theSelectTruckLength,
					products:data.theSelectProducts
				}
			})
		}
	},
	selectRegion:function(e){//点击选择城市
		let name = e.target.dataset['name'];
		app.regionStatus = true;
		this.getProvince()
		this.setData({
			isShow:true,
			isShowTextArea:true,
			showData:1
		})
		if(name == 'fromid'){
			app.selectPro = true
		}else{
			app.selectPro = false
		}
	},
	inputValue:function(e){
		var msgInput = e.detail.value;
		this.setData({
			msgInput:msgInput
		})
	},
	errorInfo:function(v){
		wx.showModal({
			title: '错误提示',
			content:v,
			showCancel: false
		})
	},
	backToSelectInfo:function(){//返回选择常用信息
		this.setData({
			isShowSelectInfo:false,
			theSelectInfomation:'',
			theSelectPay:'',
		})
	},
	selectInfo:function(){//选择常用信息
		var value = wx.getStorageSync('infomations')
		if (value) {
			this.setData({
				infomations:value,
			})
		}
		this.setData({
			isShowSelectInfo:true,
			theSelectInfomation:'',
			theSelectPay:'',
			activeInfomationIndex:'-1',
			activePayIndex:'-1'
		})
	},
	selectInfomations:function(e){  //选择货物信息
		var index = e.target.dataset.index;
		var that = this;
		var theSelectInfomation = that.data.infomations[index];
		this.setData({
			theSelectInfomation:theSelectInfomation,
			activeInfomationIndex:index,
		})
	},
	selectPay:function(e){  //选择付款方式
		var index = e.target.dataset.index;
		var that = this;
		var theSelectPay = that.data.pays[index];
		this.setData({
			theSelectPay:theSelectPay,
			activePayIndex:index,
		})
	},
	selectInfoAndPay:function(){ //确定选择
		var data = this.data;
		this.setData({
			theSelectInfomation:data.theSelectInfomation != '' ? data.theSelectInfomation : '',
			theSelectPay:data.theSelectPay != '' ? data.theSelectPay : '',
			isShowSelectInfo:false,
			msg:(data.theSelectInfomation != '' ? data.theSelectInfomation : '') + (data.theSelectPay != '' ? data.theSelectPay : ''),
			msgInput:''
		})
	},
	byMyself:function(){//自定义文字
		var value = wx.getStorageSync('selfContent')
		if (value) {
			this.setData({
				selfContent:value
			})
		}
		this.setData({
			isShowSelectInfo:false,
			isShowSelf:true,
		})
	},
	selfClose:function(){//关闭弹层，返回
		var data = this.data;
		var d = ['普货','重货','泡货','设备','配件','百货','建材','饮料','化工','水果','蔬菜','木材','煤炭','石材','其他'];
		var e = [];
		e = data.selfContent;
		d = e.concat(d)
		this.setData({
			isShowSelf:false,
			isShowSelectInfo:true,
			infomations:d,
			activePayIndex:'-1',
			activeInfomationIndex:'-1',
			theSelectInfomation:'',
		})
		wx.setStorage({
			key:'infomations',
			data:data.infomations
		})
		wx.setStorage({
			key:'selfContent',
			data:e
		})
	},
	selfInput:function(e){//input输入自定义
		var selfInput = e.detail.value;
		this.setData({
			selfInput:selfInput,
		})
	},
	selfAdd:function(){//添加自定义文字
		var c = [];
		var data = this.data;
		c = c.concat(data.selfInput)
		if(data.selfInput){
			if(data.selfContent.length < 5){
				this.setData({
					selfContent:data.selfContent.concat(c),
					selfInput:'',
				})
			}else{
				this.errorInfo('自定义数量不能超过5个')
			}
		}else{
			this.errorInfo('输入不能为空')
		}

	},
	removeItems:function(e){
		var index = e.target.dataset.index;
		var c = this.data.selfContent;
		c.splice(index,1)
		this.setData({
			selfContent:c
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
					})
				}
			}
		})
	},
	formSubmit:function(e){
		let formData = e.detail.value,
				pageData = this.data,
				pattern = new RegExp('^1(([38]\\d)|(4[57])|(5[012356789])|(7[01678]))\\d{8}$');
		if(!pageData['start']){
			this.errorInfo('请选择出发地')
		}else if(!pageData['end']){
			this.errorInfo('请选择目的地')
		}else if(!formData['username']){
			this.errorInfo('请输入联系人')
		}else if(!formData['tel'] || !pattern.test(formData['tel'])){
			this.errorInfo('请输入正确的联系电话')
		}else if(formData['btel'] && formData['btel'] == formData['tel']){
			this.errorInfo('备用电话不能与联系电话相同')
		}else if(pageData.carType == '选择车辆信息'){
			this.errorInfo('请选择车辆信息')
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
				productid:pageData.activeCarTypeIndex + 1,
				msinfo:!pageData['msgInput'] ? pageData['msg'] : pageData['msgInput'],
				fromplace:pageData['start'],
				toplace:pageData['end'],
				truckLength:pageData.activeCarIndex,
				ts:+new Date(),
				version:1
			};
			if(!pageData['id']){		// 发布
				this._submit(submitData,'提交成功')
			}else{
				submitData['id'] = pageData['id'];
				this._submit(submitData,'修改成功')
				util.analytics({
					t:'event',
					ec:'发布货源成功',
					ea:pageData['id'],
					el:pageData['start'] + '|' + pageData['end'],
					dp:'/add/add'
				});
			}
		}
	}
})
