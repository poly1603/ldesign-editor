// WebAssembly module types
declare module '*.wasm' {
  const content: ArrayBuffer
  export default content
}

declare module '*.wasm.base64' {
  const content: string
  export default content
}




