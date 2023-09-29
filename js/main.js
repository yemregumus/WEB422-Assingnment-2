/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Yunus Gumus Student ID: 150331197 Date: 2023/09/29
*
********************************************************************************/ 


let page = 1;
const perPage = 10;

function loadMovieData(title = null) {
    let url = `https://assignment1yeg.onrender.com/api/movies?page=${page}&perPage=${perPage}`;
    if (title !== null) {
        url += `&title=${title}`;
        page = 1;
        hidePagination();
    } else {
        showPagination();
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {

            const tableRows = data.map(movie => `
                <tr data-id="${movie._id}" class="movie">
                    <td>${movie.year}</td>
                    <td>${movie.title}</td>
                    <td>${movie.plot || 'N/A'}</td>
                    <td>${movie.rated || 'N/A'}</td>
                    <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
                </tr>`).join('');

            const tbodyElement = document.querySelector('table#moviesTable tbody');
            tbodyElement.innerHTML = tableRows;

            updateCurrentPage();

            addClickEventsToRows();
        })
        .catch(error => console.error(error));
}

function hidePagination() {
    const paginationElement = document.querySelector('.pagination');
    paginationElement.classList.add('d-none');
}


function showPagination() {
    const paginationElement = document.querySelector('.pagination');
    paginationElement.classList.remove('d-none');
}


function updateCurrentPage() {
    const currentPageElement = document.querySelector('#current-page');
    currentPageElement.textContent = page.toString();
}

function addClickEventsToRows() {
    const rows = document.querySelectorAll('table#moviesTable tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const movieId = row.dataset.id;
            const movieUrl = `https://assignment1yeg.onrender.com/api/movies/${movieId}`;

            fetch(movieUrl)
                .then(response => response.json())
                .then(movieData => {
                    const {
                        title,
                        poster,
                        directors,
                        fullplot,
                        cast,
                        awards,
                        imdb
                    } = movieData;

                    const modalTitleElement = document.querySelector('.modal-title');
                    modalTitleElement.textContent = title;

                    const modalBodyElement = document.querySelector('.modal-body');
                    modalBodyElement.innerHTML = `
                    ${poster ? `<img class="img-fluid w-100" src="${poster}"><br><br>` : ''}
                        <strong>Directed By:</strong> ${directors.join(', ')}<br><br>
                        <p>${fullplot}</p>
                        <strong>Cast:</strong> ${cast ? cast.join(', ') : 'N/A'}<br><br>
                        <strong>Awards:</strong> ${awards.text}<br>
                        <strong>IMDB Rating:</strong> ${imdb.rating} (${imdb.votes} votes)`;

                    const modalElement = new bootstrap.Modal(document.querySelector('#detailsModal'));
                    modalElement.show();
                })
                .catch(error => console.error(error));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const prevPageButton = document.querySelector('#previous-page');
    prevPageButton.addEventListener('click', () => {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });

    const nextPageButton = document.querySelector('#next-page');
    nextPageButton.addEventListener('click', () => {
        page++;
        loadMovieData();
    });

    const searchForm = document.querySelector('#searchForm');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.querySelector('#title').value;
        loadMovieData(title);
    });

    const clearFormButton = document.querySelector('#clearForm');
    clearFormButton.addEventListener('click', () => {
        document.querySelector('#title').value = '';
        loadMovieData();
    });

    loadMovieData();
});