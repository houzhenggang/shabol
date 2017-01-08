let app = getApp();
Page({
    data:{
      Tel:'',
      list:[],
    },
    onLoad:function(options){
        let that = this;
        wx.request({
            url:app.ajaxurl,
            data:{
                c:'cargood',
                m:'GetDetailsInfo',
                id:options['id'],
                ts:+new Date()
            },
            success:function(res){
                res = res.data;
                that.setData(res.data);
            }
        });
    },
    makePhoneCall:function(){
        wx.makePhoneCall({
            phoneNumber:this.data.Tel
        })
    }
})
