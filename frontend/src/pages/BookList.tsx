import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CategoryFilter from '../components/CategoryFilter';
import CartSummary from '../components/CartSummary';
import Pagination from '../components/Pagination';
import CartOffcanvas from '../components/CartOffCanvas';

function BookList() {
  const { addToCart } = useCart();
  const location = useLocation();

  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNum, setPageNum] = useState(location.state?.returnPage ?? 1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState('title');
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.returnCategory ?? ''
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [offcanvasShow, setOffcanvasShow] = useState(false);
  const [addedBookTitle, setAddedBookTitle] = useState('');

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    fetch(
      `https://hiltons-runtime-reads-backend-cjgegacwa9cab8cg.northcentralus-01.azurewebsites.net/Bookstore/Books?pageNum=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}&category=${selectedCategory}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
      });
  }, [pageNum, pageSize, sortBy, selectedCategory]);

  useEffect(() => {
    fetch(
      'https://hiltons-runtime-reads-backend-cjgegacwa9cab8cg.northcentralus-01.azurewebsites.net/Bookstore/Categories'
    )
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <>
      <div className="container mt-4">
        <h3>Hilton's Runtime Reads</h3>
        <a href="/adminbooks" className="btn btn-sm btn-outline-secondary mb-2">
          Admin
        </a>

        {/* Cart Summary - Full Width Bar */}
        <CartSummary currentPage={pageNum} currentCategory={selectedCategory} />

        <div className="row mt-3">
          {/* Left Sidebar - Category Filter */}
          <div className="col-2">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setPageNum(1);
              }}
            />
          </div>

          {/* Main Content - Sort Controls + Book Table + Pagination */}
          <div className="col-10">
            <div className="d-flex gap-3 mb-3">
              <div>
                <label className="form-label">Sort By</label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPageNum(1);
                  }}
                >
                  <option value="bookId">Book ID</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div>
                <label className="form-label">Results Per Page</label>
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNum(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
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
                      <button
                        className="btn btn-primary text-nowrap"
                        onClick={() => {
                          addToCart(book);
                          setAddedBookTitle(book.title);
                          setOffcanvasShow(true);
                        }}
                      >
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <Pagination
              currentPage={pageNum}
              totalPages={totalPages}
              onPageChange={setPageNum}
            />
          </div>
        </div>
      </div>
      {/* Offcanvas Cart Summary */}
      <CartOffcanvas
        show={offcanvasShow}
        bookTitle={addedBookTitle}
        onClose={() => setOffcanvasShow(false)}
        currentPage={pageNum}
        currentCategory={selectedCategory}
      />
    </>
  );
}

export default BookList;
