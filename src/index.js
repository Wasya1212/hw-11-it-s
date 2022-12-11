import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { genCardMarkup } from './helpers/gen-markup';
import Pagination from './helpers/pagination';
import { getImages } from './api/pixabay';

const galleryContainer = document.querySelector('.gallery');

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250
});

// FOR PAGINATION
const pagination = new Pagination(1);
let currentSearchQuery = '';

const genCardsList = async (searchQuery = currentSearchQuery) => {
  let galleryHtml = galleryContainer.innerHTML;
  
  if (currentSearchQuery !== searchQuery) {
    currentSearchQuery = searchQuery;
    galleryHtml = '';
    pagination.setPage(1);
  }
  
  try {
    const data = await getImages(currentSearchQuery, pagination.currentPage)
    pagination.toNextPage();
    return data.hits.reduce((html, hit) => html += genCardMarkup(hit), galleryHtml);
  } catch (err) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    pagination.toPrevPage();
  }
};

const loadBtn = document.querySelector('button.load-more');

const loadMore = async (data) => {
  loadBtn.classList.add('hidden');
  galleryContainer.innerHTML = await genCardsList(data);
  gallery.refresh();
  loadBtn.classList.remove('hidden');
}

loadBtn.addEventListener('click', loadMore);

const searchForm = document.querySelector('form.search-form');

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].intersectionRatio <= 0) return;
  loadMore((new FormData(searchForm)).get('searchQuery'));
});

const onSubmit = async (e) => {
  e.preventDefault();

  await loadMore((new FormData(searchForm)).get('searchQuery'));
  intersectionObserver.observe(document.querySelector(".load-more"));
};

searchForm.addEventListener('submit', onSubmit);