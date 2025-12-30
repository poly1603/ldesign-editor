"use strict";/*!
 * ***********************************
 * @ldesign/editor-vue v2.0.0      *
 * Built with rollup               *
 * Build time: 2024-12-30 18:11:48 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */var n=require("vue"),c=require("@ldesign/editor-core");function d(t={}){const e=n.ref(null),o=n.ref(typeof t.content=="string"?t.content:""),r=n.ref(!1);n.onMounted(()=>{e.value=new c.Editor({...t,onChange:u=>{o.value=u,t.onChange?.(u)}}),t.autoMount!==!1&&t.container&&(e.value.mount(t.container),r.value=!0)}),n.onUnmounted(()=>{a()});const l=()=>e.value?.getHTML?.()||o.value,s=u=>{o.value=u,e.value?.setHTML?.(u)},v=u=>{e.value?.insertHTML?.(u)},i=()=>{e.value?.focus?.()},a=()=>{e.value?.destroy?.(),e.value=null,r.value=!1};return{editor:e,content:o,ready:r,getHTML:l,setHTML:s,insertHTML:v,focus:i,destroy:a}}exports.useEditor=d;/*! End of @ldesign/editor-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useEditor.js.map
