module.exports = function(babel) {
  var t = babel.types;

  return {
    visitor: {
      ExpressionStatement: function(path) {
        var expr = path.node.expression;

        if (expr.type == 'BinaryExpression') {
          if (expr.operator === '<'
              && expr.right.type == 'UnaryExpression'
              && expr.right.operator == '-') {

            var sibling = path.getSibling(path.key + 1);
            var clone = null;

            if (sibling.node) {
              clone = sibling.node.__clone();
              sibling.remove();
            }

            path.replaceWith
             (t.expressionStatement
              (t.callExpression
               (t.identifier('bind')
               , [ expr.right.argument
                 , t.functionExpression
                    (null, [t.identifier(expr.left.name)], t.blockStatement(clone ? [clone] : []))
                 ]
               )));
          }
        }
      }
    }
  };
};
