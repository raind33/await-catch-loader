async function a() {
  console.log('分割线')
  await new Promise((resovle, reject) => {
    reject('抛出错误')
  })
  console.log('分割线')
}