const inputbook = document.getElementById('inputbook');
const allbook = document.querySelector('.allbook');
const Listbtn = document.getElementById('Listbtn');
const gridbtn = document.getElementById('gridbtn');
const sortbtn = document.getElementById('sortbtn');
const searchinputbook = document.getElementById('searchinputbook');
const topselling = document.querySelector('.topselling');

let booksData = [];  // Declare this globally to store the books data

async function fetchData() {
    const url = 'https://api.freeapi.app/api/v1/public/books?page=1&limit=20&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech';
    const options = {method: 'GET', headers: {accept: 'application/json'}};

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    booksData = data.data.data;  // Save the fetched data in booksData
    console.log(booksData);
    Displaybooks(booksData);  // Display all books initially
  } catch (error) {
    console.error(error);  
  }
}

function Displaybooks(booksData) {
  allbook.innerHTML = '';  // Clear the current books displayed

  booksData.forEach(book => {
    let bookname = book.volumeInfo.title || "Not Available";
    let publisher = book.volumeInfo.publisher || "Not Available";
    let bookimg = book.volumeInfo.imageLinks.smallThumbnail || "Not Available";
    let author = book.volumeInfo.authors || "Not Available";
    let publishdate = book.volumeInfo.publishedDate || "Not Available";
    let bookperview = book.volumeInfo.previewLink

    createBook(bookimg, bookname, author, publisher, publishdate , bookperview);
  });
}

function createBook(bookimg, bookname, author, publisher, publishdate, bookperview) {
    // Create the main book div element
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');
  
    // Create the anchor tag to wrap around the image
    const a = document.createElement('a');
    a.href = bookperview; // Set the href to the book's preview link
    a.target = '_blank';   // Optional: Open the link in a new tab
  
    // Create the image element
    const img = document.createElement('img');
    img.src = bookimg; // Set the image source
    img.alt = 'Book Cover'; // Set alt text for accessibility
  
    // Create the div for book details (like name, author, publisher, etc.)
    const bookDetailDiv = document.createElement('div');
    bookDetailDiv.classList.add('bookdetail');
  
    // Create the book name paragraph
    const bookNameP = document.createElement('p');
    bookNameP.classList.add('bookname');
    bookNameP.textContent = bookname;
  
    // Create the author name paragraph
    const authorNameP = document.createElement('p');
    authorNameP.classList.add('authorname');
    authorNameP.textContent = author;
  
    // Create the div for publisher and publish date
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
  
    // Create the publisher paragraph
    const publisherP = document.createElement('p');
    publisherP.textContent = publisher;
  
    // Create the publish date paragraph
    const publishDateP = document.createElement('p');
    publishDateP.textContent = publishdate;
  
    // Append publisher and publish date to the date div
    dateDiv.appendChild(publisherP);
    dateDiv.appendChild(publishDateP);
  
    // Append all the details to the book detail div
    bookDetailDiv.appendChild(bookNameP);
    bookDetailDiv.appendChild(authorNameP);
    bookDetailDiv.appendChild(dateDiv);
  
    // Append the image inside the anchor tag
    a.appendChild(img);
  
    // Append the anchor tag (with the image) and book details to the main book div
    bookDiv.appendChild(a);
    bookDiv.appendChild(bookDetailDiv);
  
    // Append the final book div to the container (e.g., .allbook)
    const allBooksContainer = document.querySelector('.allbook');
    allBooksContainer.appendChild(bookDiv);
  }

Listbtn.addEventListener('click', () => {
  allbook.classList.add("allbook-list");
});

gridbtn.addEventListener('click', () => {
  allbook.classList.remove("allbook-list");
});

let isAscending = true;  // Initial sorting order (ascending)

sortbtn.addEventListener('click', () => {
  // Get all the book divs
  const allBookNames = document.querySelectorAll(".bookname");
  
  // Convert NodeList to Array to use array methods like `sort`
  const booksArray = Array.from(allBookNames);

  // Sort the books based on their title
  booksArray.sort((a, b) => {
    const bookNameA = a.textContent.toLowerCase();
    const bookNameB = b.textContent.toLowerCase();

    // If ascending, compare normally
    if (isAscending) {
      if (bookNameA < bookNameB) return -1;
      if (bookNameA > bookNameB) return 1;
    } 
    // If descending, reverse the order
    else {
      if (bookNameA > bookNameB) return -1;
      if (bookNameA < bookNameB) return 1;
    }
    return 0;
  });

  // Get the container where books are displayed
  const allBooksContainer = document.querySelector('.allbook');
  
  // Reorder the books in the container based on the sorted order
  booksArray.forEach(bookNameElement => {
    const bookDiv = bookNameElement.closest('.book');
    allBooksContainer.appendChild(bookDiv); 
  });

  // Toggle the sorting order for the next click (asc/desc)
  isAscending = !isAscending;
});

// Implementing the search function
searchinputbook.addEventListener('input', () => {
    const searchTerm = searchinputbook.value.toLowerCase().trim(); // Get the search term and convert it to lowercase for case-insensitive matching
  
    // Filter the booksData based on the search term (title or author match)
      const filteredBooks = booksData.filter(book => {
      const bookName = book.volumeInfo.title.toLowerCase(); // Get the book title
      const authorName = book.volumeInfo.authors ? book.volumeInfo.authors[0].toLowerCase() : ""; // Get the first author's name if available
  
      // Return true if either the book name or author name includes the search term
      return bookName.includes(searchTerm) || authorName.includes(searchTerm);  
    });
  
    // Display only the filtered books
    Displaybooks(filteredBooks);
    if(allbook.innerHTML === ""){
        topselling.innerText = "Not Found"
    } else {
        topselling.innerText = "Top Selling"
    }
  });
  
fetchData();  // Initial data fetch to populate books
