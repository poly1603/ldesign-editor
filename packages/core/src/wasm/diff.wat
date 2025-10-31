;; WebAssembly Text Format for Diff Algorithm
;; 高性能文本差异计算算法（Myers算法实现）

(module
  ;; 内存：最小1页(64KB)，最大100页(6.4MB)
  (memory (export "memory") 1 100)
  
  ;; 全局变量
  (global $MAX_SIZE (mut i32) (i32.const 65536))
  (global $STACK_POINTER (mut i32) (i32.const 1024))
  
  ;; 导入JavaScript控制台函数（调试用）
  (import "console" "log" (func $log (param i32)))
  (import "console" "time" (func $time (param i32)))
  (import "console" "timeEnd" (func $timeEnd (param i32)))
  
  ;; 数据段：存储一些常量字符串
  (data (i32.const 0) "diff_start")
  (data (i32.const 16) "diff_end")
  
  ;; 辅助函数：获取字符
  (func $getChar (param $ptr i32) (param $index i32) (result i32)
    (i32.load8_u (i32.add (local.get $ptr) (local.get $index)))
  )
  
  ;; 辅助函数：比较两个字符
  (func $charEqual (param $a i32) (param $b i32) (result i32)
    (i32.eq (local.get $a) (local.get $b))
  )
  
  ;; 辅助函数：最小值
  (func $min (param $a i32) (param $b i32) (result i32)
    (select (local.get $a) (local.get $b) (i32.lt_s (local.get $a) (local.get $b)))
  )
  
  ;; 辅助函数：最大值
  (func $max (param $a i32) (param $b i32) (result i32)
    (select (local.get $a) (local.get $b) (i32.gt_s (local.get $a) (local.get $b)))
  )
  
  ;; LCS (Longest Common Subsequence) 长度计算
  ;; 参数：text1_ptr, text1_len, text2_ptr, text2_len
  ;; 返回：LCS长度
  (func $lcsLength (export "lcsLength")
    (param $text1 i32) (param $len1 i32)
    (param $text2 i32) (param $len2 i32)
    (result i32)
    
    (local $i i32)
    (local $j i32)
    (local $prev i32)
    (local $curr i32)
    (local $temp i32)
    (local $dpBase i32)
    (local $result i32)
    
    ;; DP表基址（使用栈空间）
    (local.set $dpBase (global.get $STACK_POINTER))
    
    ;; 初始化DP表第一行为0
    (local.set $j (i32.const 0))
    (loop $init_loop
      (i32.store
        (i32.add (local.get $dpBase) (i32.shl (local.get $j) (i32.const 2)))
        (i32.const 0)
      )
      (local.set $j (i32.add (local.get $j) (i32.const 1)))
      (br_if $init_loop (i32.le_u (local.get $j) (local.get $len2)))
    )
    
    ;; 动态规划填充
    (local.set $i (i32.const 1))
    (loop $outer_loop
      (local.set $j (i32.const 1))
      (local.set $prev (i32.const 0))
      
      (loop $inner_loop
        ;; 获取dp[i-1][j]和dp[i][j-1]
        (local.set $curr
          (i32.load
            (i32.add (local.get $dpBase) (i32.shl (local.get $j) (i32.const 2)))
          )
        )
        
        ;; 计算dp[i][j]
        (if (i32.eq
              (call $getChar (local.get $text1) (i32.sub (local.get $i) (i32.const 1)))
              (call $getChar (local.get $text2) (i32.sub (local.get $j) (i32.const 1)))
            )
          (then
            ;; 字符相同：dp[i][j] = dp[i-1][j-1] + 1
            (local.set $result (i32.add (local.get $prev) (i32.const 1)))
          )
          (else
            ;; 字符不同：dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            (local.set $result (call $max (local.get $curr) (local.get $prev)))
          )
        )
        
        ;; 保存结果
        (local.set $prev (local.get $curr))
        (i32.store
          (i32.add (local.get $dpBase) (i32.shl (local.get $j) (i32.const 2)))
          (local.get $result)
        )
        
        (local.set $j (i32.add (local.get $j) (i32.const 1)))
        (br_if $inner_loop (i32.le_u (local.get $j) (local.get $len2)))
      )
      
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $outer_loop (i32.le_u (local.get $i) (local.get $len1)))
    )
    
    ;; 返回dp[len1][len2]
    (i32.load
      (i32.add (local.get $dpBase) (i32.shl (local.get $len2) (i32.const 2)))
    )
  )
  
  ;; Myers差异算法实现
  ;; 参数：old_ptr, old_len, new_ptr, new_len, output_ptr
  ;; 返回：差异操作数量
  (func $myersDiff (export "myersDiff")
    (param $old i32) (param $oldLen i32)
    (param $new i32) (param $newLen i32)
    (param $output i32)
    (result i32)
    
    (local $maxD i32)
    (local $d i32)
    (local $k i32)
    (local $x i32)
    (local $y i32)
    (local $prevX i32)
    (local $vBase i32)
    (local $found i32)
    (local $ops i32)
    
    ;; 开始计时（调试）
    (call $time (i32.const 0))
    
    ;; 最大编辑距离
    (local.set $maxD (i32.add (local.get $oldLen) (local.get $newLen)))
    
    ;; V数组基址
    (local.set $vBase (global.get $STACK_POINTER))
    
    ;; 初始化V[1] = 0
    (i32.store
      (i32.add (local.get $vBase) (i32.const 4))
      (i32.const 0)
    )
    
    ;; 主循环：逐步增加编辑距离
    (local.set $d (i32.const 0))
    (local.set $found (i32.const 0))
    
    (loop $d_loop
      ;; k从-d到d，步长为2
      (local.set $k (i32.sub (i32.const 0) (local.get $d)))
      
      (loop $k_loop
        ;; 选择移动方向（向下或向右）
        (if (i32.or
              (i32.eq (local.get $k) (i32.sub (i32.const 0) (local.get $d)))
              (i32.and
                (i32.ne (local.get $k) (local.get $d))
                (i32.lt_s
                  (i32.load (i32.add (local.get $vBase) (i32.shl (i32.sub (local.get $k) (i32.const 1)) (i32.const 2))))
                  (i32.load (i32.add (local.get $vBase) (i32.shl (i32.add (local.get $k) (i32.const 1)) (i32.const 2))))
                )
              )
            )
          (then
            ;; 从k+1对角线来（删除）
            (local.set $x 
              (i32.load (i32.add (local.get $vBase) (i32.shl (i32.add (local.get $k) (i32.const 1)) (i32.const 2))))
            )
          )
          (else
            ;; 从k-1对角线来（插入）
            (local.set $x
              (i32.add
                (i32.load (i32.add (local.get $vBase) (i32.shl (i32.sub (local.get $k) (i32.const 1)) (i32.const 2))))
                (i32.const 1)
              )
            )
          )
        )
        
        (local.set $y (i32.sub (local.get $x) (local.get $k)))
        
        ;; 沿着对角线前进（匹配的字符）
        (loop $diag_loop
          (if (i32.and
                (i32.lt_u (local.get $x) (local.get $oldLen))
                (i32.and
                  (i32.lt_u (local.get $y) (local.get $newLen))
                  (i32.eq
                    (call $getChar (local.get $old) (local.get $x))
                    (call $getChar (local.get $new) (local.get $y))
                  )
                )
              )
            (then
              (local.set $x (i32.add (local.get $x) (i32.const 1)))
              (local.set $y (i32.add (local.get $y) (i32.const 1)))
              (br $diag_loop)
            )
          )
        )
        
        ;; 保存路径点
        (i32.store
          (i32.add (local.get $vBase) (i32.shl (local.get $k) (i32.const 2)))
          (local.get $x)
        )
        
        ;; 检查是否到达终点
        (if (i32.and
              (i32.ge_u (local.get $x) (local.get $oldLen))
              (i32.ge_u (local.get $y) (local.get $newLen))
            )
          (then
            (local.set $found (i32.const 1))
          )
        )
        
        ;; 更新k
        (local.set $k (i32.add (local.get $k) (i32.const 2)))
        (br_if $k_loop (i32.and (i32.le_s (local.get $k) (local.get $d)) (i32.eq (local.get $found) (i32.const 0))))
      )
      
      ;; 增加编辑距离
      (local.set $d (i32.add (local.get $d) (i32.const 1)))
      (br_if $d_loop (i32.and (i32.le_s (local.get $d) (local.get $maxD)) (i32.eq (local.get $found) (i32.const 0))))
    )
    
    ;; 结束计时（调试）
    (call $timeEnd (i32.const 0))
    
    ;; 返回编辑距离
    (local.get $d)
  )
  
  ;; 快速字符串比较
  ;; 参数：str1_ptr, str1_len, str2_ptr, str2_len
  ;; 返回：0=不同，1=相同
  (func $fastStringCompare (export "fastStringCompare")
    (param $str1 i32) (param $len1 i32)
    (param $str2 i32) (param $len2 i32)
    (result i32)
    
    (local $i i32)
    
    ;; 长度不同直接返回0
    (if (i32.ne (local.get $len1) (local.get $len2))
      (then (return (i32.const 0)))
    )
    
    ;; 逐字符比较
    (local.set $i (i32.const 0))
    (loop $compare_loop
      (if (i32.lt_u (local.get $i) (local.get $len1))
        (then
          (if (i32.ne
                (i32.load8_u (i32.add (local.get $str1) (local.get $i)))
                (i32.load8_u (i32.add (local.get $str2) (local.get $i)))
              )
            (then (return (i32.const 0)))
          )
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          (br $compare_loop)
        )
      )
    )
    
    (i32.const 1)
  )
  
  ;; 计算编辑距离（Levenshtein距离）
  ;; 参数：str1_ptr, str1_len, str2_ptr, str2_len
  ;; 返回：编辑距离
  (func $editDistance (export "editDistance")
    (param $str1 i32) (param $len1 i32)
    (param $str2 i32) (param $len2 i32)
    (result i32)
    
    (local $i i32)
    (local $j i32)
    (local $cost i32)
    (local $dpBase i32)
    (local $above i32)
    (local $left i32)
    (local $diag i32)
    (local $min i32)
    
    ;; DP表基址
    (local.set $dpBase (global.get $STACK_POINTER))
    
    ;; 初始化第一行
    (local.set $i (i32.const 0))
    (loop $init_row
      (i32.store
        (i32.add (local.get $dpBase) (i32.shl (local.get $i) (i32.const 2)))
        (local.get $i)
      )
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $init_row (i32.le_u (local.get $i) (local.get $len2)))
    )
    
    ;; 填充DP表
    (local.set $i (i32.const 1))
    (loop $outer
      ;; 初始化第一列
      (i32.store (local.get $dpBase) (local.get $i))
      
      (local.set $j (i32.const 1))
      (loop $inner
        ;; 计算替换成本
        (local.set $cost
          (if (result i32)
            (i32.eq
              (call $getChar (local.get $str1) (i32.sub (local.get $i) (i32.const 1)))
              (call $getChar (local.get $str2) (i32.sub (local.get $j) (i32.const 1)))
            )
            (then (i32.const 0))
            (else (i32.const 1))
          )
        )
        
        ;; 获取三个方向的值
        (local.set $above
          (i32.load (i32.add (local.get $dpBase) (i32.shl (local.get $j) (i32.const 2))))
        )
        (local.set $left
          (i32.load (i32.add (local.get $dpBase) (i32.shl (i32.sub (local.get $j) (i32.const 1)) (i32.const 2))))
        )
        (local.set $diag
          (if (result i32) (i32.eq (local.get $j) (i32.const 1))
            (then (i32.sub (local.get $i) (i32.const 1)))
            (else (local.get $diag))
          )
        )
        
        ;; 计算最小值
        (local.set $min
          (call $min
            (call $min
              (i32.add (local.get $above) (i32.const 1))  ;; 删除
              (i32.add (local.get $left) (i32.const 1))   ;; 插入
            )
            (i32.add (local.get $diag) (local.get $cost)) ;; 替换
          )
        )
        
        ;; 保存当前对角线值
        (local.set $diag (local.get $above))
        
        ;; 更新DP表
        (i32.store
          (i32.add (local.get $dpBase) (i32.shl (local.get $j) (i32.const 2)))
          (local.get $min)
        )
        
        (local.set $j (i32.add (local.get $j) (i32.const 1)))
        (br_if $inner (i32.le_u (local.get $j) (local.get $len2)))
      )
      
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $outer (i32.le_u (local.get $i) (local.get $len1)))
    )
    
    ;; 返回dp[len1][len2]
    (i32.load (i32.add (local.get $dpBase) (i32.shl (local.get $len2) (i32.const 2))))
  )
  
  ;; 批量比较多个字符串对
  ;; 参数：pairs_ptr（包含字符串对信息的数组），pairs_count
  ;; 返回：匹配的对数
  (func $batchCompare (export "batchCompare")
    (param $pairs i32) (param $count i32)
    (result i32)
    
    (local $i i32)
    (local $matches i32)
    (local $str1 i32)
    (local $len1 i32)
    (local $str2 i32)
    (local $len2 i32)
    
    (local.set $i (i32.const 0))
    (local.set $matches (i32.const 0))
    
    (loop $batch_loop
      (if (i32.lt_u (local.get $i) (local.get $count))
        (then
          ;; 读取字符串对信息（每对16字节：ptr1, len1, ptr2, len2）
          (local.set $str1 (i32.load (i32.add (local.get $pairs) (i32.shl (local.get $i) (i32.const 4)))))
          (local.set $len1 (i32.load (i32.add (local.get $pairs) (i32.add (i32.shl (local.get $i) (i32.const 4)) (i32.const 4)))))
          (local.set $str2 (i32.load (i32.add (local.get $pairs) (i32.add (i32.shl (local.get $i) (i32.const 4)) (i32.const 8)))))
          (local.set $len2 (i32.load (i32.add (local.get $pairs) (i32.add (i32.shl (local.get $i) (i32.const 4)) (i32.const 12)))))
          
          ;; 比较并累加匹配数
          (local.set $matches
            (i32.add
              (local.get $matches)
              (call $fastStringCompare (local.get $str1) (local.get $len1) (local.get $str2) (local.get $len2))
            )
          )
          
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          (br $batch_loop)
        )
      )
    )
    
    (local.get $matches)
  )
)





