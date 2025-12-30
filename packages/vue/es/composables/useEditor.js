/*!
 * ***********************************
 * @ldesign/editor-vue v2.0.0      *
 * Built with rollup               *
 * Build time: 2024-12-30 18:11:48 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */import{ref as a,onMounted as c,onUnmounted as f}from"vue";import{Editor as d}from"@ldesign/editor-core";function M(t={}){const e=a(null),n=a(typeof t.content=="string"?t.content:""),u=a(!1);c(()=>{e.value=new d({...t,onChange:o=>{n.value=o,t.onChange?.(o)}}),t.autoMount!==!1&&t.container&&(e.value.mount(t.container),u.value=!0)}),f(()=>{l()});const r=()=>e.value?.getHTML?.()||n.value,s=o=>{n.value=o,e.value?.setHTML?.(o)},v=o=>{e.value?.insertHTML?.(o)},i=()=>{e.value?.focus?.()},l=()=>{e.value?.destroy?.(),e.value=null,u.value=!1};return{editor:e,content:n,ready:u,getHTML:r,setHTML:s,insertHTML:v,focus:i,destroy:l}}/*! End of @ldesign/editor-vue | Powered by @ldesign/builder */export{M as useEditor};
//# sourceMappingURL=useEditor.js.map
