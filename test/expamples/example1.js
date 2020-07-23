async function a() {
  console.log('分割线')
  const res = await new Promise((resovle, reject) => {
    reject('抛出错误')
  })
  console.log('分割线')
}