# await-catch-loader

统一处理await形式promise，捕获错误

## 安装

``` 
npm install await-catch-loader -D
```

## 作用

太多的try catch注入业务代码，不易于维护

```javascript

// 使用loader前

async function a() {
  console.log('分割线')
  await new Promise((resovle, reject) => {
    reject('抛出错误')
  })
  console.log('分割线')
}

// 使用loader后

async function a() {
  console.log('分割线')
  try {
    await new Promise((resovle, reject) => {
      reject('抛出错误')
    })
  } catch(e) {
    console.error(e)
  }
  console.log('分割线')
}
```

## 使用

```javascript

module: {
  rules: [{
    test: /\.js$/,
    use: {
      loader: 'await-catch-loader',
      options: {
        catch:`console.error(e)`,
        catchArg: 'e'
      }
    }
  }]
},
```

## options

name|type|default|description
---|---|---|---
catch|string\|function|console.error(e)|catch子句中的代码片段
catchArg|string|e|catch子句中的错误对象标识符(如果catch参数类型为函数，并且拥有参数，优先级大于catchArg)

