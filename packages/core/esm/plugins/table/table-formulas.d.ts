/**
 * 表格公式计算功能
 * 支持类似Excel的公式计算
 *
 * @packageDocumentation
 */
/**
 * 公式类型
 */
export type FormulaType = 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT' | 'IF' | 'CONCAT';
/**
 * 单元格引用
 */
export interface CellReference {
    row: number;
    col: number;
}
/**
 * 公式解析结果
 */
export interface FormulaResult {
    /** 计算结果 */
    value: number | string | boolean;
    /** 是否有错误 */
    error: boolean;
    /** 错误信息 */
    errorMessage?: string;
    /** 依赖的单元格 */
    dependencies: CellReference[];
}
/**
 * 表格公式引擎
 */
export declare class TableFormulaEngine {
    private formulas;
    private cache;
    /**
     * 解析单元格引用（如A1, B2）
     * @param ref - 单元格引用字符串
     * @returns 单元格坐标
     */
    parseCellRef(ref: string): CellReference | null;
    /**
     * 列字母转索引（A=0, B=1, ...）
     */
    private columnToIndex;
    /**
     * 索引转列字母（0=A, 1=B, ...）
     */
    private indexToColumn;
    /**
     * 设置单元格公式
     * @param row - 行索引
     * @param col - 列索引
     * @param formula - 公式字符串（如 =SUM(A1:A10)）
     */
    setFormula(row: number, col: number, formula: string): void;
    /**
     * 获取单元格公式
     */
    getFormula(row: number, col: number): string | null;
    /**
     * 计算公式
     * @param formula - 公式字符串
     * @param table - 表格数据
     * @returns 计算结果
     */
    calculate(formula: string, table: string[][]): FormulaResult;
    /**
     * SUM函数
     */
    private sum;
    /**
     * AVG函数
     */
    private avg;
    /**
     * MIN函数
     */
    private min;
    /**
     * MAX函数
     */
    private max;
    /**
     * COUNT函数
     */
    private count;
    /**
     * CONCAT函数
     */
    private concat;
    /**
     * 解析范围（如A1:A10）
     */
    private parseRange;
    /**
     * 使缓存失效
     */
    private invalidateCache;
    /**
     * 清除所有公式
     */
    clear(): void;
}
/**
 * 创建表格公式引擎实例
 */
export declare function createFormulaEngine(): TableFormulaEngine;
//# sourceMappingURL=table-formulas.d.ts.map