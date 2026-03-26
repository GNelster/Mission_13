import './App.css';
import BookList from './pages/BookList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import AdminBooks from './pages/AdminBooks';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
