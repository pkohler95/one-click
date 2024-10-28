import React, { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import Tooltip from '@/components/shared/Tooltip';

interface MerchantFormProps {
  storeName: string;
  lnurl: string;
  oneClickDiscount: number;
  onFormChange: (profileData: any) => void; // Prop to send data to parent
}

const MerchantForm: React.FC<MerchantFormProps> = ({
  storeName,
  lnurl,
  oneClickDiscount,
  onFormChange,
}) => {
  const [formData, setFormData] = useState({
    storeName,
    lnurl,
    oneClickDiscount,
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

        {/* Tooltip wrapped around the OneClick discount label */}
        <Tooltip text="The discount your customers receive when they checkout with OneClick. 2% recommended in order to be competitive with credit card rewards">
          <Input
            label="OneClick discount percentage"
            name="oneClickDiscount"
            value={formData.oneClickDiscount}
            placeholder="Enter OneClick discount"
            onChange={handleChange}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default MerchantForm;
