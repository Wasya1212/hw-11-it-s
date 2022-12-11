export default class Pagination {
  constructor(currentPage = 0) {
    this.currentPage = currentPage;
  }

  toNextPage() {
    this.currentPage++;
  }

  toPrevPage() {
    this.currentPage--;
  }
}