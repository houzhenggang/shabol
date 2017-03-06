# 极速配 for App 数据接口

## 目录

* [货源列表](#list)
* [筛选](#filter)


## <a name="list"> &sect; 货源列表</a>

请求说明

```
GET /list HTTP/2.0
Host:https://56-api.kcimg.cn

*货源列表（已发布）数据*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | getlist | 默认参数
page | string | 1 | int | 分页
ts | string | 1 | int | 时间戳


请求实例

```

c=cargood&m=getlist&page=1&ts=1484553182686

```

返回结果

每次返回10条数据，如不足10条，则不再请求

```
    {
        status:1,           // 数据状态，正常为1，异常为0
        list:[
            {
                id:1001,							// 货源id
	            formInfo:{							// 出发地信息
	              province:'山东',					// 省/直辖市/自治区
	              city:'德州',						// 市/自治州
	              county:'夏津'						// 区/县
	            },
	            toInfo:{							// 目的地信息			
	              province:'山东',					// 省/直辖市/自治区
	              city:'德州',						// 市/自治州
	              county:'夏津'						// 区/县
	            },
	            cate:'高栏车',						// 车辆类型 
	            length:'13',						// 车长
	            desc:'普货',						// 货源描述
	            date:'2017-2-28',					// 发布时间
	            avatar:'http://temp.im/120x120',	// 发布用户头像
	            name:'天下行物流',					// 发布用户昵称
	            views:354,							// 查看次数
	            tel:'17069554359'					// 联系电话
            },
            ...
        ]
    }
```


## <a name="filter"> &sect; 筛选</a>

请求说明

```
GET /filter HTTP/2.0
Host:https://56-api.kcimg.cn

*筛选货源列表（已发布）数据*

```

参数说明

参数名称 | 参数类型 | 是否必选 | 取值范围 | 备注
---|---|---|---|---
c | string | 1 | cargood | 默认参数
m | string | 1 | getlist | 默认参数
cate | string | 1 | int | 车辆类型
length | string | 1 | int | 车长
fromInfo | string | 1 | 1001,02,12 | 出发地信息
toInfo | string | 1 | 1001,02,12 | 目的地信息
page | string | 1 | int | 分页
ts | string | 1 | int | 时间戳


请求实例

```

c=cargood&m=getlist&cate=11&length=13&fromInfo=1001,02,12&toInfo=1001,02,12&page=1&ts=1484553182686

```

返回结果

每次返回10条数据，如不足10条，则不再请求

```
    {
        status:1,           // 数据状态，正常为1，异常为0
        list:[
            {
                id:1001,							// 货源id
	            formInfo:{							// 出发地信息
	              province:'山东',					// 省/直辖市/自治区
	              city:'德州',						// 市/自治州
	              county:'夏津'						// 区/县
	            },
	            toInfo:{							// 目的地信息			
	              province:'山东',					// 省/直辖市/自治区
	              city:'德州',						// 市/自治州
	              county:'夏津'						// 区/县
	            },
	            cate:'高栏车',						// 车辆类型 
	            length:'13',						// 车长
	            desc:'普货',						// 货源描述
	            date:'2017-2-28',					// 发布时间
	            avatar:'http://temp.im/120x120',	// 发布用户头像
	            name:'天下行物流',					// 发布用户昵称
	            views:354,							// 查看次数
	            tel:'17069554359'					// 联系电话
            },
            ...
        ]
    }
```