/**
 * 表格公式计算功能
 * 支持类似Excel的公式计算
 *
 * @packageDocumentation
 */
import { createLogger } from '../../utils/logger';
const logger = createLogger('TableFormulas');
/**
 * 表格公式引擎
 */
export class TableFormulaEngine {
    constructor() {
        this.formulas = new Map();
        this.cache = new Map();
    }
    /**
     * 解析单元格引用（如A1, B2）
     * @param ref - 单元格引用字符串
     * @returns 单元格坐标
     */
    parseCellRef(ref) {
        const match = ref.match(/^([A-Z]+)(\d+)$/);
        if (!match)
            return null;
        const col = this.columnToIndex(match[1]);
        const row = Number.parseInt(match[2]) - 1;
        return { row, col };
    }
    /**
     * 列字母转索引（A=0, B=1, ...）
     */
    columnToIndex(col) {
        let index = 0;
        for (let i = 0; i < col.length; i++)
            index = index * 26 + (col.charCodeAt(i) - 65 + 1);
        return index - 1;
    }
    /**
     * 索引转列字母（0=A, 1=B, ...）
     */
    indexToColumn(index) {
        let col = '';
        while (index >= 0) {
            col = String.fromCharCode(65 + (index % 26)) + col;
            index = Math.floor(index / 26) - 1;
        }
        return col;
    }
    /**
     * 设置单元格公式
     * @param row - 行索引
     * @param col - 列索引
     * @param formula - 公式字符串（如 =SUM(A1:A10)）
     */
    setFormula(row, col, formula) {
        const key = `${row},${col}`;
        this.formulas.set(key, formula);
        this.invalidateCache(row, col);
    }
    /**
     * 获取单元格公式
     */
    getFormula(row, col) {
        const key = `${row},${col}`;
        return this.formulas.get(key) || null;
    }
    /**
     * 计算公式
     * @param formula - 公式字符串
     * @param table - 表格数据
     * @returns 计算结果
     */
    calculate(formula, table) {
        // 移除=号
        const expr = formula.startsWith('=') ? formula.slice(1) : formula;
        const dependencies = [];
        try {
            // 解析公式类型
            const match = expr.match(/^(\w+)\((.*)\)$/);
            if (!match) {
                return {
                    value: expr,
                    error: false,
                    dependencies,
                };
            }
            const funcName = match[1].toUpperCase();
            const args = match[2];
            // 执行对应函数
            switch (funcName) {
                case 'SUM':
                    return this.sum(args, table, dependencies);
                case 'AVG':
                    return this.avg(args, table, dependencies);
                case 'MIN':
                    return this.min(args, table, dependencies);
                case 'MAX':
                    return this.max(args, table, dependencies);
                case 'COUNT':
                    return this.count(args, table, dependencies);
                case 'CONCAT':
                    return this.concat(args, table, dependencies);
                default:
                    return {
                        value: 0,
                        error: true,
                        errorMessage: `Unknown function: ${funcName}`,
                        dependencies,
                    };
            }
        }
        catch (error) {
            logger.error('Formula calculation error:', error);
            return {
                value: 0,
                error: true,
                errorMessage: String(error),
                dependencies,
            };
        }
    }
    /**
     * SUM函数
     */
    sum(args, table, dependencies) {
        const values = this.parseRange(args, table, dependencies);
        const sum = values.reduce((acc, val) => acc + (Number.parseFloat(val) || 0), 0);
        return {
            value: sum,
            error: false,
            dependencies,
        };
    }
    /**
     * AVG函数
     */
    avg(args, table, dependencies) {
        const values = this.parseRange(args, table, dependencies);
        const sum = values.reduce((acc, val) => acc + (Number.parseFloat(val) || 0), 0);
        const avg = values.length > 0 ? sum / values.length : 0;
        return {
            value: avg,
            error: false,
            dependencies,
        };
    }
    /**
     * MIN函数
     */
    min(args, table, dependencies) {
        const values = this.parseRange(args, table, dependencies).map(v => Number.parseFloat(v) || 0);
        const min = values.length > 0 ? Math.min(...values) : 0;
        return {
            value: min,
            error: false,
            dependencies,
        };
    }
    /**
     * MAX函数
     */
    max(args, table, dependencies) {
        const values = this.parseRange(args, table, dependencies).map(v => Number.parseFloat(v) || 0);
        const max = values.length > 0 ? Math.max(...values) : 0;
        return {
            value: max,
            error: false,
            dependencies,
        };
    }
    /**
     * COUNT函数
     */
    count(args, table, dependencies) {
        const values = this.parseRange(args, table, dependencies);
        return {
            value: values.length,
            error: false,
            dependencies,
        };
    }
    /**
     * CONCAT函数
     */
    concat(args, table, dependencies) {
        const values = this.parseRange(args, table, dependencies);
        return {
            value: values.join(''),
            error: false,
            dependencies,
        };
    }
    /**
     * 解析范围（如A1:A10）
     */
    parseRange(range, table, dependencies) {
        const values = [];
        if (range.includes(':')) {
            // 范围引用
            const [start, end] = range.split(':');
            const startRef = this.parseCellRef(start.trim());
            const endRef = this.parseCellRef(end.trim());
            if (startRef && endRef) {
                for (let row = startRef.row; row <= endRef.row; row++) {
                    for (let col = startRef.col; col <= endRef.col; col++) {
                        if (table[row] && table[row][col] !== undefined) {
                            values.push(table[row][col]);
                            dependencies.push({ row, col });
                        }
                    }
                }
            }
        }
        else {
            // 单个单元格引用
            const ref = this.parseCellRef(range.trim());
            if (ref && table[ref.row] && table[ref.row][ref.col] !== undefined) {
                values.push(table[ref.row][ref.col]);
                dependencies.push(ref);
            }
        }
        return values;
    }
    /**
     * 使缓存失效
     */
    invalidateCache(row, col) {
        const key = `${row},${col}`;
        this.cache.delete(key);
        // TODO: 使依赖此单元格的其他单元格缓存也失效
    }
    /**
     * 清除所有公式
     */
    clear() {
        this.formulas.clear();
        this.cache.clear();
    }
}
/**
 * 创建表格公式引擎实例
 */
export function createFormulaEngine() {
    return new TableFormulaEngine();
}
//# sourceMappingURL=table-formulas.js.map