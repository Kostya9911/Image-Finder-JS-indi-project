// Імпорти
import { fetchPics } from './fetchpics';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Змінні DOM

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

// Змінні

let inputValue;
let page;
let picsInfo;
let totalPages;
let lightbox = new SimpleLightbox('.gallery a');

// Слухачі

form.addEventListener('submit', submitForm);
moreBtn.addEventListener('click', onLoad);

// Функції

function submitForm(evt) {
  evt.preventDefault();
  moreBtn.hidden = true;
  inputValue = input.value.trim();
  form.reset();
  gallery.innerHTML = '';
  page = 1;

  if (inputValue.length === 0) {
    return;
  }
  fetchPics(inputValue)
    .then(data => {
      picsInfo = data.data.hits;
      totalPages = Math.ceil(data.data.totalHits / picsInfo.length);
      if (picsInfo.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else Notify.success(`Hooray! We found ${data.data.totalHits} images`);

      createMarkap(picsInfo);

      new SimpleLightbox('.gallery a');
      if (totalPages > 1) {
        moreBtn.hidden = false;
      }
    })
    .catch(error => {
      console.log(error.code);
      console.log(error.message);
    });
}

function createMarkap(picsInfo) {
  const markap = picsInfo
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="card">
      <div class="card__thumb-img">
       <a  href = "${largeImageURL}">
      <img class="card__img" src="${webformatURL}" alt="${tags}" loading="lazy"/>
       </a>
      </div>
    <div class="card__thumb-info">
      <div class="card__info">
        <p class="card__title-info">Likes</p>
        <p>${likes}</p>
      </div>
      <div class="card__info">
        <p class="card__title-info">Views</p>
        <p>${views}</p>
      </div>
      <div class="card__info">
        <p class="card__title-info">Comments</p>
        <p>${comments}</p>
      </div>
      <div class="card__info">
        <p class="card__title-info">Downloads</p>
        <p>${downloads}</p>
      </div>
    </div>
  </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markap);
}

function onLoad() {
  page += 1;

  fetchPics(inputValue, page).then(moreData => {
    picsInfo = moreData.data.hits;
    if (page >= totalPages) {
      moreBtn.hidden = true;
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }

    createMarkap(picsInfo);
    lightbox.refresh();
    scroll();
  });
}

function scroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1.7,
    behavior: 'smooth',
  });
}
