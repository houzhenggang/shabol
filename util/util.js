let app = getApp();

const _exports = {
    getUserInfo:function(callback,page){
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: app.ajaxurl,
                        data: {
                            c:'caruser',
                            m:'login',
                            code: res.code,
                            ts:+new Date()
                        },
                        success:function(res){
                            if(res && res.data){
                                app.uid = res.data['msg'];
                                wx.setStorageSync('userid',app.uid);
                                callback && callback(app.uid,page);
                            }
                        }
                    })
                }
            }
        });
    }
};
module.exports = _exports;
