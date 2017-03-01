App({
    onLaunch:function(){
        this.ajaxurl='https://56-api.kcimg.cn/';
        this.setCity()
        this.setCars()
        this.setCarLength()
    },
    globalData: {
      hasLogin: false,
      wxCode: ''
    },
    getUserInfo:function(cb){
        let that = this
        if(this.globalData.userInfo){
          typeof cb == "function" && cb(this.globalData.userInfo)
        }else{
          //调用登录接口
          wx.login({
            success: function () {
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo
                  typeof cb == "function" && cb(that.globalData.userInfo)
                }
              })
            }
          })
        }
    },
    setCity:function(){
      // https://56-api.kcimg.cn/?c=cargood&m=proallcity
      var p = {
  			c:'cargood',
  			m:'proallcity',
  			ts:+new Date(),
        version:1
  		}
      wx.request({
        url:this.ajaxurl,
        data:p,
        success:function(res){
  				wx.setStorage({
  						key:'chooseCity',
  						data:res.data
  				})
        }
      })
    },
    setCars:function(){
      var p = {
        c:'cargood',
        m:'getproduct',
        ts:+new Date(),
        version:1
      }
      wx.request({
        url:this.ajaxurl,
        data:p,
        success:function(res){
          var res = res.data;
          var pro = [];
          for (let key in res.data) {
      			pro.push(res.data[key].model_name)
      		}
  				wx.setStorage({
  						key:'chooseCars',
  						data:pro
  				})
        }
      })
    },
    setCarLength:function(){
      var p = {
        c:'cargood',
        m:'getcarlength',
        ts:+new Date(),
        version:1
      }
      wx.request({
        url:this.ajaxurl,
        data:p,
        success:function(res){
          var res = res.data;
          var p = [];
          for(var i=0;i<res.data.length;i++){
            var c = res.data[i] + '米'
            p.push(c)
          }
  				wx.setStorage({
  						key:'chooseCarsLength',
  						data:p
  				})
        }
      })
    }
});
