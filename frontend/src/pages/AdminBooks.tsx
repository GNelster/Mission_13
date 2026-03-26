import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';

const emptyBook: Omit<Book, 'bookId'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState(emptyBook);

  const API = 'https://localhost:5000/Bookstore';

  // Load up all books
  const fetchBooks = () => {
    fetch(`${API}/Books?pageNum=1&pageSize=1000&sortBy=title&category`) // Get all books for admin
      .then((res) => res.json())
      .then((data) => setBooks(data.books));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleAdd = () => {
    setEditingBook(null);
    setFormData(emptyBook);
    setShowForm(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    fetch(`${API}/Books/${id}`, { method: 'DELETE' }).then(() => fetchBooks());
  };

  const handleSubmit = () => {
    if (editingBook) {
      // Update Existing
      fetch(`${API}/Books/${editingBook.bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, bookId: editingBook.bookId }),
      }).then(() => {
        fetchBooks();
        setShowForm(false);
      });
    } else {
      // Add new
      fetch(`${API}/Books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).then(() => {
        fetchBooks();
        setShowForm(false);
      });
    }
  };

  return (
    <div className="container mt-4">
      <h3>Admin –– Manage Books</h3>
      <button className="btn btn-success mb-3" onClick={handleAdd}>
        + Add New Book
      </button>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="card p-3 mb-4">
          <h5>{editingBook ? 'Edit Book' : 'Add New Book'}</h5>
          <div className="row g-2">
            {(
              [
                'title',
                'author',
                'publisher',
                'isbn',
                'classification',
                'category',
                'pageCount',
                'price',
              ] as (keyof typeof formData)[]
            ).map((field) => (
              <div className="col-md-3" key={field}>
                <label className="form-label text-capitalize">{field}</label>
                <input
                  className="form-control"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  type={
                    field === 'pageCount' || field === 'price'
                      ? 'number'
                      : 'text'
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingBook ? 'Save Changes' : 'Add Book'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Book Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(book.bookId)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBooks;
