import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import AddFundsModal from './AddFundsModal';

interface BankDetailsProps {
  bankName: string;
  accountType: string;
  last4: string;
  userId: string;
  updateBalance: (newBalance: string) => void; // Add this prop to update the balance
}

const BankDetails: React.FC<BankDetailsProps> = ({
  bankName,
  accountType,
  last4,
  userId,
  updateBalance, // Destructure updateBalance
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFundsAdded = (newBalance: string) => {
    // Close modal and update balance in the parent component
    updateBalance(newBalance);
    closeModal();
  };

  return (
    <div className="rounded-lg flex flex-col items-start">
      <h1 className="text-3xl font-bold mb-6 mt-12">Bank details</h1>

      <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center w-full max-w-lg">
        <div className="flex flex-col">
          <span className="text-xl font-semibold">{bankName}</span>
          <span className="text-md text-gray-600">{accountType}</span>
        </div>
        <div className="text-xl font-semibold text-gray-800">*{last4}</div>
      </div>

      {/* Primary Button */}
      <div className="mt-4 w-full">
        <Button
          text="Add funds"
          variant="primary"
          onClick={openModal} // Open the modal when clicked
        />
      </div>

      {/* Modal for adding funds */}
      <AddFundsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userId={userId}
        onFundsAdded={handleFundsAdded} // Handle funds added and trigger balance update
      />
    </div>
  );
};

export default BankDetails;
