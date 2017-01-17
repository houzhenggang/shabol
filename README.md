# 极速配 wxapp 数据接口

## 目录
#### &sect; [概述](#overview)

#### &sect; [类别](#category)
* [货源列表](#list)
* [货源详情](#detail)
* [新增货源](#add)
* [修改发布状态](#editPublishStatus)
* [修改货源状态](#editGoodsStatus)
* [获取城市](#getCity)
* [获取地区](#getDistribute)
* [添加关注](#follow)

****
## <a name="overview"> &sect; 概述</a>
接口主要是针对wx.request发起的 HTTPS 请求，请求的content-type 默认为 'application/json';微信客户端的TLS版本为1.2，我们之前也遇到过一部分锤子等Android 机型还未支持 TLS 1.2，所以数据接口的开发人员要确保服务器的TLS版本能够向下兼容，请求的默认最大时长为60s，最大并发数为5个。

****
## <a name="list"> &sect; 货源列表</a>

请求说明

```
GET /list HTTP/2.0
Host:https://56-api.kcimg.cn

货源列表（发布中/已关闭）数据

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | getlist | 默认参数
category | string | 1 | 1是关闭 0是发布 | 货源类型
userid | string | 1 | openid | 当前用户openid
page | string | 1 | int | 分页
ts | string | 1 | int | 时间戳


请求实例

```

c=cargood&m=getlist&category=0&userid=o9WMY0XmtYJ7ssOQ71i5eh4xfCtw&page=1&ts=1484553182686

```

返回结果

每次返回10条数据，如不足10条，则不再请求

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:{
            status:1,           // 数据状态，还有数据为1，无数据为0
            list:[
                {
                    FromAeraName:0,                         // 出发地区/县
                    FromCityName:'北京市',                  // 出发地城市
                    FromProName:'北京',                     // 出发地省份
                    ProductId:'高栏车',                     // 车辆类型
                    ToAeraName:0,                           // 目的地区/县
                    ToCityName:'厦门市',                     // 目的地城市
                    ToProName:'福建',                       // 目的地省份
                    id:666,                                 // 货源id
                    msInfo:'求高栏车...',                   // 货源详情
                    truckLength:'13米'                       // 车长
                },
                ...
            ]
        },
    }
```
