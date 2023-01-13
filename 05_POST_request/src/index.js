//////////////////////////////////////////////////////////
// Fetch Data & Call render functions to populate the DOM
//////////////////////////////////////////////////////////
getJSON('http://localhost:3000/stores')
  .then((stores) => {
    // this populates a select tag with options so we can switch between stores on our web page
    renderStoreSelectionOptions(stores);
    renderHeader(stores[0])
    renderFooter(stores[0])
  })
  .catch(err => {
    console.error(err);
    // renderError('Make sure to start json-server!') // I'm skipping this so we only see this error message once if JSON-server is actually not running
  });

// load all the books and render them
getJSON("http://localhost:3000/books")
  .then((books) => {
    books.forEach(renderBook)
  })
  .catch(renderError);


///////////////////
// render functions
///////////////////
function renderHeader(bookStore) {
  document.querySelector('header h1').textContent = bookStore.name;
}

function renderFooter(bookStore) {
  document.querySelector('#address').textContent = bookStore.address;
  document.querySelector('#number').textContent = bookStore.number;
  document.querySelector('#store').textContent = bookStore.location;
}

// adds options to a select tag that allows swapping between different stores
function renderStoreSelectionOptions(stores) {
  // target the select tag
  const storeSelector = document.querySelector('#store-selector');
  // clear out any currently visible options
  storeSelector.innerHTML = "";
  // add an option to the select tag for each store
  stores.forEach(addSelectOptionForStore)
  // add a listener so that when the selection changes, we fetch that store's data from the server and load it into the DOM
  storeSelector.addEventListener('change', (e) => {
    getJSON(`http://localhost:3000/stores/${e.target.value}`)
      .then(store => {
        renderHeader(store);
        renderFooter(store);
      })
  })
}

const storeSelector = document.querySelector('#store-selector');

function addSelectOptionForStore(store) {
  const option = document.createElement('option');
  // the option value will appear within e.target.value
  option.value = store.id;
  // the options textContent will be what the user sees when choosing an option
  option.textContent = store.name;
  storeSelector.append(option);
}

// function: renderBook(book)
// --------------------------
// accepts a book object as an argument and creates
// an li something like this:
// <li class="list-li">
//   <h3>Eloquent JavaScript</h3>
//   <p>Marjin Haverbeke</p>
//   <p>$10.00</p>
//   <img src="https://images-na.ssl-images-amazon.com/images/I/51IKycqTPUL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg" alt="Eloquent JavaScript cover"/>
// </li>
// appends the li to the ul#book-list in the DOM
function renderBook(book) {
    
  const li = document.createElement('li');
  li.className = 'list-li';
  
  const h3 = document.createElement('h3');
  h3.textContent = book.title;

  const pAuthor = document.createElement('p');
  pAuthor.textContent = book.author;
  
  const pPrice = document.createElement('p');
  pPrice.textContent = `${formatPrice(book.price)}`;
  
  const pStock = document.createElement('p');
  pStock.className = "grey";
  if (book.inventory === 0) {
    pStock.textContent = "Out of stock";
  } else if (book.inventory < 3) {
    pStock.textContent = "Only a few left!";
  } else {
    pStock.textContent = "In stock"
  }
  
  const img = document.createElement('img');
  img.src = book.imageUrl;
  img.alt = `${book.title} cover`;

  const btn = document.createElement('button');
  btn.textContent = 'Delete';

  btn.addEventListener('click', (e) => {
    li.remove();
  })

  li.append(h3, pAuthor, pPrice, pStock, img, btn);
  document.querySelector('#book-list').append(li);
}

function renderError(error) {
  const main = document.querySelector('main');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  if (error.message === "Failed to fetch") {
    errorDiv.textContent = "Whoops! Looks like you forgot to start your JSON-server!"
  } else {
    errorDiv.textContent = error;
  }
  main.prepend(errorDiv);
  window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      errorDiv.remove();
    }
  })
}

function formatPrice(price) {
  return '$' + Number.parseFloat(price).toFixed(2);
}

// fill in a form's with the data in an object
function fillIn(form, data) {
  for (field in data) {
    // use [] notation for accessing data stored 
    // in an object at variable keys, i.e. when
    // we don't know the key name up front.
    // In this case, it comes from an argument.
    form[field].value = data[field]
  }
}

////////////////////////////////////////////////////////////////
// Event Listeners/Handlers (Behavior => Data => Display)
////////////////////////////////////////////////////////////////

