import { useEffect, useState } from 'react';
import './App.css';
import './index.css';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [published_date, setPublishedDate] = useState("");
  const [author, setAuthor] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newDate, setNewDate] = useState("");


  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBook = async () => {
    const bookData = { title, author, published_date };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchBooks();
      setTitle("");
      setAuthor("");
      setPublishedDate("");

    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const updateBook = async (pk, title, author, published_date) => {
  const bookData = {
    title: title,
    author: author,
    published_date: published_date,
  };

  try {
    console.log("Updating book with:", pk, bookData); // Debug log

    const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      console.error("Server error:", await response.text());
      return;
    }

    const data = await response.json();

    setBooks(prevBooks =>
      prevBooks.map(book => (book.id === pk ? data : book))
    );

  } catch (error) {
    console.error("Error updating book:", error);
  }
};


  const deleteBook = async (pk) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "DELETE",
      });
      setBooks(prevBooks => prevBooks.filter(book => book.id !== pk));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    
  <div className="app-container">
    <h1 className="app-title">Book Website</h1>

    <div className="form-container">
      <input
        type="text"
        placeholder="Book Title.."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author.."
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="date"
        value={published_date}
        onChange={(e) => setPublishedDate(e.target.value)}
      />
      <button onClick={addBook}>Add Book</button>
    </div>

    <div className="book-list">
      {books.map((book) => (
        <div className="book-card" key={book.id}>
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Published Date:</strong> {book.published_date}</p>

          <input
            type="text"
            placeholder="New Title.."
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="New Author.."
            onChange={(e) => setNewAuthor(e.target.value)}
          />
          <input
            type="date"
            placeholder="New Date.."
            onChange={(e) => setNewDate(e.target.value)}
          />

          <button onClick={() => updateBook(book.id, newTitle, newAuthor, newDate)}>
            Update Book
          </button>
          <button onClick={() => deleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </div>
  </div>
);
}
export default App;
