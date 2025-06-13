import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate, Link } from 'react-router-dom';
import './LandingPage.css';
import { FaCertificate, FaCalendarCheck, FaUserShield } from 'react-icons/fa';
import logo from "/ceer.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const newsItems = [
    'Slot booking for semester certificate issuance opens on May 1, 2025.',
    'New slots added for degree certificate applications at CMRCET.',
    'Deadline to upload proof documents for bookings: April 30, 2025.',
    'CMRCET office closed for holidays on May 5, 2025; no bookings available.',
    'System upgrade: Now supports digital signatures for faster approvals.',
  ];

  const handleCTAClick = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      scalar: 1.5,
      startVelocity: 45,
      origin: { y: 0.5 },
    });
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="https://pbs.twimg.com/profile_images/979349616708718592/Lm73dsE__400x400.jpg"
              alt="CMRCET Logo"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold">Slotify</h1>
          </div>
          <nav>
            <ul className="flex space-x-4 text-lg">
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/signup" className="hover:underline">Signup</Link></li>
            </ul>
          </nav>
          <img src={logo} alt="CMRCET Logo" className="w-12 h-12 object-contain" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 bg-hero-pattern bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center space-x-4 mb-6">
            <img
              src="https://img.icons8.com/color/48/000000/certificate.png"
              alt="Certificate Icon"
              className="w-12 h-12 animate certificate-spin"
            />
            <img
              src="https://img.icons8.com/color/48/000000/certificate.png"
              alt="Certificate Icon"
              className="w-12 h-12 animate certificate-spin-delayed"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Book Your Certificate Slot Instantly</h2>
          <p className="text-lg md:text-xl mb-8">Secure your appointment in seconds and avoid long queues!</p>
          <button
            onClick={handleCTAClick}
            className="bg-yellow-400 text-blue-900 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition shadow-lg"
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-12 text-gray-800">Why Choose Slotify?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-xl transition">
              <FaCertificate size={40} className="mx-auto text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Digital Certificates</h4>
              <p>Get your academic certificates faster with secure digital signing.</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-xl transition">
              <FaCalendarCheck size={40} className="mx-auto text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Flexible Scheduling</h4>
              <p>Choose your preferred slot at your convenience. No wait times!</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-xl transition">
              <FaUserShield size={40} className="mx-auto text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Verified Access</h4>
              <p>Only authorized users can access and manage certificate data.</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Scrolling News Section */}
      <section id="news" className="py-12 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-6">Latest College Updates</h3>
          <div className="news-marquee bg-white p-4 rounded-lg shadow-md overflow-hidden">
            <div className="news-content">
              {newsItems.concat(newsItems).map((item, index) => (
                <span key={index} className="text-gray-700 text-base md:text-lg mx-4">
                  • {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-3 text-lg">Contact us at <a href="mailto:support@slotbooking.com" className="underline">support@slotbooking.com</a></p>
          <p className="text-sm">© 2025 Slot Booking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;