import { useEffect, useRef } from 'react';
import { Offcanvas } from 'bootstrap';
import { useNavigate } from 'react-router-dom';

interface CartOffcanvasProps {
  show: boolean;
  bookTitle: string;
  onClose: () => void;
  currentPage: number;
  currentCategory: string;
}

/* Displays a slide-over confirmation that you added the book successfully, and doesn't mandate you visit your cart.*/
function CartOffcanvas({
  show,
  bookTitle,
  onClose,
  currentPage,
  currentCategory,
}: CartOffcanvasProps) {
  const offcanvasRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!offcanvasRef.current) return;
    const instance = Offcanvas.getOrCreateInstance(offcanvasRef.current);
    if (show) {
      instance.show();
    } else {
      instance.hide();
    }
  }, [show]);

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      ref={offcanvasRef}
      id="cartOffcanvas"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Added to Cart!</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        <p>
          <strong>{bookTitle}</strong> added to your cart.
        </p>
        <br />
        <div className="d-flex flex-column gap-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              void navigate('/cart', {
                state: {
                  returnPage: currentPage,
                  returnCategory: currentCategory,
                },
              });
            }}
          >
            View Cart
          </button>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Keep Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartOffcanvas;
