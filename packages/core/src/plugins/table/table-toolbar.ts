/**
 * 表格悬浮工具栏插件
 * 提供单元格操作、行列管理、样式设置等功能
 */

import type { Plugin } from '../../types'
import { createPlugin } from '../../core/Plugin'

// 工具栏样式
const TOOLBAR_STYLES = `
.table-toolbar {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-size: 13px;
  user-select: none;
}

.table-toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 4px;
  border-right: 1px solid #e5e7eb;
}

.table-toolbar-group:last-child {
  border-right: none;
}

.table-toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #374151;
  transition: all 0.15s ease;
}

.table-toolbar-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.table-toolbar-btn:active {
  background: #e5e7eb;
}

.table-toolbar-btn.active {
  background: #3b82f6;
  color: #fff;
}

.table-toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.table-toolbar-btn svg {
  width: 16px;
  height: 16px;
}

.table-toolbar-dropdown {
  position: relative;
}

.table-toolbar-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  padding: 4px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  z-index: 1001;
}

.table-toolbar-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #374151;
  font-size: 13px;
  text-align: left;
  transition: background 0.15s ease;
}

.table-toolbar-dropdown-item:hover {
  background: #f3f4f6;
}

.table-toolbar-dropdown-item svg {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.table-toolbar-color-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  padding: 8px;
}

.table-toolbar-color-btn {
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.table-toolbar-color-btn:hover {
  transform: scale(1.15);
  border-color: #3b82f6;
}

.table-toolbar-separator {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}

/* 单元格选中状态 */
.table-cell-selected {
  background: rgba(59, 130, 246, 0.1) !important;
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

/* 表格hover效果 */
.table-wrapper:hover {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
`

// SVG 图标
const ICONS = {
  addRowAbove: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h18M3 14h18M10 3v18M14 3v18"/><path d="M12 3v4M10 5h4"/></svg>`,
  addRowBelow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h18M3 14h18M10 3v18M14 3v18"/><path d="M12 17v4M10 19h4"/></svg>`,
  addColLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 3v18M14 3v18M3 10h18M3 14h18"/><path d="M3 12h4M5 10v4"/></svg>`,
  addColRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 3v18M14 3v18M3 10h18M3 14h18"/><path d="M17 12h4M19 10v4"/></svg>`,
  deleteRow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/><path d="M17 9l-4 6M13 9l4 6" stroke="#ef4444"/></svg>`,
  deleteCol: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18M12 3v18M18 3v18"/><path d="M9 10l6 4M9 14l6-4" stroke="#ef4444"/></svg>`,
  deleteTable: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9l6 6M15 9l-6 6" stroke="#ef4444"/></svg>`,
  mergeCells: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/><path d="M8 8l4 4-4 4M16 8l-4 4 4 4"/></svg>`,
  splitCell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/><path d="M8 12H3M21 12h-5"/></svg>`,
  bgColor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15h18" fill="currentColor"/></svg>`,
  borderStyle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"/></svg>`,
  alignLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h12M3 18h18"/></svg>`,
  alignCenter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M3 18h18"/></svg>`,
  alignRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M9 12h12M3 18h18"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
}

// 预设颜色
const PRESET_COLORS = [
  '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280',
  '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706',
  '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669',
  '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb',
  '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed',
  '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777',
]

// 边框样式选项
const BORDER_STYLES = [
  { value: 'none', label: '无边框' },
  { value: 'solid', label: '实线' },
  { value: 'dashed', label: '虚线' },
  { value: 'dotted', label: '点线' },
  { value: 'double', label: '双线' },
]

/**
 * 表格工具栏类
 */
class TableToolbar {
  private toolbar: HTMLElement | null = null
  private currentTable: HTMLTableElement | null = null
  private currentCell: HTMLTableCellElement | null = null
  private selectedCells: HTMLTableCellElement[] = []
  private isSelecting = false
  private startCell: HTMLTableCellElement | null = null
  private styleInjected = false

  constructor() {
    this.injectStyles()
    this.setupEventListeners()
  }

  /**
   * 注入样式
   */
  private injectStyles() {
    if (this.styleInjected) return
    
    const styleId = 'table-toolbar-styles'
    if (document.getElementById(styleId)) {
      this.styleInjected = true
      return
    }

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = TOOLBAR_STYLES
    document.head.appendChild(style)
    this.styleInjected = true
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners() {
    // 点击表格单元格
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const cell = target.closest('td, th') as HTMLTableCellElement
      const table = target.closest('table') as HTMLTableElement

      if (cell && table) {
        this.selectCell(cell, table)
      } else if (!target.closest('.table-toolbar')) {
        this.hideToolbar()
      }
    })

