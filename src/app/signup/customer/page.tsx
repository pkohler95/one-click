const CustomerSignUp = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-black">Customer Sign Up</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-black font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
          >
            Complete Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignUp;
