// Імпорти

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
// console.log(axios);

// Змінні DOM

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const searchBtn = document.querySelector('.search-form__btn');
const section = document.querySelector('section');

// Змінні

const KEY = '33109675-647afcf76cb57c4c0eb06a2e1';
let inputValue;

// Слухачі

form.addEventListener('submit', submitForm);

// Функції

function submitForm(evt) {
  evt.preventDefault();
  inputValue = input.value.trim();
  form.reset();
  section.innerHTML = '';

  if (inputValue.length === 0) {
    return;
  }
  fetchPics(inputValue).then(date => {
    // console.log(date.data.hits);
    const picsInfo = date.data.hits;
    console.log(picsInfo[1].tags);
    createMarkap(picsInfo);
  });
}

function fetchPics(name) {
  return (
    axios
      .get(
        `https://pixabay.com/api/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
      )
      // .then(response => {
      //   console.log(response);
      //   // if (!response.ok) {
      //   //   throw new Error(response.statusText);
      //   // }
      //   return response;
      // })
      .catch(error => {
        console.log(error.statusText);
      })
  );
}

function createMarkap(data) {
  const markap = data
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
      <img class="card__img" src="${webformatURL}" alt="${tags}" />
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
  section.insertAdjacentHTML('beforeend', markap);
  var lightbox = new SimpleLightbox('.main-section a', {
    // captionsData: 'alt',
    // captionDelay: 250,
  });
}