    // 表格单元格选择（拖拽选择多个单元格）
    document.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement
      const cell = target.closest('td, th') as HTMLTableCellElement
      
      if (cell && e.shiftKey) {
        this.isSelecting = true
        this.startCell = cell
        e.preventDefault()
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (!this.isSelecting || !this.startCell) return

      const target = e.target as HTMLElement
      const cell = target.closest('td, th') as HTMLTableCellElement

      if (cell && cell.closest('table') === this.startCell.closest('table')) {
        this.selectRange(this.startCell, cell)
      }
    })

    document.addEventListener('mouseup', () => {
      this.isSelecting = false
      this.startCell = null
    })

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (!this.currentCell) return

      if (e.key === 'Escape') {
        this.hideToolbar()
        this.clearSelection()
      }
    })
  }

  /**
   * 选择单元格
   */
  private selectCell(cell: HTMLTableCellElement, table: HTMLTableElement) {
    this.clearSelection()
    
    this.currentCell = cell
    this.currentTable = table
    this.selectedCells = [cell]
    
    cell.classList.add('table-cell-selected')
    this.showToolbar(cell)
  }

  /**
   * 选择单元格范围
   */
  private selectRange(start: HTMLTableCellElement, end: HTMLTableCellElement) {
    const table = start.closest('table')
    if (!table) return

    this.clearSelection()

    const startRow = (start.parentElement as HTMLTableRowElement).rowIndex
    const endRow = (end.parentElement as HTMLTableRowElement).rowIndex
    const startCol = start.cellIndex
    const endCol = end.cellIndex

    const minRow = Math.min(startRow, endRow)
    const maxRow = Math.max(startRow, endRow)
    const minCol = Math.min(startCol, endCol)
    const maxCol = Math.max(startCol, endCol)

    this.selectedCells = []
    
    for (let i = minRow; i <= maxRow; i++) {
      const row = table.rows[i]
      for (let j = minCol; j <= maxCol; j++) {
        const cell = row.cells[j]
        if (cell) {
          cell.classList.add('table-cell-selected')
          this.selectedCells.push(cell)
        }
      }
    }
  }

  /**
   * 清除选择
   */
  private clearSelection() {
    this.selectedCells.forEach(cell => {
      cell.classList.remove('table-cell-selected')
    })
    this.selectedCells = []
  }

  /**
   * 显示工具栏
   */
  private showToolbar(cell: HTMLTableCellElement) {
    this.hideToolbar()
    
    this.toolbar = this.createToolbar()
    document.body.appendChild(this.toolbar)
    
    this.positionToolbar(cell)
  }

  /**
   * 隐藏工具栏
   */
  private hideToolbar() {
    if (this.toolbar) {
      this.toolbar.remove()
      this.toolbar = null
    }
    this.clearSelection()
    this.currentCell = null
    this.currentTable = null
  }

  /**
   * 定位工具栏
   */
  private positionToolbar(cell: HTMLTableCellElement) {
    if (!this.toolbar) return

    const rect = cell.getBoundingClientRect()
    const toolbarRect = this.toolbar.getBoundingClientRect()
    
    let top = rect.top - toolbarRect.height - 8
    let left = rect.left + (rect.width - toolbarRect.width) / 2

    // 边界检查
    if (top < 10) {
      top = rect.bottom + 8
    }
    if (left < 10) {
      left = 10
    }
    if (left + toolbarRect.width > window.innerWidth - 10) {
      left = window.innerWidth - toolbarRect.width - 10
    }

    this.toolbar.style.top = `${top + window.scrollY}px`
    this.toolbar.style.left = `${left + window.scrollX}px`
  }

  /**
   * 创建工具栏
   */
  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div')
    toolbar.className = 'table-toolbar'

    // 行列操作组
    const rowColGroup = document.createElement('div')
    rowColGroup.className = 'table-toolbar-group'
    
    rowColGroup.appendChild(this.createButton('addRowAbove', '在上方插入行', () => this.addRow('above')))
    rowColGroup.appendChild(this.createButton('addRowBelow', '在下方插入行', () => this.addRow('below')))
    rowColGroup.appendChild(this.createButton('addColLeft', '在左侧插入列', () => this.addColumn('left')))
    rowColGroup.appendChild(this.createButton('addColRight', '在右侧插入列', () => this.addColumn('right')))
    
    toolbar.appendChild(rowColGroup)

    // 删除操作组
    const deleteGroup = document.createElement('div')
    deleteGroup.className = 'table-toolbar-group'
    
    deleteGroup.appendChild(this.createButton('deleteRow', '删除行', () => this.deleteRow()))
    deleteGroup.appendChild(this.createButton('deleteCol', '删除列', () => this.deleteColumn()))
    deleteGroup.appendChild(this.createButton('deleteTable', '删除表格', () => this.deleteTable()))
    
    toolbar.appendChild(deleteGroup)

    // 合并/拆分组
    const mergeGroup = document.createElement('div')
    mergeGroup.className = 'table-toolbar-group'
    
    mergeGroup.appendChild(this.createButton('mergeCells', '合并单元格', () => this.mergeCells(), this.selectedCells.length < 2))
    mergeGroup.appendChild(this.createButton('splitCell', '拆分单元格', () => this.splitCell()))
    
    toolbar.appendChild(mergeGroup)

    // 样式组
    const styleGroup = document.createElement('div')
    styleGroup.className = 'table-toolbar-group'
    
    styleGroup.appendChild(this.createColorDropdown())
    styleGroup.appendChild(this.createBorderDropdown())
    styleGroup.appendChild(this.createAlignDropdown())
    
    toolbar.appendChild(styleGroup)

    return toolbar
  }

  /**
   * 创建按钮
   */
  private createButton(icon: string, title: string, onClick: () => void, disabled = false): HTMLButtonElement {
    const button = document.createElement('button')
    button.className = 'table-toolbar-btn'
    button.title = title
    button.innerHTML = ICONS[icon as keyof typeof ICONS] || ''
    button.disabled = disabled
    button.onclick = (e) => {
      e.stopPropagation()
      onClick()
    }
    return button
  }

  /**
   * 创建颜色选择下拉
   */
  private createColorDropdown(): HTMLElement {
    const dropdown = document.createElement('div')
    dropdown.className = 'table-toolbar-dropdown'

    const button = document.createElement('button')
    button.className = 'table-toolbar-btn'
    button.title = '背景颜色'
    button.innerHTML = ICONS.bgColor
    
    const menu = document.createElement('div')
    menu.className = 'table-toolbar-dropdown-menu'
    menu.style.display = 'none'

    const colorPicker = document.createElement('div')
    colorPicker.className = 'table-toolbar-color-picker'

    PRESET_COLORS.forEach(color => {
      const colorBtn = document.createElement('button')
      colorBtn.className = 'table-toolbar-color-btn'
      colorBtn.style.background = color
      colorBtn.title = color
      colorBtn.onclick = (e) => {
        e.stopPropagation()
        this.setCellBackground(color)
        menu.style.display = 'none'
      }
      colorPicker.appendChild(colorBtn)
    })

    menu.appendChild(colorPicker)
    dropdown.appendChild(button)
    dropdown.appendChild(menu)

    button.onclick = (e) => {
      e.stopPropagation()
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none'
    }

    return dropdown
  }

  /**
   * 创建边框样式下拉
   */
  private createBorderDropdown(): HTMLElement {
    const dropdown = document.createElement('div')
    dropdown.className = 'table-toolbar-dropdown'

    const button = document.createElement('button')
    button.className = 'table-toolbar-btn'
    button.title = '边框样式'
    button.innerHTML = ICONS.borderStyle

    const menu = document.createElement('div')
    menu.className = 'table-toolbar-dropdown-menu'
    menu.style.display = 'none'

    BORDER_STYLES.forEach(style => {
      const item = document.createElement('button')
      item.className = 'table-toolbar-dropdown-item'
      item.textContent = style.label
      item.onclick = (e) => {
        e.stopPropagation()
        this.setCellBorder(style.value)
        menu.style.display = 'none'
      }
      menu.appendChild(item)
    })

    dropdown.appendChild(button)
    dropdown.appendChild(menu)

    button.onclick = (e) => {
      e.stopPropagation()
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none'
    }

    return dropdown
  }

  /**
   * 创建对齐方式下拉
   */
  private createAlignDropdown(): HTMLElement {
    const dropdown = document.createElement('div')
    dropdown.className = 'table-toolbar-dropdown'

    const button = document.createElement('button')
    button.className = 'table-toolbar-btn'
    button.title = '对齐方式'
    button.innerHTML = ICONS.alignLeft

    const menu = document.createElement('div')
    menu.className = 'table-toolbar-dropdown-menu'
    menu.style.display = 'none'

    const alignments = [
      { icon: 'alignLeft', value: 'left', label: '左对齐' },
      { icon: 'alignCenter', value: 'center', label: '居中对齐' },
      { icon: 'alignRight', value: 'right', label: '右对齐' },
    ]

    alignments.forEach(align => {
      const item = document.createElement('button')
      item.className = 'table-toolbar-dropdown-item'
      item.innerHTML = `${ICONS[align.icon as keyof typeof ICONS]}<span>${align.label}</span>`
      item.onclick = (e) => {
        e.stopPropagation()
        this.setCellAlign(align.value)
        menu.style.display = 'none'
      }
      menu.appendChild(item)
    })

    dropdown.appendChild(button)
    dropdown.appendChild(menu)

    button.onclick = (e) => {
      e.stopPropagation()
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none'
    }

    return dropdown
  }

  /**
   * 添加行
   */
  private addRow(position: 'above' | 'below') {
    if (!this.currentCell || !this.currentTable) return

    const row = this.currentCell.parentElement as HTMLTableRowElement
    const rowIndex = row.rowIndex
    const colCount = row.cells.length

    const newRow = this.currentTable.insertRow(position === 'above' ? rowIndex : rowIndex + 1)
    
    for (let i = 0; i < colCount; i++) {
      const cell = newRow.insertCell()
      cell.innerHTML = '&nbsp;'
      cell.style.border = '1px solid #ddd'
      cell.style.padding = '8px'
      cell.setAttribute('contenteditable', 'true')
    }

    this.triggerUpdate()
  }

  /**
   * 添加列
   */
  private addColumn(position: 'left' | 'right') {
    if (!this.currentCell || !this.currentTable) return

    const cellIndex = this.currentCell.cellIndex
    const insertIndex = position === 'left' ? cellIndex : cellIndex + 1

    for (let i = 0; i < this.currentTable.rows.length; i++) {
      const row = this.currentTable.rows[i]
      const cell = row.insertCell(insertIndex)
      
      // 判断是表头还是表体
      const isHeader = row.parentElement?.tagName === 'THEAD'
      
      if (isHeader) {
        const th = document.createElement('th')
        th.textContent = `列 ${insertIndex + 1}`
        th.style.border = '1px solid #ddd'
        th.style.padding = '8px'
        th.style.backgroundColor = '#f5f5f5'
        th.setAttribute('contenteditable', 'true')
        cell.replaceWith(th)
      } else {
        cell.innerHTML = '&nbsp;'
        cell.style.border = '1px solid #ddd'
        cell.style.padding = '8px'
        cell.setAttribute('contenteditable', 'true')
      }
    }

    this.triggerUpdate()
  }

  /**
   * 删除行
   */
  private deleteRow() {
    if (!this.currentCell || !this.currentTable) return

    const row = this.currentCell.parentElement as HTMLTableRowElement
    
    // 至少保留一行
    if (this.currentTable.rows.length <= 1) {
      alert('表格至少需要保留一行')
      return
    }

    row.remove()
    this.hideToolbar()
    this.triggerUpdate()
  }

  /**
   * 删除列
   */
  private deleteColumn() {
    if (!this.currentCell || !this.currentTable) return

    const cellIndex = this.currentCell.cellIndex
    
    // 至少保留一列
    if (this.currentTable.rows[0].cells.length <= 1) {
      alert('表格至少需要保留一列')
      return
    }

    for (let i = 0; i < this.currentTable.rows.length; i++) {
      this.currentTable.rows[i].deleteCell(cellIndex)
    }

    this.hideToolbar()
    this.triggerUpdate()
  }

  /**
   * 删除表格
   */
  private deleteTable() {
    if (!this.currentTable) return

    const wrapper = this.currentTable.closest('.table-wrapper')
    if (wrapper) {
      wrapper.remove()
    } else {
      this.currentTable.remove()
    }

    this.hideToolbar()
    this.triggerUpdate()
  }

  /**
   * 合并单元格
   */
  private mergeCells() {
    if (this.selectedCells.length < 2) return

    // 获取选中区域的范围
    let minRow = Infinity, maxRow = -1, minCol = Infinity, maxCol = -1
    
    this.selectedCells.forEach(cell => {
      const row = (cell.parentElement as HTMLTableRowElement).rowIndex
      const col = cell.cellIndex
      minRow = Math.min(minRow, row)
      maxRow = Math.max(maxRow, row)
      minCol = Math.min(minCol, col)
      maxCol = Math.max(maxCol, col)
    })

    const table = this.currentTable
    if (!table) return

    // 获取第一个单元格
    const firstCell = table.rows[minRow].cells[minCol]
    
    // 收集所有内容
    let content = ''
    this.selectedCells.forEach(cell => {
      const text = cell.textContent?.trim()
      if (text && text !== '\u00A0') {
        content += (content ? ' ' : '') + text
      }
    })

    // 设置合并
    firstCell.rowSpan = maxRow - minRow + 1
    firstCell.colSpan = maxCol - minCol + 1
    firstCell.textContent = content || '\u00A0'

    // 删除其他单元格
    for (let i = minRow; i <= maxRow; i++) {
      const row = table.rows[i]
      for (let j = maxCol; j >= minCol; j--) {
        if (i === minRow && j === minCol) continue
        const cell = row.cells[j]
        if (cell) cell.remove()
      }
    }

    this.clearSelection()
    this.selectCell(firstCell, table)
    this.triggerUpdate()
  }

  /**
   * 拆分单元格
   */
  private splitCell() {
    if (!this.currentCell || !this.currentTable) return

    const rowSpan = this.currentCell.rowSpan || 1
    const colSpan = this.currentCell.colSpan || 1

    if (rowSpan === 1 && colSpan === 1) {
      alert('该单元格未合并，无法拆分')
      return
    }

    const startRow = (this.currentCell.parentElement as HTMLTableRowElement).rowIndex
    const startCol = this.currentCell.cellIndex
    const content = this.currentCell.textContent

    // 重置当前单元格
    this.currentCell.rowSpan = 1
    this.currentCell.colSpan = 1

    // 创建新单元格
    for (let i = 0; i < rowSpan; i++) {
      const row = this.currentTable.rows[startRow + i]
      const insertAt = i === 0 ? startCol + 1 : startCol

      for (let j = (i === 0 ? 1 : 0); j < colSpan; j++) {
        const cell = row.insertCell(insertAt + j)
        cell.innerHTML = '&nbsp;'
        cell.style.border = '1px solid #ddd'
        cell.style.padding = '8px'
        cell.setAttribute('contenteditable', 'true')
      }
    }

    this.triggerUpdate()
  }

  /**
   * 设置单元格背景色
   */
  private setCellBackground(color: string) {
    const cells = this.selectedCells.length > 0 ? this.selectedCells : (this.currentCell ? [this.currentCell] : [])
    cells.forEach(cell => {
      cell.style.backgroundColor = color
    })
    this.triggerUpdate()
  }

  /**
   * 设置单元格边框
   */
  private setCellBorder(style: string) {
    const cells = this.selectedCells.length > 0 ? this.selectedCells : (this.currentCell ? [this.currentCell] : [])
    cells.forEach(cell => {
      if (style === 'none') {
        cell.style.border = 'none'
      } else {
        cell.style.border = `1px ${style} #ddd`
      }
    })
    this.triggerUpdate()
  }

  /**
   * 设置单元格对齐
   */
  private setCellAlign(align: string) {
    const cells = this.selectedCells.length > 0 ? this.selectedCells : (this.currentCell ? [this.currentCell] : [])
    cells.forEach(cell => {
      cell.style.textAlign = align
    })
    this.triggerUpdate()
  }

  /**
   * 触发编辑器更新
   */
  private triggerUpdate() {
    const editorContent = document.querySelector('.ldesign-editor-content')
    if (editorContent) {
      const event = new Event('input', { bubbles: true })
      editorContent.dispatchEvent(event)
    }
  }

  /**
   * 销毁
   */
  destroy() {
    this.hideToolbar()
  }
}

// 工具栏实例
let tableToolbarInstance: TableToolbar | null = null

/**
 * 表格工具栏插件
 */
export const TableToolbarPlugin: Plugin = createPlugin({
  name: 'tableToolbar',
  init: () => {
    if (!tableToolbarInstance) {
      tableToolbarInstance = new TableToolbar()
    }
  },
  destroy: () => {
    if (tableToolbarInstance) {
      tableToolbarInstance.destroy()
      tableToolbarInstance = null
    }
  },
})
