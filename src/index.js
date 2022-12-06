import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { debounce } from 'lodash';
import 'simplelightbox/dist/simple-lightbox.min.css';

const PAGE_OFFSET = 50;
const ITEMS_PER_PAGE = 40;

const genCardMarkup = (data) => `
  <div class="photo-card">
    <a href="${data.largeImageURL}">
      <img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${data.likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span>${data.views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${data.comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${data.downloads}</span>
      </p>
    </div>
  </div>
`;

const galleryContainer = document.querySelector('.gallery');

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250
});

// FOR PAGINATION
let currentPage = 0;
let currentSearchQuery = '';

const setImagesToGallery = async (searchQuery = currentSearchQuery) => {
  let galleryHtml = galleryContainer.innerHTML;
  
  if (currentSearchQuery !== searchQuery) {
    currentSearchQuery = searchQuery;
    galleryHtml = '';
    currentPage = 0;
  }
  
  const { data } = await axios.get(`https://pixabay.com/api/?key=31831621-997ea1f90a535f6e50ab0825b&q=${currentSearchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${++currentPage}&per_page=${ITEMS_PER_PAGE}`);

  if (!data.hits.length) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return currentPage--;
  }
  
  galleryContainer.innerHTML = data.hits.reduce((html, hit) => html += genCardMarkup(hit), galleryHtml);
}

const loadBtn = document.querySelector('button.load-more');

const loadMore = async (data) => {
  loadBtn.classList.add('hidden');
  await setImagesToGallery(data);
  gallery.refresh();
  loadBtn.classList.remove('hidden');
}

loadBtn.addEventListener('click', loadMore);

const searchForm = document.querySelector('form.search-form');

const bottomTrigger = debounce(() => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - PAGE_OFFSET) {
    loadMore();    
  }
}, 300);

const onSubmit = async (e) => {
  e.preventDefault();

  await loadMore((new FormData(searchForm)).get('searchQuery'));

  try {
    document.removeEventListener('scroll', bottomTrigger);
    document.addEventListener('scroll', bottomTrigger);
  } catch (err) {
    console.error(err);
  }
};

searchForm.addEventListener('submit', onSubmit);