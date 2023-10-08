const books = [];
const RENDER_EVENT = 'uncompleted-book';
const SAVED_EVENT = 'completed-book';
const STORAGE_KEY = 'BOOKS_APPS';


function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
}

function findId(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
}

// function findTitle(query) {
//     for (const bookItem of books) {
//       if (bookItem.title === title) {
//         return bookItem;
//       }
//     }
//     return null;
// }
function findTitle(query) {
    const matchingBooks = [];

    for (const bookItem of books) {
        if (bookItem.title.toLowerCase().includes(query.toLowerCase())) {
            matchingBooks.push(bookItem);
        }
    }

    return matchingBooks.length > 0 ? matchingBooks : null;
}

function findIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    };
  }

function isStorageExist(){
    if (typeof (Storage) === undefined) {
      alert('Browser tidak mendukung local storage');
      return false;
    }
    return true;
}

function makeBooks(bookObject){

    const {id, title, author, year, isCompleted} = bookObject;

    let content = `<h3>${title}</h3>
            <p>Penulis: ${author}</p>
            <p>Tahun: ${year}</p>`;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.setAttribute('id', `book-${id}`);
    container.innerHTML = content;

    const div = document.createElement('div');
    div.classList.add('action');

    if(isCompleted){
        const uncompletedButton = document.createElement('button');
        uncompletedButton.classList.add('green');
        uncompletedButton.innerText = 'Belum selesai dibaca';
        uncompletedButton.addEventListener('click', function(){
            undoTaskFromCompleted(id);
        })
        div.append(uncompletedButton);
    } else {
        const completedButton = document.createElement('button');
        completedButton.classList.add('green');
        completedButton.innerText = 'Selesai dibaca';
        completedButton.addEventListener('click', function(){
            addTaskFromCompleted(id);
        })
        div.append(completedButton);
    }
    
    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = 'Hapus Buku';
    removeButton.addEventListener('click', function(){
        removeTaskFromCompleted(id)
    })

    div.append(removeButton)

    container.append(div);

    return container;
}

function addBook() {
    const id = generateId();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
  
    const todoObject = generateBookObject(id, title, author, year, isCompleted);
    books.push(todoObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function removeTaskFromCompleted(id){
    const bookTarget = findIndex(id);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(id){
    const bookTarget = findId(id);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskFromCompleted(id){
    const bookTarget = findId(id);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBookByTitle(title){
    const bookTarget = findTitle(title);
    
    if(bookTarget == null) return;

    const incompleted = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');
  
    // clearing list item
    incompleted.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (const bookItem of bookTarget) {
      const bookEl = makeBooks(bookItem);
      if (bookItem.isCompleted) {
        listCompleted.append(bookEl);
      } else {
        incompleted.append(bookEl);
      }
    }
}


document.addEventListener('DOMContentLoaded', function () {

    const booksForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchSubmit');

    booksForm.addEventListener('submit', function (e) {
      e.preventDefault();
      addBook();
    });

    searchForm.addEventListener('click', function(e){
        e.preventDefault();
        const title = document.getElementById('searchBookTitle').value;
        searchBookByTitle(title);
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    return true;
});


document.addEventListener(RENDER_EVENT, function () {
    const incompleted = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');
  
    // clearing list item
    incompleted.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (const bookItem of books) {
      const bookEl = makeBooks(bookItem);
      if (bookItem.isCompleted) {
        listCompleted.append(bookEl);
      } else {
        incompleted.append(bookEl);
      }
    }
  });
  
