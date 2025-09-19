{
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class BooksList {
    constructor() {
      this.favoriteBooks = [];
      this.filters = [];

      this.initData();
      this.getElements();
      this.render();
      this.initActions();
    }

    initData() {
      this.data = dataSource.books;
    }

    getElements() {
      this.dom = {};
      this.dom.booksList = document.querySelector('.books-list');
      this.dom.form = document.querySelector('.filters');
    }

    render() {
      this.dom.booksList.innerHTML = '';

      for (const book of this.data) {
        const ratingBgc = this.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10 + '%';

        book.ratingStyle = `width: ${ratingWidth}; background: ${ratingBgc};`;

        const generatedHTML = templates.book(book);
        const element = utils.createDOMFromHTML(generatedHTML);
        this.dom.booksList.appendChild(element);
      }
    }

    filterBooks() {
      const bookElements = this.dom.booksList.querySelectorAll('.book__image');

      for (const bookEl of bookElements) {
        const bookId = parseInt(bookEl.getAttribute('data-id'), 10);
        const bookData = this.data.find(book => book.id === bookId);

        let shouldBeHidden = false;

        if (this.filters.includes('adults') && !bookData.details.adults) {
          shouldBeHidden = true;
        }
        if (this.filters.includes('nonFiction') && !bookData.details.nonFiction) {
          shouldBeHidden = true;
        }

        if (shouldBeHidden) {
          bookEl.classList.add('hidden');
        } else {
          bookEl.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }

    initActions() {
      // obsługa ulubionych
      this.dom.booksList.addEventListener('dblclick', (event) => {
        event.preventDefault();

        const clickedImage = event.target.offsetParent;

        if (clickedImage && clickedImage.classList.contains('book__image')) {
          const bookId = clickedImage.getAttribute('data-id');

          if (!this.favoriteBooks.includes(bookId)) {
            this.favoriteBooks.push(bookId);
            clickedImage.classList.add('favorite');
          } else {
            const index = this.favoriteBooks.indexOf(bookId);
            this.favoriteBooks.splice(index, 1);
            clickedImage.classList.remove('favorite');
          }
        }
      });

      // obsługa filtrów
      this.dom.form.addEventListener('click', (event) => {
        const target = event.target;

        if (
          target.tagName === 'INPUT' &&
          target.type === 'checkbox' &&
          target.name === 'filter'
        ) {
          const value = target.value;

          if (target.checked) {
            if (!this.filters.includes(value)) this.filters.push(value);
          } else {
            const index = this.filters.indexOf(value);
            if (index !== -1) this.filters.splice(index, 1);
          }

          this.filterBooks();
        }
      });
    }
  }
  new BooksList();
}