import React, { useState } from 'react';
import Button from '@/components/shared/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onFundsAdded: (newBalance: string) => void; // Add this prop to update the balance
}

const AddFundsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  userId,
  onFundsAdded,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage('Payment successful!');
        onFundsAdded(data.updatedBalance); // Pass the updated balance to the parent component
        onClose(); // Close the modal after a successful payment
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-pink-100 rounded-lg p-8 w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Add funds</h2>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2" htmlFor="amount">
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            placeholder="Enter amount"
          />
        </div>

        <div className="flex justify-center">
          <Button
            text={loading ? 'Processing...' : 'Add funds'}
            variant="primary"
            onClick={handlePayment}
            disabled={loading || amount <= 0} // Disable if loading or no valid amount
          />
        </div>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default AddFundsModal;
