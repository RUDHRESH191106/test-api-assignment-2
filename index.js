const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json()); 


let books = [
  { book_id: "101", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", year: 1925, copies: 5 },
  { book_id: "102", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", year: 1960, copies: 3 }
];

// **1. Create a New Book (C)**
app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;


  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json({ error: "All fields (book_id, title, author, genre, year, copies) are required." });
  }
  if (typeof year !== 'number' || typeof copies !== 'number') {
    return res.status(400).json({ error: "Year and copies must be numbers." });
  }

  
  if (books.some(book => book.book_id === book_id)) {
    return res.status(400).json({ error: "Book with this ID already exists." });
  }

  const newBook = { book_id, title, author, genre, year, copies };
  books.push(newBook);
  res.status(201).json(newBook);
});

// **2. Retrieve All Books (R)**
app.get('/books', (req, res) => {
  res.json(books);
});

// **3. Retrieve a Specific Book by ID (R)**
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const book = books.find(b => b.book_id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }
  res.json(book);
});

// 4. Update Book Information (U)
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, genre, year, copies } = req.body;
  const bookIndex = books.findIndex(b => b.book_id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found." });
  }

  if (title) books[bookIndex].title = title;
  if (author) books[bookIndex].author = author;
  if (genre) books[bookIndex].genre = genre;
  if (year) {
    if (typeof year !== 'number') return res.status(400).json({ error: "Year must be a number." });
    books[bookIndex].year = year;
  }
  if (copies) {
    if (typeof copies !== 'number') return res.status(400).json({ error: "Copies must be a number." });
    books[bookIndex].copies = copies;
  }

  res.json(books[bookIndex]);
});

// **5. Delete a Book (D)**
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex(b => b.book_id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found." });
  }

  books.splice(bookIndex, 1);
  res.json({ message: "Book deleted successfully." });
});
// **Start the Server**
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
