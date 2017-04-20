const stptr_table = {};
let stptr_next = 0;

module.exports = function(babel) {
  var t = babel.types;

  return {
    visitor: {
      CallExpression: function(path) {
        // console.log(path.node);
        if (path.node.callee.type === 'Identifier'
            && path.node.callee.name == 'static_ptr') {

          stptr_table["__stptr_" + stptr_next] = path.node.arguments[0].__clone();
          path.replaceWith(t.stringLiteral("__stptr_" + stptr_next));

          stptr_next++;
        }
      }
    },

    post: (file) => {
      const stptr_props = Object.entries(stptr_table).map(([k, v]) => {
        return t.objectProperty(t.identifier(k), v);
      });

      file.ast.program.body.push(t.variableDeclaration(
        "const",
        [t.variableDeclarator(
          t.identifier("__stptr_table"),
          t.objectExpression(stptr_props))
        ]));
    }
  };
};
