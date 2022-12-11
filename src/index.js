import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { genCardMarkup } from './helpers/gen-markup';
import Pagination from './helpers/pagination';
import { getImages, ITEMS_PER_PAGE } from './api/pixabay';

const galleryContainer = document.querySelector('.gallery');

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250
});

const pagination = new Pagination(1, 1);
let currentSearchQuery = '';

const genCardsList = async (searchQuery) => {  
  try {
    const { hits, totalHits } = await getImages(searchQuery, pagination.currentPage)
    pagination.setMaxPage(Math.ceil(totalHits / ITEMS_PER_PAGE));
    pagination.toNextPage();
    return hits.reduce((html, hit) => html += genCardMarkup(hit), '');
  } catch (err) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    pagination.toPrevPage();
  }
};

const loadBtn = document.querySelector('button.load-more');

const loadMore = async (searchQuery = currentSearchQuery) => {
  if (pagination.isLastPage() && searchQuery === currentSearchQuery) return;
  
  let html = '';

  if (currentSearchQuery !== searchQuery) {
    currentSearchQuery = searchQuery;
    pagination.setPage(1);
  } else {
    html = galleryContainer.innerHTML;
  }
  
  loadBtn.classList.add('hidden');
  galleryContainer.innerHTML = html + await genCardsList(currentSearchQuery);
  gallery.refresh();
  loadBtn.classList.remove('hidden');
};

loadBtn.addEventListener('click', loadMore);

const searchForm = document.querySelector('form.search-form');

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].intersectionRatio <= 0) return;
  loadMore();
});

const onSubmit = async (e) => {
  e.preventDefault();

  const searchQuery = (new FormData(searchForm)).get('searchQuery');
  await loadMore(searchQuery);
  intersectionObserver.observe(document.querySelector(".load-more"));
};

searchForm.addEventListener('submit', onSubmit);