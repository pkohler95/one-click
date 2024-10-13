import React, { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';

interface MerchantFormProps {
  storeName: string;
  lnurl: string;
  onFormChange: (profileData: any) => void; // Prop to send data to parent
}

const MerchantForm: React.FC<MerchantFormProps> = ({
  storeName,
  lnurl,
  onFormChange,
}) => {
  const [formData, setFormData] = useState({
    storeName,
    lnurl,
  });

  useEffect(() => {
    onFormChange(formData); // Notify the parent of any form data changes
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Store name"
          name="storeName"
          value={formData.storeName}
          placeholder="Enter store name"
          onChange={handleChange}
        />
        <Input
          label="lnurl"
          name="lnurl"
          value={formData.lnurl}
          placeholder="Enter lnurl"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default MerchantForm;
