import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

const Signup = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNumber,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Signup failed');
      }

      // Store the token in localStorage (assuming backend returns a token; adjust if it doesn’t)
      localStorage.setItem('token', data.token || '');
      localStorage.setItem('user', JSON.stringify({ rollNumber, email }));

      navigate('/user');
    } catch (err) {
      alert('Signup failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6">
        {/* Header with Logo and Title */}
        <div className="text-center">
          <img
            src="https://pbs.twimg.com/profile_images/979349616708718592/Lm73dsE__400x400.jpg"
            alt="CMRCET Logo"
            className="mx-auto w-20 h-20 mb-3"
          />
          <h1 className="text-xl font-bold text-gray-700">
            CMRCET Exam Branch
          </h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="flex items-center justify-center text-purple-600 text-3xl font-bold">
            <FaUserPlus className="mr-2" />
            Sign Up
          </div>

          <input
            type="text"
            placeholder="Roll Number"
            required
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;