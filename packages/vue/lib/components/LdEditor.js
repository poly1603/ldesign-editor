"use strict";/*!
 * ***********************************
 * @ldesign/editor-vue v2.0.0      *
 * Built with rollup               *
 * Build time: 2024-12-30 18:11:48 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */Object.defineProperty(exports,"__esModule",{value:!0});var u=require("vue"),d=require("@ldesign/editor-core");const r=u.defineComponent({name:"LdEditor",props:{modelValue:{type:String,default:""},placeholder:{type:String,default:""},readonly:{type:Boolean,default:!1},autofocus:{type:Boolean,default:!1},virtualScroll:{type:Object,default:void 0},wasm:{type:Object,default:void 0},pwa:{type:Object,default:void 0},debugPanel:{type:Object,default:void 0},plugins:{type:Array,default:()=>d.standardPlugins}},emits:{"update:modelValue":t=>!0,change:t=>!0,focus:()=>!0,blur:()=>!0},setup(t,{emit:a,expose:n}){const o=u.ref();let e=null;return u.onMounted(()=>{o.value&&(e=new d.Editor({content:t.modelValue,placeholder:t.placeholder,autofocus:t.autofocus,virtualScroll:t.virtualScroll,wasm:t.wasm,pwa:t.pwa,debugPanel:t.debugPanel,plugins:t.plugins,onChange:l=>{a("update:modelValue",l),a("change",l)},onFocus:()=>{a("focus")},onBlur:()=>{a("blur")}}),e.mount(o.value))}),u.watch(()=>t.modelValue,l=>{e&&l!==e.getHTML?.()&&e.setHTML?.(l)}),u.watch(()=>t.readonly,l=>{e&&e.setEditable?.(!l)}),u.onUnmounted(()=>{e?.destroy?.(),e=null}),n({editor:e,getHTML:()=>e?.getHTML?.()||"",setHTML:l=>e?.setHTML?.(l),focus:()=>e?.focus?.()}),()=>u.createVNode("div",{ref:o,class:"ld-editor-vue-wrapper",style:{width:"100%",height:"100%"}},null,512)}});exports.LdEditor=r,exports.default=r;/*! End of @ldesign/editor-vue | Powered by @ldesign/builder */
//# sourceMappingURL=LdEditor.js.map
