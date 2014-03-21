function DependencyChain(){function n(n){var t,i;for(t=0;t<o.length;t++)if(o[t].name===n)return o[t];return l=!0,i=new s(n),o.push(i),i}function t(){(null===a||l)&&(a=u.run())}function i(){return any(a,function(n){return n.length>1})}function e(n){this.vertices=n||[]}function s(n,t){this.name=n||null,this.value=t||null,this.connections=[],this.index=-1,this.lowlink=-1}function r(n){this.vertices=n||[]}function c(n){this.index=0,this.stack=new r,this.graph=n,this.scc=[],this.run=function(){for(var n=0;n<this.graph.vertices.length;n++)this.graph.vertices[n].index<0&&this.strongconnect(this.graph.vertices[n]);return this.scc},this.strongconnect=function(n){n.index=this.index,n.lowlink=this.index,this.index=this.index+1,this.stack.vertices.push(n);for(var t in n.connections){var i=n,e=n.connections[t];if(!e)throw new Error("missing dependency: "+t);e.index<0?(this.strongconnect(e),i.lowlink=Math.min(i.lowlink,e.lowlink)):this.stack.contains(e)&&(i.lowlink=Math.min(i.lowlink,e.index))}if(n.lowlink==n.index){var s=[],r=null;if(this.stack.vertices.length>0)do r=this.stack.vertices.pop(),s.push(r);while(!n.equals(r));s.length>0&&this.scc.push(s)}}}var o=[],h=new e(o),u=new c(h),l=!1,a=null,f=this;f.add=function(t,i,e){var s=n(t);return s.value=i,forEach(e,function(t){s.connections.push(n(t))}),s},f.prioritized=function(){if(t(),i())throw new Error("Circular dependencies detected");return map(a,function(n){return n[0]})},s.prototype={equals:function(n){return n.name&&this.name===n.name}},r.prototype.contains=function(n){for(var t=0;t<this.vertices.length;t++)if(this.vertices[t].equals(n))return!0;return!1}}