import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { genCardMarkup } from '../helpers/gen-markup';

export const genGallery = (selector) => {
  const container = document.querySelector(selector);
  const controller = new SimpleLightbox(`${selector} a`, {
    captionsData: 'alt',
    captionDelay: 250
  });
  return { container, controller };
};

export const setItems = (items, gallery, savePrev = false) => {
  if (!gallery) return;
  const markup = items.reduce((html, item) => html += genCardMarkup(item), '');
  gallery.container.innerHTML = savePrev ? gallery.container.innerHTML + markup : markup;
  gallery.controller.refresh();
};

export default genGallery;