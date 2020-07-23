const compiler = require('./compiler.js')
let a = 1
describe('测试await的三种情况', () => {
  test('await是ExpressionStatement,try catch应包裹当前节点', async () => {
    const stats = await compiler('./expamples/example.js')
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');

  try {
    await new Promise((resovle, reject) => {
      reject('抛出错误');
    });
  } catch (e) {
    console.error(e);
  }

  console.log('分割线');
}`)
  })

  test('await是VariableDeclaration,try catch应包裹当前节点', async () => {
    const stats = await compiler('./expamples/example1.js')
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');

  try {
    const res = await new Promise((resovle, reject) => {
      reject('抛出错误');
    });
  } catch (e) {
    console.error(e);
  }

  console.log('分割线');
}`)
  })

  test('await是await是AssignmentExpression,try catch应包裹当前节点', async () => {
    const stats = await compiler('./expamples/example2.js')
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');
  let res;

  try {
    res = await new Promise((resovle, reject) => {
      reject('抛出错误');
    });
  } catch (e) {
    console.error(e);
  }

  console.log('分割线');
}`)
  })
})

describe('当await后面的promise有catch的时候', () => {
  test('紧跟await的promise有catch捕获时,trycatch不应该添加', async () => {
    const stats = await compiler('./expamples/example3.js')
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`async function a() {
  console.log('分割线');
  let res;
  res = await new Promise((resovle, reject) => {
    reject('抛出错误');
  }).catch(e => {
    console.log(e);
  });
  console.log('分割线');
}`)
  })

})
