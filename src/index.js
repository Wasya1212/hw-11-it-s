import Notiflix from 'notiflix';

import { getImages, ITEMS_PER_PAGE } from './api/pixabay';
import { genGallery, setItems } from './features/gallery';
import Pagination from './helpers/pagination';

const gallery = genGallery('.gallery');

const pagination = new Pagination(1, 1);

let currentSearchQuery = '';
let endOfResults = false;

const getCardsList = async (searchQuery, { onSuccess, onFail }) => {
  try {
    const data = await getImages(searchQuery, pagination.currentPage);
    onSuccess?.(data);
    return data.hits;
  } catch (err) {
    onFail?.();
    return [];
  }
};

const loadBtn = document.querySelector('button.load-more');

const loadMore = async (searchQuery = currentSearchQuery, onSuccess) => {
  const isOldSearchQuery = searchQuery === currentSearchQuery;
  loadBtn.classList.add('hidden');

  if (pagination.currentPage > pagination.maxPage) return pagination.setPage(pagination.maxPage);

  if (pagination.isLastPage && isOldSearchQuery) {
    !endOfResults && !pagination.isFirstPage && Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    !endOfResults && (endOfResults = true);
  }

  if (!isOldSearchQuery) {
    currentSearchQuery = searchQuery;
    pagination.setPage(1);
    endOfResults = false;
  }

  const cards = await getCardsList(currentSearchQuery, {
    onSuccess: (data) => {
      pagination.setMaxPage(Math.ceil(data.totalHits / ITEMS_PER_PAGE));
      loadBtn.classList.remove('hidden');
      onSuccess?.(data);
    },
    onFail: () => {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      pagination.toPrevPage();
    }
  });

  setItems(cards, gallery, isOldSearchQuery);
};


loadBtn.addEventListener('click', () => {
  pagination.toNextPage();
  loadMore();
});

// MANAGE SEARCH FORM

const searchForm = document.querySelector('form.search-form');

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].intersectionRatio <= 0) return;
  pagination.toNextPage();
  loadMore();
});

const onSubmit = async (e) => {
  e.preventDefault();

  const searchQuery = (new FormData(searchForm)).get('searchQuery');
  
  if (!searchQuery) return;
  
  await loadMore(searchQuery, ({ totalHits }) => {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    intersectionObserver.observe(loadBtn);
  });  
};

searchForm.addEventListener('submit', onSubmit);