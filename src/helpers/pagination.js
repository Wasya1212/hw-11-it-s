export default class Pagination {
  constructor(currentPage = 0) {
    this.currentPage = currentPage;
    this.maxPage = 1;
  }

  getPageError() {
    throw new Error('Wrong page number!');
  }

  checkPage(page) {
    return page >=0 && this.maxPage && page <= this.maxPage;
  }

  toNextPage() {
    if (!this.checkPage()) return this.getPageError();
    this.currentPage++;
  }

  toPrevPage() {
    if (!this.checkPage()) return this.getPageError();
    this.currentPage--;
  }

  setPage(page) {
    if (!this.checkPage()) return this.getPageError();
    this.currentPage = page;
  }

  setMaxPage(page) {
    if (page <= 0) return this.getPageError();
    this.maxPage = page;
  }
}