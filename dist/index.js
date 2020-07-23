const {
  parse
} = require("@babel/core");

const traverse = require("@babel/traverse").default;

const t = require("@babel/types");

const core = require("@babel/core");

const loaderUtils = require("loader-utils");

const defaultOptions = {
  catch: function (e) {
    console.error(e);
  },
  catchArg: "e"
};

module.exports = function (source) {
  let ast = parse(source);
  const options = loaderUtils.getOptions(this);
  const formatOptions = { ...defaultOptions,
    ...options
  };
  let catchNode;

  if (typeof formatOptions.catch === "function") {
    const functionNode = parse(`const a = {catch:${formatOptions.catch}}`).program.body[0].declarations[0].init.properties[0].value;
    catchNode = functionNode.body.body;
    formatOptions.catchArg = functionNode.params.length ? functionNode.params[0].name : formatOptions.catchArg;
  } else {
    catchNode = parse(formatOptions.catch).program.body;
  }

  function generateTryCatchNode(originNode, replacePath) {
    const tryCatchNode = t.tryStatement(t.blockStatement([originNode]), t.catchClause(t.identifier(formatOptions.catchArg), t.blockStatement(catchNode)));
    replacePath.replaceWith(tryCatchNode);
  }

  traverse(ast, {
    AwaitExpression(path) {
      // const a = await 23
      // 如果已有try catch包裹节点，不处理
      if (path.findParent(path => t.isTryStatement(path.node))) return; // await a().catch,不处理

      const memberNode = path.node.argument.callee;
      if (t.isMemberExpression(memberNode) && memberNode.property.name === "catch") return;

      if (t.isVariableDeclaration(path.parentPath.parent) || t.isAssignmentExpression(path.parent)
      /** a = await 99 */
      ) {
          const parentPath = path.parentPath.parentPath;
          generateTryCatchNode(parentPath.node, parentPath);
        } else {
        // await 88
        generateTryCatchNode(path.parent, path.parentPath);
      }
    }

  });
  return core.transformFromAstSync(ast, null, {
    configFile: false
  }).code;
};