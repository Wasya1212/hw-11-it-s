export default class Pagination {
  constructor(currentPage = 0, maxPage = -1) {
    this.currentPage = currentPage;
    this.maxPage = maxPage;
  }

  getPageError() {
    throw new Error('Wrong page number!');
  }

  checkPage(page) {
    if (page >= 0 && this.maxPage === -1) return true;
    return page >=0 && this.maxPage && page <= this.maxPage;
  }

  toNextPage() {
    if (!this.checkPage(this.currentPage + 1)) return;
    this.currentPage++;
  }

  toPrevPage() {
    if (!this.checkPage(this.currentPage - 1)) return;
    this.currentPage--;
  }

  setPage(page) {
    if (!this.checkPage(page)) return this.getPageError();
    this.currentPage = page;
  }

  setMaxPage(page) {
    if (page <= 0) return this.getPageError();
    this.maxPage = page;
  }

  isLastPage() {
    return this.currentPage === this.maxPage;
  }
}