;; WebAssembly Text Format for Document Parser
;; 高性能文档解析器

(module
  ;; 内存：最小2页(128KB)，最大200页(12.8MB)
  (memory (export "memory") 2 200)
  
  ;; 全局变量
  (global $NODE_TEXT i32 (i32.const 0))
  (global $NODE_PARAGRAPH i32 (i32.const 1))
  (global $NODE_HEADING i32 (i32.const 2))
  (global $NODE_LIST i32 (i32.const 3))
  (global $NODE_LIST_ITEM i32 (i32.const 4))
  (global $NODE_BLOCKQUOTE i32 (i32.const 5))
  (global $NODE_CODE_BLOCK i32 (i32.const 6))
  (global $NODE_HORIZONTAL_RULE i32 (i32.const 7))
  (global $NODE_IMAGE i32 (i32.const 8))
  (global $NODE_LINK i32 (i32.const 9))
  (global $NODE_BOLD i32 (i32.const 10))
  (global $NODE_ITALIC i32 (i32.const 11))
  (global $NODE_CODE i32 (i32.const 12))
  (global $NODE_TABLE i32 (i32.const 13))
  (global $NODE_TABLE_ROW i32 (i32.const 14))
  (global $NODE_TABLE_CELL i32 (i32.const 15))
  
  ;; 堆指针
  (global $heapPtr (mut i32) (i32.const 65536)) ;; 从64KB开始
  
  ;; 导入函数
  (import "env" "log" (func $log (param i32) (param i32)))
  (import "env" "error" (func $error (param i32) (param i32)))
  
  ;; Node结构体（16字节）
  ;; offset 0: type (4 bytes)
  ;; offset 4: start (4 bytes)
  ;; offset 8: end (4 bytes)
  ;; offset 12: childrenPtr (4 bytes)
  
  ;; 内存分配函数
  (func $malloc (param $size i32) (result i32)
    (local $ptr i32)
    (local.set $ptr (global.get $heapPtr))
    (global.set $heapPtr (i32.add (local.get $ptr) (local.get $size)))
    (local.get $ptr)
  )
  
  ;; 创建节点
  (func $createNode (param $type i32) (param $start i32) (param $end i32) (result i32)
    (local $node i32)
    (local.set $node (call $malloc (i32.const 16)))
    
    ;; 设置type
    (i32.store (local.get $node) (local.get $type))
    ;; 设置start
    (i32.store offset=4 (local.get $node) (local.get $start))
    ;; 设置end
    (i32.store offset=8 (local.get $node) (local.get $end))
    ;; 初始化children为null
    (i32.store offset=12 (local.get $node) (i32.const 0))
    
    (local.get $node)
  )
  
  ;; 获取字符
  (func $getChar (param $ptr i32) (param $pos i32) (result i32)
    (i32.load8_u (i32.add (local.get $ptr) (local.get $pos)))
  )
  
  ;; 检查是否为空白字符
  (func $isWhitespace (param $char i32) (result i32)
    (i32.or
      (i32.or
        (i32.eq (local.get $char) (i32.const 32))  ;; 空格
        (i32.eq (local.get $char) (i32.const 9))   ;; Tab
      )
      (i32.or
        (i32.eq (local.get $char) (i32.const 10))  ;; 换行
        (i32.eq (local.get $char) (i32.const 13))  ;; 回车
      )
    )
  )
  
  ;; 跳过空白
  (func $skipWhitespace (param $ptr i32) (param $pos i32) (param $len i32) (result i32)
    (local $char i32)
    (loop $skip_loop
      (if (i32.lt_u (local.get $pos) (local.get $len))
        (then
          (local.set $char (call $getChar (local.get $ptr) (local.get $pos)))
          (if (call $isWhitespace (local.get $char))
            (then
              (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
              (br $skip_loop)
            )
          )
        )
      )
    )
    (local.get $pos)
  )
  
  ;; 查找行尾
  (func $findLineEnd (param $ptr i32) (param $pos i32) (param $len i32) (result i32)
    (local $char i32)
    (loop $find_loop
      (if (i32.lt_u (local.get $pos) (local.get $len))
        (then
          (local.set $char (call $getChar (local.get $ptr) (local.get $pos)))
          (if (i32.or
                (i32.eq (local.get $char) (i32.const 10))  ;; \n
                (i32.eq (local.get $char) (i32.const 13))  ;; \r
              )
            (then (return (local.get $pos)))
          )
          (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
          (br $find_loop)
        )
      )
    )
    (local.get $pos)
  )
  
  ;; 解析标题（# 开头）
  (func $parseHeading (param $ptr i32) (param $pos i32) (param $len i32) (result i32)
    (local $level i32)
    (local $start i32)
    (local $end i32)
    
    (local.set $start (local.get $pos))
    (local.set $level (i32.const 0))
    
    ;; 计算标题级别
    (loop $count_hash
      (if (i32.and
            (i32.lt_u (local.get $pos) (local.get $len))
            (i32.eq (call $getChar (local.get $ptr) (local.get $pos)) (i32.const 35)) ;; #
          )
        (then
          (local.set $level (i32.add (local.get $level) (i32.const 1)))
          (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
          (br $count_hash)
        )
      )
    )
    
    ;; 跳过空格
    (local.set $pos (call $skipWhitespace (local.get $ptr) (local.get $pos) (local.get $len)))
    
    ;; 找到行尾
    (local.set $end (call $findLineEnd (local.get $ptr) (local.get $pos) (local.get $len)))
    
    ;; 创建标题节点
    (call $createNode (global.get $NODE_HEADING) (local.get $start) (local.get $end))
  )
  
  ;; 解析列表项（- 或 * 开头）
  (func $parseListItem (param $ptr i32) (param $pos i32) (param $len i32) (result i32)
    (local $start i32)
    (local $end i32)
    (local $char i32)
    
    (local.set $start (local.get $pos))
    (local.set $char (call $getChar (local.get $ptr) (local.get $pos)))
    
    ;; 检查是否为列表标记
    (if (i32.or
          (i32.eq (local.get $char) (i32.const 45))  ;; -
          (i32.eq (local.get $char) (i32.const 42))  ;; *
        )
      (then
        ;; 跳过标记和空格
        (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
        (local.set $pos (call $skipWhitespace (local.get $ptr) (local.get $pos) (local.get $len)))
        
        ;; 找到行尾
        (local.set $end (call $findLineEnd (local.get $ptr) (local.get $pos) (local.get $len)))
        
        ;; 创建列表项节点
        (return (call $createNode (global.get $NODE_LIST_ITEM) (local.get $start) (local.get $end)))
      )
    )
    
    (i32.const 0)
  )
  
  ;; 解析代码块（``` 开头）
  (func $parseCodeBlock (param $ptr i32) (param $pos i32) (param $len i32) (result i32)
    (local $start i32)
    (local $end i32)
    (local $count i32)
    
    (local.set $start (local.get $pos))
    (local.set $count (i32.const 0))
    
    ;; 检查是否为```
    (loop $check_backtick
      (if (i32.and
            (i32.lt_u (i32.add (local.get $pos) (local.get $count)) (local.get $len))
            (i32.eq (call $getChar (local.get $ptr) (i32.add (local.get $pos) (local.get $count))) (i32.const 96)) ;; `
          )
        (then
          (local.set $count (i32.add (local.get $count) (i32.const 1)))
          (if (i32.lt_u (local.get $count) (i32.const 3))
            (then (br $check_backtick))
          )
        )
      )
    )
    
    (if (i32.eq (local.get $count) (i32.const 3))
      (then
        ;; 找到结束的```
        (local.set $pos (i32.add (local.get $pos) (i32.const 3)))
        (local.set $pos (call $findLineEnd (local.get $ptr) (local.get $pos) (local.get $len)))
        (local.set $pos (i32.add (local.get $pos) (i32.const 1))) ;; 跳过换行
        
        ;; 查找结束标记
        (loop $find_end
          (if (i32.lt_u (local.get $pos) (local.get $len))
            (then
              ;; 检查是否为```
              (if (i32.and
                    (i32.and
                      (i32.eq (call $getChar (local.get $ptr) (local.get $pos)) (i32.const 96))
                      (i32.lt_u (i32.add (local.get $pos) (i32.const 1)) (local.get $len))
                    )
                    (i32.and
                      (i32.eq (call $getChar (local.get $ptr) (i32.add (local.get $pos) (i32.const 1))) (i32.const 96))
                      (i32.eq (call $getChar (local.get $ptr) (i32.add (local.get $pos) (i32.const 2))) (i32.const 96))
                    )
                  )
                (then
                  (local.set $end (i32.add (local.get $pos) (i32.const 3)))
                  (return (call $createNode (global.get $NODE_CODE_BLOCK) (local.get $start) (local.get $end)))
                )
              )
              (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
              (br $find_end)
            )
          )
        )
      )
    )
    
    (i32.const 0)
  )
  
  ;; 解析段落
  (func $parseParagraph (param $ptr i32) (param $pos i32) (param $len i32) (result i32)
    (local $start i32)
    (local $end i32)
    
    (local.set $start (local.get $pos))
    
    ;; 找到段落结束（空行或特殊标记）
    (loop $find_para_end
      (if (i32.lt_u (local.get $pos) (local.get $len))
        (then
          ;; 检查是否为空行
          (if (i32.eq (call $getChar (local.get $ptr) (local.get $pos)) (i32.const 10))
            (then
              ;; 检查下一个字符是否也是换行
              (if (i32.and
                    (i32.lt_u (i32.add (local.get $pos) (i32.const 1)) (local.get $len))
                    (i32.eq (call $getChar (local.get $ptr) (i32.add (local.get $pos) (i32.const 1))) (i32.const 10))
                  )
                (then
                  (local.set $end (local.get $pos))
                  (return (call $createNode (global.get $NODE_PARAGRAPH) (local.get $start) (local.get $end)))
                )
              )
            )
          )
          (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
          (br $find_para_end)
        )
      )
    )
    
    ;; 段落到文档末尾
    (call $createNode (global.get $NODE_PARAGRAPH) (local.get $start) (local.get $len))
  )
  
  ;; 主解析函数
  ;; 参数：文本指针、文本长度、输出缓冲区
  ;; 返回：节点数量
  (func $parseDocument (export "parseDocument")
    (param $textPtr i32) (param $textLen i32) (param $outputPtr i32)
    (result i32)
    
    (local $pos i32)
    (local $nodeCount i32)
    (local $node i32)
    (local $char i32)
    
    (local.set $pos (i32.const 0))
    (local.set $nodeCount (i32.const 0))
    
    ;; 重置堆指针
    (global.set $heapPtr (i32.const 65536))
    
    ;; 主解析循环
    (loop $parse_loop
      (if (i32.lt_u (local.get $pos) (local.get $textLen))
        (then
          ;; 跳过空白
          (local.set $pos (call $skipWhitespace (local.get $textPtr) (local.get $pos) (local.get $textLen)))
          
          (if (i32.lt_u (local.get $pos) (local.get $textLen))
            (then
              (local.set $char (call $getChar (local.get $textPtr) (local.get $pos)))
              
              ;; 根据首字符判断节点类型
              (if (i32.eq (local.get $char) (i32.const 35)) ;; #
                (then
                  (local.set $node (call $parseHeading (local.get $textPtr) (local.get $pos) (local.get $textLen)))
                )
                (else
                  (if (i32.or
                        (i32.eq (local.get $char) (i32.const 45))  ;; -
                        (i32.eq (local.get $char) (i32.const 42))  ;; *
                      )
                    (then
                      (local.set $node (call $parseListItem (local.get $textPtr) (local.get $pos) (local.get $textLen)))
                    )
                    (else
                      (if (i32.eq (local.get $char) (i32.const 96)) ;; `
                        (then
                          (local.set $node (call $parseCodeBlock (local.get $textPtr) (local.get $pos) (local.get $textLen)))
                        )
                        (else
                          ;; 默认为段落
                          (local.set $node (call $parseParagraph (local.get $textPtr) (local.get $pos) (local.get $textLen)))
                        )
                      )
                    )
                  )
                )
              )
              
              ;; 保存节点到输出缓冲区
              (if (local.get $node)
                (then
                  (i32.store
                    (i32.add (local.get $outputPtr) (i32.shl (local.get $nodeCount) (i32.const 2)))
                    (local.get $node)
                  )
                  (local.set $nodeCount (i32.add (local.get $nodeCount) (i32.const 1)))
                  
                  ;; 移动位置到节点结束
                  (local.set $pos (i32.load offset=8 (local.get $node)))
                )
                (else
                  ;; 解析失败，跳过当前字符
                  (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
                )
              )
              
              (br $parse_loop)
            )
          )
        )
      )
    )
    
    (local.get $nodeCount)
  )
  
  ;; HTML序列化
  ;; 参数：节点指针、输出缓冲区
  ;; 返回：HTML长度
  (func $nodeToHTML (export "nodeToHTML")
    (param $nodePtr i32) (param $outputPtr i32)
    (result i32)
    
    (local $type i32)
    (local $start i32)
    (local $end i32)
    (local $pos i32)
    
    (local.set $type (i32.load (local.get $nodePtr)))
    (local.set $start (i32.load offset=4 (local.get $nodePtr)))
    (local.set $end (i32.load offset=8 (local.get $nodePtr)))
    (local.set $pos (i32.const 0))
    
    ;; 根据节点类型生成HTML
    (if (i32.eq (local.get $type) (global.get $NODE_HEADING))
      (then
        ;; <h1>...</h1>
        ;; 简化：总是生成h1
        (i32.store8 (i32.add (local.get $outputPtr) (local.get $pos)) (i32.const 60))  ;; <
        (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
        (i32.store8 (i32.add (local.get $outputPtr) (local.get $pos)) (i32.const 104)) ;; h
        (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
        (i32.store8 (i32.add (local.get $outputPtr) (local.get $pos)) (i32.const 49))  ;; 1
        (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
        (i32.store8 (i32.add (local.get $outputPtr) (local.get $pos)) (i32.const 62))  ;; >
        (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
      )
      (else
        (if (i32.eq (local.get $type) (global.get $NODE_PARAGRAPH))
          (then
            ;; <p>...</p>
            (i32.store8 (i32.add (local.get $outputPtr) (local.get $pos)) (i32.const 60))  ;; <
            (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
            (i32.store8 (i32.add (local.get $outputPtr) (local.get $pos)) (i32.const 112)) ;; p
            (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
            (i32.store8 (i32.add (local.get $outputPtr) (local.get $pos)) (i32.const 62))  ;; >
            (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
          )
        )
      )
    )
    
    (local.get $pos)
  )
  
  ;; 获取内存大小
  (func $getMemorySize (export "getMemorySize") (result i32)
    (i32.mul (memory.size) (i32.const 65536))
  )
  
  ;; 获取堆使用情况
  (func $getHeapUsage (export "getHeapUsage") (result i32)
    (i32.sub (global.get $heapPtr) (i32.const 65536))
  )
)




