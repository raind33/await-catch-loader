const compiler = require('./compiler.js')
let a = 1
describe('测试传入的options', () => {
  test('catch为字符串类型', async () => {
    const stats = await compiler('./expamples/example.js', { catch: 'console.confirm(e)', catchArg: 'f'})
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');

  try {
    await new Promise((resovle, reject) => {
      reject('抛出错误');
    });
  } catch (f) {
    console.confirm(e);
  }

  console.log('分割线');
}`)
  })

  test('catch为普通函数类型', async () => {
    const stats = await compiler('./expamples/example.js', { catch: function (f){
      console.log(22, f)
      alert(44)
    }})
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');

  try {
    await new Promise((resovle, reject) => {
      reject('抛出错误');
    });
  } catch (f) {
    console.log(22, f);
    alert(44);
  }

  console.log('分割线');
}`)
  })
  test('catch为箭头函数类型', async () => {
    const stats = await compiler('./expamples/example.js', { catch: (a) => {
      console.log(a)
    } })
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');

  try {
    await new Promise((resovle, reject) => {
      reject('抛出错误');
    });
  } catch (a) {
    console.log(a);
  }

  console.log('分割线');
}`)
  })

  test('catch为函数类型，且传了参数，其优先级应大于catchArg的优先级', async () => {
    const stats = await compiler('./expamples/example.js', { catch: (a) => {
      console.log(a)
    }, catchArg: 'e' })
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');

  try {
    await new Promise((resovle, reject) => {
      reject('抛出错误');
    });
  } catch (a) {
    console.log(a);
  }

  console.log('分割线');
}`)
  })

  test('catch为函数类型，不传参数，默认参数为catchArg', async () => {
    const stats = await compiler('./expamples/example.js', { catch: () => {
      console.log(a)
    }, catchArg: 'e' })
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');

  try {
    await new Promise((resovle, reject) => {
      reject('抛出错误');
    });
  } catch (e) {
    console.log(a);
  }

  console.log('分割线');
}`)
  })


})

