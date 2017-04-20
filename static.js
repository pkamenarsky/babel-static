const stptr_table = {};
let   stptr_next = 0;

module.exports = function(babel) {
  var t = babel.types;

  return {
    visitor: {
      CallExpression: function(path, state) {
        const filename = state.file.opts.filename,
              basename = filename.substr(0, filename.lastIndexOf('.')) || filename,
              stptr    = "__stptr_" + basename.replace(/\//g, '_') + "_" + stptr_next;

        if (path.node.callee.type === 'Identifier'
            && path.node.callee.name == 'static_ptr') {

          stptr_table[stptr] = path.node.arguments[0].__clone();
          path.replaceWith(t.stringLiteral(stptr));

          stptr_next++;
        }
      }
    },

    post: (file) => {
      const stptr_props = Object.entries(stptr_table).map(([k, v]) => {
        return t.objectProperty(t.identifier(k), v);
      });

      /*
      file.ast.program.body.push(t.variableDeclaration(
        "const",
        [t.variableDeclarator(
          t.identifier("__stptr_table"),
          t.objectExpression(stptr_props))
        ]));
      */

      file.ast.program.body.push(t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.memberExpression(
            t.memberExpression(
              t.identifier("module"),
              t.identifier("exports"),
              false),
            t.identifier("__stptr_table"),
            false), 
          t.objectExpression(stptr_props))));
    }
  };
};
