var app = getApp()
var UT = require('../../util/request.js')
var util = require('../../util/util.js');
Page({
  data:{
    index:'',
    disab:true, //判断是否填写
    nickName:'',
    response:[],
    content:'',//填写名字
    info:'',   //详细介绍
    tel:'',   //电话
    oldTel:'',//第一次电话号码
    btel:'',  // 备用电话
    codeNum:'',  //输入的验证码
    getCode:'',  //获取到的验证码
    showTopTips:false,  //是否显示提示
    showTopTxt:'',  //提示内容
    btnTxt:'获取验证码',
    cutdown:60,   //倒数计时60s
    Coding:false  //是否可以点击
  },
  setStorage:function(o){  //缓存
    wx.setStorage({
      key:'editInfomation',
      data:o
    })
  },
  showTip:function(b,txt){//是否显示提示
    this.setData({
      showTopTips:b,
      showTopTxt:txt
    })
  },
  setDisab:function(e){//button是否可点击
    if(e){
      this.setData({
        disab:false,
      })
    }else{
      this.setData({
        disab:true,
      })
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
  onLoad:function(options){
    var index = options.id,
        that = this;
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        nickName:userInfo.nickName
      })
    })
    app.uid = wx.getStorageSync('userid');
    util.analytics({
			t:'pageview',
			dh:'wuliu.360che.com',
			cd1:app.uid,
			dt:'修改信息',
			dp:'/editInfo/index'
		});
    wx.getStorage({//获取本地缓存
			key:'editInfomation',
			success:function(res){
				that.setData({
          content:res.data.Name,
          info:res.data.Info,
          tel:res.data.Tel,
          btel:res.data.Btel
        })
			}
		})
    that.setData({//获取点击的id
      index:index,
    })
  },
  textInput:function(e){ //名字输入
    var that = this;
    that.setDisab(e.detail.value.length)
    that.data.content = e.detail.value
  },
  infoInput:function(e){  //介绍输入
    var that = this;
    that.setDisab(e.detail.value.length)
    that.data.info = e.detail.value
  },
  telInput:function(e){   //电话输入
    var that = this;
    that.setDisab(e.detail.value.length)
    if(that.data.tel === ''){
      that.data.oldTel = e.detail.value
    }
    that.data.tel = e.detail.value
  },
  btelInput:function(e){  //备用电话输入
    var that = this;
    that.setDisab(e.detail.value.length)
    that.data.btel = e.detail.value
  },
  codeInput:function(e){   //验证码输入
    var that = this
    that.setData({
      codeNum:e.detail.value
    })
  },
  getCode:function(){//获取验证码
    var that = this;
    var CodeData = {
      c:'cargood',
      m:'updateuserphonenum',
      uid:app.uid,
      status:1,
      num:this.data.tel,
			version:1
    }
    if((/^1[3|4|5|7|8]\d{9}$/.test(this.data.tel))){
      console.log(that.data.oldTel)
      if(this.data.tel !== this.data.oldTel && this.data.oldTel !== ''){
        that.getRequest(CodeData,(res)=>{
          that.setTime()  //倒计时
          util.analytics({
            t:'event',
            ec:'获取验证码',
            ea:'',
            el:'',
            dp:'/editInfo/editInfo'
          });
        },(res)=>{
          that.showTip(true,'获取验证码失败')
          })
        }else{
          that.showTip(true,'新旧手机号不能相同')
        }
      }else{
        that.showTip(true,'手机号输入有误')
      }
    setTimeout(() => {
      that.setData({
        showTopTips:false
      })
    }, 800)
  },
  setTime:function(){//倒数60s
    if(this.data.cutdown === 0){
      this.setData({
        btnTxt:'获取验证码',
        cutdown:60,
        Coding:false
      })
    }else{
      let txt = "重新发送(" + this.data.cutdown + ")"
      let s = this.data.cutdown
      s--
      this.setData({
        btnTxt:txt,
        cutdown:s,
        Coding:true
      })
      setTimeout(() => {
        this.setTime()
      }, 1000)
    }
  },
  editInformations:function(e){   //进行确定提交
    var that = this;
    var data = {   //进行储存的数据
      Name:that.data.content,
      Info:that.data.info,
      Tel:that.data.tel,
      Btel:that.data.btel,
			version:1
    }
    var NameData = {
      c:'cargood',
      m:'updateusernickname',
      uid:app.uid,
      nickName:this.data.content,
			version:1
    }
    var InfoData = {
      c:'cargood',
      m:'updateuserinfo',
      uid:app.uid,
      info:this.data.info,
			version:1
    }
    var getCode = {  //验证手机号
        c:'cargood',
        m:'updateuserphonenum',
        uid:app.uid,
        status:1,
        num:this.data.tel,
        code:this.data.codeNum,
  			version:1
    }
    var getBtel = {
      c:'cargood',
      m:'updateuserphonenum',
      uid:app.uid,
      status:2,
      num:this.data.btel,
			version:1
    }
    if(that.data.index == 0){  //姓名
      that.getRequest(NameData,(res)=>{
        data['Name']=this.data.content
        that.setStorage(data)
        wx.navigateBack()
        util.analytics({
          t:'event',
          ec:'修改姓名成功',
          ea:'',
          el:'',
          dp:'/editInfo/editInfo'
        });
      },(res)=>{
        that.showTip(true,'修改失败')
      })

    }else if(that.data.index == 1){  // 介绍
      that.getRequest(InfoData,(res)=>{
        data['Info']=this.data.info
        that.setStorage(data)
        wx.navigateBack()
        util.analytics({
          t:'event',
          ec:'修改介绍成功',
          ea:'',
          el:'',
          dp:'/editInfo/editInfo'
        });
      },(res)=>{
        that.showTip(true,'修改失败')
      })
    }else if(that.data.index == 2){  // 电话
      if(that.data.codeNum !== '' && that.data.codeNum.length === 4){
        that.getRequest(getCode,(res)=>{
          if(res.data.status === 1){
            data['Tel']= that.data.tel
            that.setData({
              oldTel:that.data.tel
            })
            console.log(that.data.oldTel)
            that.setStorage(data)
            wx.navigateBack()
            util.analytics({
              t:'event',
              ec:'修改电话成功',
              ea:'',
              el:'',
              dp:'/editInfo/editInfo'
            });
          }else{
            that.showTip(true,'输入验证码有误')
          }
        })
      }else{
          that.showTip(true,'请输入正确的验证码')
        }
    }else{   //备用电话
      that.getRequest(getBtel,(res)=>{
        data['Btel']=that.data.btel
        that.setStorage(data)
        wx.navigateBack()
        util.analytics({
          t:'event',
          ec:'修改备用电话成功',
          ea:'',
          el:'',
          dp:'/editInfo/editInfo'
        });
      })
    }
    setTimeout(() => {
      that.setData({
        showTopTips:false
      })
    }, 800)
  }
})
