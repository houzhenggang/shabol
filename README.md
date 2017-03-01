# shabol-wxapp 数据接口

## 目录
#### &sect; [概述](#overview)

#### &sect; [类别](#category)
* [货源列表](#list)
* [货源详情](#detail)
* [新增货源](#add)
* [修改货源信息](#edit)
* [更新货源状态](#updateStatus)
* [获取城市](#getCity)
* [获取区/县](#getDistrict)
* [添加关注](#follow)
* [获取关注状态](#followStatus)
* [获取车型接口](#products)
* [获取车长接口](#truckLength)
* [获取全部城市接口](#allCity)

## <a name="overview"> &sect; 概述</a>
接口主要是针对wx.request发起的 HTTPS 请求，请求的content-type 默认为 'application/json';微信客户端的TLS版本为1.2，我们之前也遇到过一部分锤子等Android 机型还未支持 TLS 1.2，所以数据接口的开发人员要确保服务器的TLS版本能够向下兼容，请求的默认最大时长为60s，最大并发数为5个。

## <a name="list"> &sect; 货源列表</a>

请求说明

```
GET /list HTTP/2.0
Host:https://56-api.kcimg.cn

*货源列表（发布中/已关闭）数据*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | getlist | 默认参数
category | string | 1 | 1是关闭 0是发布 | 状态
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

*货源详情数据*

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
        }
    }
```

## <a name="add"> &sect; 添加货源</a>

请求说明

```
POST /add HTTP/2.0
Host:https://56-api.kcimg.cn

*添加货源*

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
            msg:'提交成功',                          // 反馈信息
            id:666                                  // 添加信息id
        }
    }
```

## <a name="edit"> &sect; 修改货源信息</a>

请求说明

```
POST /edit HTTP/2.0
Host:https://56-api.kcimg.cn

*修改货源信息*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | addSource | 默认参数
id | string | 1 | 货源id | 货源id
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
c=cargood&m=addSource&id=666&openid=o9WMY0XmtYJ7ssOQ71i5eh4xfCtw&uname=%E8%80%81%E5%BC%A0&tel=17052552768&btel=&fromid=110000%2C110100&toid=620000%2C620500&productid=3&msinfo=%E6%B1%82%E9%AB%98%E6%A0%8F%E8%BD%A6%EF%BC%8C%E9%80%9F%E6%9D%A5&fromplace=%E5%8C%97%E4%BA%AC%2C%E5%8C%97%E4%BA%AC%E5%B8%82&toplace=%E7%94%98%E8%82%83%2C%E5%A4%A9%E6%B0%B4%E5%B8%82&truckLength=0&ts=1484622335000

```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:{
            status:1,                               // 数据状态，还有数据为1，无数据为0
            msg:'修改成功'                          // 反馈信息
        },
    }
```

## <a name="updateStatus"> &sect; 更新货源状态</a>

请求说明

```
POST /updateStatus HTTP/2.0
Host:https://56-api.kcimg.cn

*更新货源状态*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | UpdateStatus | 默认参数
id | string | 1 | 货源id | 货源id
category | string | 1 | 0:发布 1:关闭 2:删除 | 状态
userid | string | 1 | openid | 当前用户openid
ts | string | 1 | int | 时间戳


请求实例

```
c=cargood&m=UpdateStatus&category=1&id=768&userid=o9WMY0XmtYJ7ssOQ71i5eh4xfCtw&ts=1484623703469

```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:{
              status:1,                               // 数据状态，还有数据为1，无数据为0
              msg:'修改成功'                          // 反馈信息
        }
    }
```

## <a name="getCity"> &sect; 获取城市</a>

请求说明

```
GET /getCity HTTP/2.0
Host:https://56-api.kcimg.cn

*获取城市*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | ajaxGetNewCity | 默认参数
proid | string | 1 | 省份id | 省份id
ts | string | 1 | int | 时间戳


请求实例

```
c=cargood&m=ajaxGetNewCity&proid=620000&ts=1484623703469

```

返回结果

```
    {
        info:"ok",                                    // 接口状态，非异常为ok，异常为error
        data:[
            {
                id:'620100',                          // 城市id
                name:'兰州市'                          // 城市名
            },
            {
                id:'620200',                          // 城市id
                name:'嘉峪关市'                       // 城市名
            },
            ...
        ]
    }
```

## <a name="getDistrict"> &sect; 获取区/县</a>

请求说明

```
GET /getDistrict HTTP/2.0
Host:https://56-api.kcimg.cn

*获取区/县*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | ajaxGetNewCity | 默认参数
cityid | string | 1 | 城市id | 城市id
ts | string | 1 | int | 时间戳


请求实例

```
c=cargood&m=ajaxGetNewCity&cityid=620000&ts=1484623703469

```

返回结果

```
    {
        info:"ok",                               // 接口状态，非异常为ok，异常为error
        {
            id:'620100',                          // 区/县id
            name:'海淀区'                          // 区/县名
        },
        {
            id:'620100',                          // 区/县id
            name:'东城区'                          // 区/县名
        },
        ...
    }
```

## <a name="follow"> &sect; 添加关注</a>

请求说明

```
GET /follow HTTP/2.0
Host:https://56-api.kcimg.cn

*添加关注*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | addfollow | 默认参数
fuid | string | 1 | 用户openid | 当前用户openid
tuid | string | 1 | 用户openid | 货主openid
status | string | 1 | 0:取消关注 1:添加关注 | 关注状态
ts | string | 1 | int | 时间戳


请求实例

```
c=cargood&m=addfollow&fuid=o9WMY0XmtYJ7ssOQ71i5eh4xfCtw&tuid=o9WMY0XmtYJ7ssOQ71i5eh4xfCtw&status=1&ts=1484623703469

```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:{
            status:1,                               // 操作状态，1为成功，0为失败
            msg:'关注成功'                          // 反馈信息
        }
    }
```

## <a name="followStatus"> &sect; 获取关注状态</a>

请求说明

```
GET /followStatus HTTP/2.0
Host:https://56-api.kcimg.cn

*获取关注状态*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | followStatus | 默认参数
fuid | string | 1 | 用户openid | 当前用户openid
tuid | string | 1 | 用户openid | 货主openid
ts | string | 1 | int | 时间戳


请求实例

```
c=cargood&m=followStatus&fuid=o9WMY0XmtYJ7ssOQ71i5eh4xfCtw&tuid=o9WMY0XmtYJ7ssOQ71i5eh4xfCtw&ts=1484623703469


```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:{
            status:1          //  关注状态，0:未关注 1:已关注
        }
    }
```
## <a name="products"> &sect; 获取车型接口</a>

请求说明

```
GET /products HTTP/2.0
Host:https://56-api.kcimg.cn

*获取车型接口*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | getproduct | 默认参数
ts | string | 1 | ts | 默认参数
version | string | 1 | version | 默认参数

请求实例

```
c=cargood&m=getproduct&ts=1231231231&version=1


```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:[
          {
            id:"1"
            model_name:"高栏车"
          }
        ]
    }
```
## <a name="truckLength"> &sect; 获取车长接口</a>

请求说明

```
GET /products HTTP/2.0
Host:https://56-api.kcimg.cn

*获取车长接口*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | getcarlength | 默认参数
ts | string | 1 | ts | 默认参数
version | string | 1 | version | 默认参数

请求实例

```
c=cargood&m=getcarlength&ts=1231231231&version=1


```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:[
          "18","17.5"
        ]
    }
```
## <a name="allCity"> &sect; 获取全部城市接口</a>

请求说明

```
GET /products HTTP/2.0
Host:https://56-api.kcimg.cn

*获取全部城市接口*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | proallcity | 默认参数
ts | string | 1 | ts | 默认参数
version | string | 1 | version | 默认参数

请求实例

```
c=cargood&m=proallcity&ts=1231231231&version=1


```

返回结果

```
    {
        info:"ok",              // 接口状态，非异常为ok，异常为error
        data:[
          {
            cityList:{
              110100:{
                list:{110101: "东城区", 110102: "延庆县", 110103: "通州区", 110104: "顺义区", 110105: "昌平区", 110106: "怀柔区",…}
                name:"北京市"
              }
            }
            province_id:"110000"
            province_name:"北京"
            province_simple:"京"
          }
        ]
    }
```
