/**
 * pagination.js —— 通用分页组件
 * 用于首页和归档页，接收数据数组、每页条数、容器元素和渲染回调。
 * 
 * 用法示例：
 *   const pg = new Pagination(data, 10, document.getElementById('pagination-container'), renderCards);
 *   pg.goTo(1);  // 渲染第 1 页
 */

class Pagination {
  /**
   * @param {Array}    data          - 全量数据数组
   * @param {number}   itemsPerPage  - 每页显示条数
   * @param {HTMLElement} container  - 分页按钮容器元素
   * @param {Function} renderFn      - 渲染函数，签名为 (pageItems, pageIndex)
   */
  constructor(data, itemsPerPage, container, renderFn) {
    this.data = data;
    this.itemsPerPage = itemsPerPage;
    this.container = container;
    this.renderFn = renderFn;
    this.totalPages = Math.ceil(data.length / itemsPerPage) || 1;
    this.currentPage = 1;
  }

  /** 跳转到指定页 */
  goTo(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    // 计算当前页数据切片
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageItems = this.data.slice(start, end);

    // 调用渲染函数
    this.renderFn(pageItems, page);

    // 渲染分页按钮
    this.renderControls();

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** 渲染分页按钮 */
  renderControls() {
    this.container.innerHTML = '';
    const tp = this.totalPages;
    const cp = this.currentPage;

    if (tp <= 1) return;

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '« 上一页';
    prevBtn.disabled = cp === 1;
    prevBtn.addEventListener('click', () => this.goTo(cp - 1));
    this.container.appendChild(prevBtn);

    // 页码按钮（最多显示 7 个页码，超出显示省略号）
    const pages = this.getPageNumbers(tp, cp);
    pages.forEach(p => {
      if (p === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        this.container.appendChild(ellipsis);
      } else {
        const btn = document.createElement('span');
        btn.className = 'page-num' + (p === cp ? ' active' : '');
        btn.textContent = p;
        btn.addEventListener('click', () => this.goTo(p));
        this.container.appendChild(btn);
      }
    });

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '下一页 »';
    nextBtn.disabled = cp === tp;
    nextBtn.addEventListener('click', () => this.goTo(cp + 1));
    this.container.appendChild(nextBtn);
  }

  /** 计算要显示的页码列表 */
  getPageNumbers(totalPages, current) {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    // 始终包含第 1 页
    pages.push(1);

    if (current > 4) {
      pages.push('...');
    }

    // 中间范围
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    // 扩展范围以确保至少显示 5 个页码（含首尾）
    let s = start;
    let e = end;
    if (current <= 4) {
      e = Math.min(totalPages - 1, 5);
    }
    if (current >= totalPages - 3) {
      s = Math.max(2, totalPages - 4);
    }

    for (let i = s; i <= e; i++) {
      pages.push(i);
    }

    if (current < totalPages - 3) {
      pages.push('...');
    }

    // 始终包含最后一页
    pages.push(totalPages);

    return pages;
  }

  /** 更新数据（例如从 API 获取后） */
  setData(newData) {
    this.data = newData;
    this.totalPages = Math.ceil(newData.length / this.itemsPerPage) || 1;
    this.goTo(1);
  }
}