import { useCart } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

function Cart() {
  const { cartItems, cartTotal, cartCount, removeFromCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const returnPage = location.state?.returnPage ?? 1;
  const returnCategory = location.state?.returnCategory ?? '';

  /* Shows the cart page, the remove button, and the Continue Shopping button*/
  return (
    <div className="container mt-4">
      <h1>Your Cart</h1>

      {cartCount === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item: CartItem) => (
              <tr key={item.book.bookId}>
                <td>{item.book.title}</td>
                <td>${item.book.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.book.bookId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-end fw-bold">
                Total
              </td>
              <td>${cartTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      )}

      <button
        className="btn btn-primary"
        onClick={() =>
          void navigate('/', { state: { returnPage, returnCategory } })
        }
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default Cart;
