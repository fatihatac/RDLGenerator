import { useState } from 'react';

/**
 * Custom hook for managing multiple modal states
 * Returns an object with individual modal states and their setters
 * plus helper functions to open/close specific modals or all modals
 */
function useModalState(initialModals = {}) {
  const [modals, setModals] = useState(initialModals);

  // Open a specific modal
  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  // Close a specific modal
  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  // Toggle a specific modal
  const toggleModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
  };

  // Close all modals
  const closeAllModals = () => {
    setModals(Object.keys(modals).reduce((acc, key) => ({
      ...acc,
      [key]: false
    }), {}));
  };

  // Check if any modal is open
  const isAnyModalOpen = Object.values(modals).some(isOpen => isOpen);

  return {
    modals,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    isAnyModalOpen
  };
}

export default useModalState;