'use strict';

const imageContainer = document.querySelector('.images-container');
const loadMore = document.getElementById('loadMore');
const saveConfirmed = document.querySelector('.save-confirmed');
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const favoritesEl = document.getElementById('favoritesEl');
const nasaImagesNavEl = document.getElementById('load-more-nasa-images');
const loader = document.querySelector('.loader');

const count = 10;
const api_key = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&count=${count}`;
let favorites = {};

let resultsArray = [];
let favoritesArray = [];

const getNasaPictures = async function () {
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
    renderPictures(data);
  } catch (err) {
    console.error(err);
  }
};

const renderPictures = function (data, favorites = false) {
  data.forEach(pictureData => {
    console.log(pictureData);
    const html = `
  <div class="card">
    <a href="${pictureData.hdurl}" title="View Full Image" target="_blank">
      <img src="${
        pictureData.url
      }" alt="NASA Picture of the Day" class="card-img-top" />
    </a>
    <div class="card-body">
      <h5 class="card-title">${pictureData.title}</h5>
      <p class="clickable" onclick=${
        favorites
          ? `removeFavorite('${pictureData.url}')`
          : `saveFavorite('${pictureData.url}')`
      }>
      ${!favorites ? 'Add to Favorites' : 'Remove Favorite'}</p>
      <p class="card-text">
        ${pictureData.explanation}
      </p>
      <small class="text-muted">
        <strong>${pictureData.date}</strong>
        <span>${pictureData.copyright ? pictureData.copyright : ''}</span>
      </small>
    </div>
  </div>`;

    imageContainer.insertAdjacentHTML('beforeend', html);

    resultsArray.push(pictureData);
  });
  showContent();
};

const saveFavorite = function (itemUrl) {
  console.log(resultsArray);
  resultsArray.forEach(item => {
    if (item.url.includes(itemUrl) && !favorites[item.url]) {
      favorites[item.url] = item;
      saveConfirmed.hidden = false;
      setTimeout(() => (saveConfirmed.hidden = true), 2000);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  });
};

const renderFavorites = function () {
  loader.classList.remove('hidden');
  if (localStorage.getItem('favorites')) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
    imageContainer.innerHTML = '';
    renderPictures(Object.values(favorites), true);
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
    showContent();
  }
};

const removeFavorite = function (itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    imageContainer.innerHTML = '';
    renderPictures(Object.values(favorites), true);
    showContent();
  }
};

const goMainPage = function () {
  resultsNav.classList.remove('hidden');
  favoritesNav.classList.add('hidden');
  imageContainer.innerHTML = '';
  getNasaPictures();
};

const showContent = function () {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');
};

getNasaPictures();

loadMore.addEventListener('click', getNasaPictures);
favoritesEl.addEventListener('click', renderFavorites);
nasaImagesNavEl.addEventListener('click', goMainPage);
