// Enforce the same link-emission boundary in every React template, including
// lazy routes. This does not rewrite live DOM or depend on a MutationObserver.
export default function quoteLinkPlugin({ types: t }) {
  return { name:'ddnz-query-free-quote-links', visitor: {
    Program: {
      enter(path,state) { state.policyId=path.scope.generateUidIdentifier('quoteLinkProps'); state.policyUsed=false; },
      exit(path,state) { if (state.policyUsed) path.unshiftContainer('body', t.importDeclaration([t.importSpecifier(state.policyId,t.identifier('quoteLinkProps'))],t.stringLiteral('/src/lib/quoteLinkPolicy.mjs'))); }
    },
    JSXOpeningElement(path,state) {
      const n=path.node.name;
      const native=t.isJSXIdentifier(n,{name:'a'}) || (t.isJSXMemberExpression(n)&&t.isJSXIdentifier(n.property,{name:'a'}));
      const router=t.isJSXIdentifier(n)&&['Link','NavLink'].includes(n.name);
      if (!native&&!router) return;
      const prop=native?'href':'to';
      path.node.attributes=path.node.attributes.map(a=>{
        if (!t.isJSXAttribute(a)||!t.isJSXIdentifier(a.name,{name:prop})||!a.value) return a;
        const value=t.isJSXExpressionContainer(a.value)?a.value.expression:a.value;
        if(t.isJSXEmptyExpression(value))return a;
        state.policyUsed=true;
        return t.jsxSpreadAttribute(t.callExpression(state.policyId,[value,t.stringLiteral(prop)]));
      });
    }
  }};
}
