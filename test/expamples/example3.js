async function a() {
  console.log('分割线')
  let res
  res = await new Promise((resovle, reject) => {
    reject('抛出错误')
  }).catch(e => {
    console.log(e)
  })
  console.log('分割线')
}