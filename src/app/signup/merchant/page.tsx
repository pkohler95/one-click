const MerchantSignUp = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <h2>Merchant Sign Up</h2>
      <form>
        <label>Business Name</label>
        <input type="text" name="businessName" required />

        <label>Business Address</label>
        <input type="text" name="businessAddress" required />

        {/* Add other merchant-specific fields */}

        <button type="submit">Complete Sign Up</button>
      </form>
    </div>
  );
};

export default MerchantSignUp;
