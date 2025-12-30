/*!
 * ***********************************
 * @ldesign/editor-vue v2.0.0      *
 * Built with rollup               *
 * Build time: 2024-12-30 18:11:48 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */import{defineComponent as n,ref as s,createVNode as p,onMounted as i,watch as u,onUnmounted as c}from"vue";import{standardPlugins as f,Editor as m}from"@ldesign/editor-core";const d=n({name:"LdEditor",props:{modelValue:{type:String,default:""},placeholder:{type:String,default:""},readonly:{type:Boolean,default:!1},autofocus:{type:Boolean,default:!1},virtualScroll:{type:Object,default:void 0},wasm:{type:Object,default:void 0},pwa:{type:Object,default:void 0},debugPanel:{type:Object,default:void 0},plugins:{type:Array,default:()=>f}},emits:{"update:modelValue":t=>!0,change:t=>!0,focus:()=>!0,blur:()=>!0},setup(t,{emit:a,expose:r}){const o=s();let e=null;return i(()=>{o.value&&(e=new m({content:t.modelValue,placeholder:t.placeholder,autofocus:t.autofocus,virtualScroll:t.virtualScroll,wasm:t.wasm,pwa:t.pwa,debugPanel:t.debugPanel,plugins:t.plugins,onChange:l=>{a("update:modelValue",l),a("change",l)},onFocus:()=>{a("focus")},onBlur:()=>{a("blur")}}),e.mount(o.value))}),u(()=>t.modelValue,l=>{e&&l!==e.getHTML?.()&&e.setHTML?.(l)}),u(()=>t.readonly,l=>{e&&e.setEditable?.(!l)}),c(()=>{e?.destroy?.(),e=null}),r({editor:e,getHTML:()=>e?.getHTML?.()||"",setHTML:l=>e?.setHTML?.(l),focus:()=>e?.focus?.()}),()=>p("div",{ref:o,class:"ld-editor-vue-wrapper",style:{width:"100%",height:"100%"}},null,512)}});/*! End of @ldesign/editor-vue | Powered by @ldesign/builder */export{d as LdEditor,d as default};
//# sourceMappingURL=LdEditor.js.map
