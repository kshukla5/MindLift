import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Log In to MindLift</h2>
        <form>
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
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-teal-500 mr-2" />
              <span className="text-sm">Remember me</span>
            </label>
            <a href="#" className="text-sm text-teal-400 hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg">
            Log In
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-teal-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
