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

## <a name="detail"> &sect; 货源详情</a>

请求说明

```
GET /detail HTTP/2.0
Host:https://56-api.kcimg.cn

货源详情数据

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | GetDetailsInfo | 默认参数
id | string | 1 | 货源id | 货源id
ts | string | 1 | int | 时间戳


请求实例

```
c=cargood&m=GetDetailsInfo&id=666&ts=1484621900895

```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:{
              status:1,                               // 数据状态，还有数据为1，无数据为0
              FromAeraName:0,                         // 出发地区/县
              FromCityName:'北京市',                  // 出发地城市
              FromProName:'北京',                     // 出发地省份
              ProductId:'高栏车',                     // 车辆类型
              ToAeraName:0,                           // 目的地区/县
              ToCityName:'厦门市',                     // 目的地城市
              ToProName:'福建',                       // 目的地省份
              id:666,                                 // 货源id
              msInfo:'求高栏车...',                   // 货源详情
              truckLength:'13米',                     // 车长
              Tel:'17052552768',                      // 电话
              Btel:'17055765768',                      // 备用电话
              Uname:'老牛'                              // 联系人
            ]
        },
    }
```

## <a name="add"> &sect; 新增货源</a>

请求说明

```
POST /add HTTP/2.0
Host:https://56-api.kcimg.cn

添加货源

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | addSource | 默认参数
openid | string | 1 | openid | 当前用户openid
uname | string | 1 | 用户姓名 | 联系人
tel　| string | 1 | 11位手机号码 | 联系电话
btel | string | 0 | 11位手机号码 | 备用电话
fromid | string | 1 | 省份id,城市id,区县id | 出发地id
toid | string | 1 | 省份id,城市id,区县id | 目的地id
productid | string | 1 | 0-9 | 车辆类型
msinfo | string | 0 | 200字以内 | 详情描述
fromplace | string | 1 | 省份,城市,区县 | 出发地
toplace | string | 1 | 省份,城市,区县 | 目的地
truckLength | sting | 1 | 0-6 | 车长
ts | string | 1 | int | 时间戳


请求实例

```
c=cargood&m=addSource&openid=o9WMY0XmtYJ7ssOQ71i5eh4xfCtw&uname=%E8%80%81%E5%BC%A0&tel=17052552768&btel=&fromid=110000%2C110100&toid=620000%2C620500&productid=3&msinfo=%E6%B1%82%E9%AB%98%E6%A0%8F%E8%BD%A6%EF%BC%8C%E9%80%9F%E6%9D%A5&fromplace=%E5%8C%97%E4%BA%AC%2C%E5%8C%97%E4%BA%AC%E5%B8%82&toplace=%E7%94%98%E8%82%83%2C%E5%A4%A9%E6%B0%B4%E5%B8%82&truckLength=0&ts=1484622335000

```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:{
              status:1,                               // 数据状态，还有数据为1，无数据为0
              msg:'提交成功'                          // 错误信息
            ]
        },
    }
```
