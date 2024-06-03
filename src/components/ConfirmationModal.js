import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <div className={`${styles.modal} ${isOpen ? styles.modal_open : ''}`}>
      <div className={styles.modal_content}>
        <p className={styles.message}>{message}</p>
        <div className={styles.button_container}>
          <button className={styles.delete_button} onClick={onConfirm}>
           Confirm Delete
          </button>
          <button className={styles.cancel_button} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;