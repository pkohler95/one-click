import React, { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';

interface AddressFormProps {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  onFormChange: (profileData: any) => void; // Prop to send data to parent
}

const AddressForm: React.FC<AddressFormProps> = ({
  firstName,
  lastName,
  address,
  address2,
  city,
  state,
  zipCode,
  phoneNumber,
  onFormChange,
}) => {
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    address,
    address2,
    city,
    state,
    zipCode,
    phoneNumber,
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
          label="First name"
          name="firstName"
          value={formData.firstName}
          placeholder="Enter your first name"
          onChange={handleChange}
        />
        <Input
          label="Last name"
          name="lastName"
          value={formData.lastName}
          placeholder="Enter your last name"
          onChange={handleChange}
        />

        <Input
          label="Address"
          name="address"
          value={formData.address}
          placeholder="Enter your address"
          onChange={handleChange}
        />
        <Input
          label="Apartment, suite, etc"
          name="address2"
          value={formData.address2}
          placeholder="Apartment, suite, etc"
          onChange={handleChange}
        />

        <Input
          label="City"
          name="city"
          value={formData.city}
          placeholder="Enter your city"
          onChange={handleChange}
        />
        <Input
          label="State"
          name="state"
          value={formData.state}
          placeholder="Enter your state"
          onChange={handleChange}
        />

        <Input
          label="Zip code"
          name="zipCode"
          value={formData.zipCode}
          placeholder="Enter your zip code"
          onChange={handleChange}
        />
        <Input
          label="Phone"
          name="phoneNumber"
          value={formData.phoneNumber}
          placeholder="Enter your phone number"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AddressForm;
