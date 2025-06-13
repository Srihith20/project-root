import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,  // Assuming backend accepts email for login; adjust to rollNumber if needed
          password,
          label:"user"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      // Store token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        rollNumber: data.user.rollNumber,
        email: data.user.email,
        label: data.user.label,
      }));

      // Navigate based on user role
      if (data.user.label === 'admin') {
        navigate('/admin');
      } else if (data.user.label === 'user') {
        navigate('/user');
      } else {
        throw new Error('User role not recognized');
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6">
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
        <div className="flex items-center justify-center text-indigo-600 text-3xl font-bold">
          <FiLogIn className="mr-2" />
          Login
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 pt-2">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;