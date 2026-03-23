import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from 'backend/config';
import { ToastContext } from '../../contextStore/ToastContext';
import ConfirmModal from './ConfirmModal';
import './AdActions.css';

function AdActions({ product, isOwner, onSold, onFeaturedRequest }) {
  const history = useHistory();
  const { addToast } = React.useContext(ToastContext) || {};
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  if (!isOwner || !product) return null;

  const handleDelete = async () => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (error) {
      addToast?.('Failed to delete ad. Try again.', 'error');
    } else {
      setShowDeleteModal(false);
      history.push('/dashboard');
    }
  };

  const handleMarkSold = async () => {
    const { error } = await supabase
      .from('products')
      .update({ status: 'sold', sold_at: new Date().toISOString() })
      .eq('id', product.id);

    if (error) {
      addToast?.('Failed to mark as sold. Try again.', 'error');
    } else {
      setShowSoldModal(false);
      addToast?.('Ad marked as sold!', 'success');
      if (onSold) onSold();
    }
  };

  const handleRequestFeatured = async () => {
    if (!product?.id) return;
    setFeaturedLoading(true);
    const { error } = await supabase
      .from('products')
      .update({ is_featured: true, updated_at: new Date().toISOString() })
      .eq('id', product.id);

    setFeaturedLoading(false);
    if (error) {
      addToast?.('Failed to request featured. Try again.', 'error');
    } else {
      addToast?.('Featured request submitted!', 'success');
      if (onFeaturedRequest) onFeaturedRequest();
    }
  };

  const isSold = product.status === 'sold';
  const isApproved = product.is_featured === true;

  return (
    <>
      {/* Featured Request Section */}
      <div className="featuredRequestSection">
        <h4 className="featuredRequestTitle">Featured Ad</h4>
        {!isSold && !isApproved && (
          <div className="featuredRequestBox">
            <p className="featuredRequestDesc">
              Make your ad stand out! Request to feature your ad and get more visibility.
            </p>
            <button
              type="button"
              className="adActionBtn featured"
              onClick={handleRequestFeatured}
              disabled={featuredLoading}
            >
              {featuredLoading ? 'Requesting...' : 'Request Featured'}
            </button>
          </div>
        )}
        {isApproved && (
          <div className="featuredRequestBox featuredRequestBox--approved">
            <span className="featuredRequestIcon">&#9733;</span>
            <div>
              <p className="featuredRequestStatus">Your Ad is Featured!</p>
              <p className="featuredRequestHint">Your ad is getting extra visibility.</p>
            </div>
          </div>
        )}
      </div>

      <div className="adActions">
        <button
          type="button"
          className="adActionBtn edit"
          onClick={() => history.push(`/ad/${product.id}/edit`)}
        >
          Edit
        </button>
        {!isSold && (
          <button
            type="button"
            className="adActionBtn sold"
            onClick={() => setShowSoldModal(true)}
          >
            Mark as Sold
          </button>
        )}
        <button
          type="button"
          className="adActionBtn delete"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete ad?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      <ConfirmModal
        isOpen={showSoldModal}
        title="Mark as sold?"
        message="Your ad will be marked as sold and remain visible."
        confirmLabel="Mark sold"
        cancelLabel="Cancel"
        onConfirm={handleMarkSold}
        onCancel={() => setShowSoldModal(false)}
      />
    </>
  );
}

export default AdActions;
