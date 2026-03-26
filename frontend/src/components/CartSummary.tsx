import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  currentPage: number;
  currentCategory: string;
}

function CartSummary({ currentPage, currentCategory }: CartSummaryProps) {
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  /* Shows the Cart Summary on the Booklist Page */
  return (
    <div className="alert alert-secondary d-flex justify-content-between align-items-center">
      <span>
        {cartCount === 0 ? (
          '🛒 Your cart is empty'
        ) : (
          <>
            🛒 <strong>{cartCount}</strong> {cartCount === 1 ? 'item' : 'items'}{' '}
            in your cart &mdash; Total: <strong>${cartTotal.toFixed(2)}</strong>
          </>
        )}
      </span>
      <button
        className="btn btn-primary btn-sm position-relative"
        onClick={() =>
          void navigate('/cart', {
            state: { returnPage: currentPage, returnCategory: currentCategory },
          })
        }
      >
        View Cart
        {cartCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default CartSummary;
