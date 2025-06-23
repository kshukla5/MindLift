import React from 'react';
import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Your Account</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Jane Doe"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="********"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm" className="block mb-1">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="********"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block mb-1">Role</label>
            <select
              id="role"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select role</option>
              <option value="learner">Learner</option>
              <option value="speaker">Speaker</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" required className="form-checkbox text-teal-500 mr-2" />
              <span className="text-sm">
                I agree to the{' '}
                <a href="#" className="text-teal-400 hover:underline">Terms &amp; Conditions</a>
              </span>
            </label>
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