// UI Events
////////////////////////////////////////////////////////////////
const toggleBookFormButton = document.querySelector('#toggleBookForm');
const bookForm = document.querySelector('#book-form');
const toggleStoreFormButton = document.querySelector('#toggleStoreForm');
const storeForm = document.querySelector('#store-form');

function toggleBookForm() {
  const bookFormHidden = bookForm.classList.toggle('collapsed');
  if (bookFormHidden) {
    toggleBookFormButton.textContent = "New Book";
  } else {
    toggleBookFormButton.textContent = "Hide Book Form";
  }
}

function toggleStoreForm() {
  const storeFormHidden = storeForm.classList.toggle('collapsed');
  if (storeFormHidden) {
    toggleStoreFormButton.textContent = "New Store";
  } else {
    toggleStoreFormButton.textContent = "Hide Store Form";
  }
}

// hide and show the new book/store form when toggle buton is clicked
toggleBookFormButton.addEventListener('click', toggleBookForm);
toggleStoreFormButton.addEventListener('click', toggleStoreForm);

// also hide both form when they're visible and the escape key is pressed

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!bookForm.classList.contains('collapsed')) {
      toggleBookForm();
    };
    if (!storeForm.classList.contains('collapsed')) {
      toggleStoreForm();
    };
  }
})

// Data persisting events
////////////////////////////////////////////////////////////////

// this is what a book looks like in db.json
// {
//   id:1,
//   title: 'Eloquent JavaScript: A Modern Introduction to Programming',
//   author: 'Marjin Haverbeke',
//   price: 10.00,
//   reviews: [{userID: 1, content:'Good book, but not great for new coders'}],
//   inventory: 10,
//   imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51IKycqTPUL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg'
// }
// we can use a book as an argument for renderBook!  This will add the book's info to the webpage.
bookForm.addEventListener('submit', (e) => { 
  e.preventDefault();
  // pull the info for the new book out of the form
  const book = {
    title: e.target.title.value,
    author: e.target.author.value,
    price: Number.parseFloat(e.target.price.value),
    reviews: [],
    inventory: Number(e.target.inventory.value),
    imageUrl: e.target.imageUrl.value
  }
  // pass the info as an argument to renderBook for display!
  // 1. Add the ability to perist the book to the database when the form is submitted. When this works, we should still see the book that is added to the DOM on submission when we refresh the page.
  // optimistic version (DOM update doesn't depend on server update response)
  
  fetch("http://localhost:3000/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  })
    .then(response => response.json())
    .then(book => {
      console.log(book);
    })
  
  renderBook(book);
  
  // pessimistic version (DOM update doesn't happen until we get server response)
  // fetch("http://localhost:3000/books", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(book)
  // })
  //   .then(response => response.json())
  //   .then(book => {
  //     renderBook(book);
  //   })

  e.target.reset();
})

fillIn(bookForm, {
  "title": "JS is cool ",
  "author": "me ",
  "price": 23,
  "inventory": 23,
  "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/5131OWtQRaL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg"
})

// 2. Hook up the new Store form so it that it works to add a new store to our database and also to the DOM (as an option within the select tag)

storeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const store = {
    location: e.target.location.value,
    address: e.target.address.value,
    number: e.target.number.value,
    name: e.target.name.value,
    hours: e.target.hours.value
  }

  // optimistic rendering (add the store to the DOM before server update)
  // addSelectOptionForStore(store);

  // fetch("http://localhost:3000/stores", {
  //   method: "POST",
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(store)
  // })

  // hybrid (the actual way to do optimistic rendering because you're fixing a bug that
  // is introduced by implementing optimistic rendering)
  
  // addSelectOptionForStore(store);

  // fetch("http://localhost:3000/stores", {
  //   method: "POST",
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(store)
  // })  
  //   .then(response => response.json())
  //   .then(savedStore => {
  //     // find the dom node (option tag) without a value assigned (db id)
  //     // and then assign the savedStore's id to the value of that option
  //     const storeSelector = document.querySelector('#store-selector');
  //     storeSelector.querySelector('option:last-child').value = savedStore.id
  //   })
  
  
  //pessimistic

  fetch("http://localhost:3000/stores", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(store)
  })  
    .then(response => response.json())
    .then(addSelectOptionForStore)

  
  console.log(store);
})

// we're filling in the storeForm with some data
// for a new store programatically so we don't 
// have to fill in the form every time we test
// the functionality
fillIn(storeForm, {
  name: "BooksRUs",
  location: "LaLaLand",
  number: "555-555-5555",
  address: "555 Shangri-La",
  hours: "Monday - Friday 9am - 6pm"
})



