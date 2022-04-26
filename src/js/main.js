import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './service/api';
import { createMarkup } from './createMarkup';

const searchForm = document.querySelector('#search-form');
// const searchButton = document.querySelector('button[type=submit]');
const loadMoreButtton = document.querySelector('.load-more');
export const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreButtton.addEventListener('click', onLoadMoreButton);

let searchRequest = '';
let page = 1;
let perPage = 39;
let simpleLightBox;

function onSearchFormSubmit(e) {
  e.preventDefault();
  page = 1;
  searchRequest = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreButtton.classList.add('is-hidden');

  fetchImages(searchRequest, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        createMarkup(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionPosition: 'bottom',
          captionDelay: 250,
          enableKeyboard: true,
        }).refresh();
        alertImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreButtton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMoreButton() {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(searchRequest, page, perPage)
    .then(({ data }) => {
      createMarkup(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page === totalPages) {
        loadMoreButtton.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function alertImagesFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoImagesFound() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function alertEndOfSearch() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
}
