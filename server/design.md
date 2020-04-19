
### API 接口字段 

 #### 基础配置
- PATH 接口地址
- NAME 接口名称 
- METHOD 接口请求方法

#### 请求配置
- REQUEST_CONTEXT_TYPE 接口请求格式
- REQUEST_PARAMS 接口请求参数
- REQUEST_BODY 接口请求体
- REQUEST_HEADER 接口请求头

### 响应配置
- RESPONSE_HEADER 接口响应头
- RESPONSE_BODY 接口响应体




### 开放接口列表

#### 创建接口

```
path /openapi/create_api 
method post
requestBody 见API接口字段
responseBody {code:0,data:{id:'接口id'}}
```

#### 修改接口

```
path /openapi/edit_api
method post
requestBody 见API字段，新增接口id字段
responseBody {code:0,data:{id:'接口id'}}
```

#### 删除接口

```
path /openapi/delete_api
method post
requestBody {id:'接口id'}
responseBody {code:0}
```

#### 创建分类

```
path /openapi/create_category
method post
requestBody {label:'分类名称',parentId:'父级标签id'}
responseBody {code:0}
```

#### 修改分类

```
path /openapi/edit_category
method post
requestBody {id:'分类id ',label:'分类名称',parentId:'父级id'}
responseBody {code:0}
```

#### 删除分类

```
path /openapi/delete_category
method post
requestBody {id:'分类id'}
```

#### 查询分类列表

```
path /openapi/get_categorys
method get
params {parentId:'父级id',page:1,pageSize:}
responseBody {code:0,data:{list:[]}}
```

#### 查询接口列表

```
path /open/get_apis
method get
params {id:'分类id', }
```

#### 查询接口信息

```
path /open/get_api
method get
params {id:'接口id'}

```

