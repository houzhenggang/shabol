let app = getApp(),
	util = require('../../util/util.js'),
	UT = require('../../util/request.js')
Page({
	data:{
		loading:false,
		products:["平板车","栏板车","高栏车","厢式车","冷藏车","槽罐车","骨架车","大件运输","自卸车","不限车型"],
		// products:["高栏车","厢式车","冷藏车","保温车","平板车","危险品","自卸车","大件运输"]
		// selecedIndex:2,
		// truckLength:["18米以上","17.5米","17米","16.5米","16米","15米","14.6米","13.5米","13米","12.5米","9.6米","8.6米","7.6米","7.2米","6.8米","6.2米","5.2米","4.2米","3.8米"],
		truckLength:["不限车长","4.2米","6.8米","9.6米","13米","15米","17.5米"],
		// currentIndex:4,
		start:"请选择出发地",
		end:"请选择目的地",
		msinfo:'',
		// ProductId:2,
		addMsg:'',
		msg:'',
		Uname:'',
		Tel:'',
		Btel:'',
		id:'',
		formit:0,
		carType:'选择车辆信息',
		theSelectTruckLength:'',  //选择车长
		theSelectProducts:'',     //选择车型
		isShowTextArea:true,     //是否显示textarea
		activeCarIndex:'-1',     //点击选择车长的状态
		activeCarTypeIndex:'-1',   //车型状态
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
					// selecedIndex:2,
					// ProductId:2,
					msg:'',
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
					ts:+new Date()
				},
				success:function(res){
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
		var proData = {
			c:'cargood',
			m:'procity',
			ts:+new Date()
		}
		that.getRequest(proData,(res)=>{
			var p = [];
			for(var i = 0;i<res.data.length;i++){
				p.push(res.data[i])
			}
			that.setData({
				proData:p,
				theSelect:'全国'
			})
		})
	},
	getCity:function(e){//获取城市
		var index = e.target.dataset.index;
		var that = this;
		var cityData = {
			c:'cargood',
			m:'ajaxGetNewCity',
			proid:e.target.id,
			ts:+new Date()
		}
		var selectPro = that.data.proData[index].province;
		var selectProId = that.data.proData[index].provinceid;
		that.getRequest(cityData,(res)=>{
			var c = [];
			for(var i = 0;i<res.data.length;i++){
				c.push(res.data[i])
			}
			that.setData({
				cityData:c,
				showData:2,
				selectedProvince:{
					id:e.target.id,
					name:selectPro
				},
				selectPro:selectPro,
				theSelect:selectPro,
				selectProId:selectProId
			})
		})
	},
	getDistrict:function(e){//获取区县
		var index = e.target.dataset.index;
		var that = this;
		var disData = {
			c:'cargood',
			m:'ajaxGetNewCity',
			cityid:e.target.id,
			ts:+new Date()
		}
		var selectCity = that.data.cityData[index].name;
		var selectCityId = that.data.cityData[index].id;
		that.getRequest(disData,(res)=>{
			var d = [];
			for(var i = 0;i<res.data.length;i++){
				d.push(res.data[i])
			}
			that.setData({
				distData:d,
				showData:3,
				selectCities:{
					id:e.target.id,
					name:selectCity
				},
				selectCity:selectCity,
				theSelect:selectCity,
				selectCityId:selectCityId
			})
		})
	},
	backToAdd:function(){//返回到add界面
		this.setData({
			isShow:false,
			isShowTextArea:true
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
		var selectDist = that.data.distData[index].name;
		var selectDistId = that.data.distData[index].id;
		if(app.selectPro){
			that.setData({
				isShow:false,
				isShowTextArea:true,
				selectedCity:{
						id:e.target.id,
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
			});
		}else{
			that.setData({
				isShow:false,
				isShowTextArea:true,
				selectedCity:{
						id:e.target.id,
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
		var selectDist = '全部'
		if(app.selectPro){
			that.setData({
				isShow:false,
				isShowTextArea:true,
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
				isShowTextArea:true,
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
			isShowTextArea:false
		})
	},
	backToSelectCar:function(){ //返回add
		this.setData({
			isShowSelectCar:false,
			isShowTextArea:true
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
			wx.showModal({
				title:'错误信息',
				content:'请选择车长',
				showCancel:false
			})
		}else if(data.theSelectProducts == ''){
			wx.showModal({
				title:'错误信息',
				content:'请选择车型',
				showCancel:false
			})
		}else{
			this.setData({
				isShowSelectCar:false,
				isShowTextArea:true,
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
			isShowTextArea:false,
			showData:1
		})
		if(name == 'fromid'){
			app.selectPro = true
		}else{
			app.selectPro = false
		}
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
					})
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
				// productid:parseInt(formData['productid']) + 1,
				productid:pageData.selectProductsId + 1,
				msinfo:pageData['msinfo'],
				fromplace:pageData['start'],
				toplace:pageData['end'],
				// truckLength:formData['truckLength'],
				truckLength:pageData.selectTruckLengthId,
				ts:+new Date()
			};
			if(!pageData['id']){		// 发布
				this._submit(submitData,'提交成功')
			}else{									// 修改
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
