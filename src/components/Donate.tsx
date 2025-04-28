import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import AnimatedElement from '@/components/AnimatedElement';
import Card, { CardContent, CardTitle } from '@/components/Card';
import { Heart, Gift, Star, HandHeart } from 'lucide-react';
import { MdGpsFixed } from 'react-icons/md';

const openDonationPopup = async (amountInRupees: number, userData: any) => {
  try {
    // 🔥 Call your Node.js backend to create a Razorpay order
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInRupees * 100, // Amount in paise
      }),
    });

    const data = await response.json();

    if (!data.orderId) {
      throw new Error('Order ID not found');
    }

    const options = {
      key: "YOUR_RAZORPAY_PUBLIC_KEY", // public key (safe)
      amount: data.amount, // amount in paise
      currency: "INR",
      name: "ShashCode",
      description: "Donation",
      order_id: data.orderId,
      handler: async function (response: any) {
        // 🔥 Step 3: Verify Payment on backend
        const verifyResponse = await fetch('http://localhost:5000/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.status === 'ok') {
          alert('🎉 Payment Successful and Verified!');
        } else {
          alert('❌ Payment Verification Failed!');
        }
      },
      prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.contact,
      },
      notes: {
        address: "ShashCode HQ",
      },
      theme: {
        color: "#F37254",
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Something went wrong. Please try again.');
  }
};

const Donate = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact: '',
    amount: 0,
    countryCode: '+91', // Default country code (India)
  });

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | string | null>(null); // Allow string for custom amount
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contact: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update the userData state
    setUserData({
      ...userData,
      [name]: value,
    });

    // Remove errors when the input is corrected
    const validationErrors = { ...errors };

    // Validate Name
    if (name === 'name' && value) {
      delete validationErrors.name;
    }

    // Validate Email
    if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailRegex.test(value)) {
        delete validationErrors.email;
      }
    }

    // Validate Contact (Mobile Number)
    if (name === 'contact') {
      const contactRegex = /^[0-9]{10}$/;
      if (contactRegex.test(value)) {
        delete validationErrors.contact;
      }
    }

    // Update errors state
    setErrors(validationErrors);
  };


  const handleAmountChange = (amount: number | string | null) => {
    setSelectedAmount(amount);
    setShowPopup(true);
  };

  const handleSubmit = () => {
    // Validate form fields
    const validationErrors: any = {};

    // Validate Name
    if (!userData.name) {
      validationErrors.name = 'Name is required';
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    // Validate Contact (Mobile Number)
    const contactRegex = /^[0-9]{10}$/; // 10 digits mobile number
    if (!contactRegex.test(userData.contact)) {
      validationErrors.contact = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop form submission if there are validation errors
    }

    // Proceed with donation if no errors
    if (selectedAmount !== null && selectedAmount !== 'custom') {
      const amountToProcess = typeof selectedAmount === 'string' ? parseInt(selectedAmount, 10) : selectedAmount;
      openDonationPopup(amountToProcess, userData);
      setShowPopup(false);
    } else if (selectedAmount === 'custom' && userData.amount > 0) {
      openDonationPopup(userData.amount, userData);
      setShowPopup(false);
    } else {
      alert('Please select a valid amount');
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedElement animation="fadeIn">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Support <span className="text-gradient">ShashCode</span>
            </h1>
          </AnimatedElement>

          <AnimatedElement animation="fadeIn" delay="100">
            <p className="text-lg text-black-300 mb-8 max-w-3xl mx-auto">
              Help us create more free coding resources, tutorials, and learning sheets by supporting ShashCode. Every contribution, big or small, fuels our mission!
            </p>
          </AnimatedElement>

          <AnimatedElement animation="fadeIn" delay="200">
            <button
              onClick={() => {
                const section = document.getElementById('donation-tiers');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-primary inline-flex items-center gap-2 justify-center"
            >
              View Donation Tiers
              <Heart size={18} />
            </button>
          </AnimatedElement>
        </div>
      </section>

      {/* Donation Tiers */}
      <Section
        id="donation-tiers"
        title="Donation Tiers"
        subtitle="Choose a way to support ShashCode 🚀"
        contentClassName="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
        gradient
      >
        {[{
          icon: <HandHeart className="h-10 w-10 text-primary" />,
          title: "Supporter",
          amount: "50",
          description: "A small token of love! Thank you for believing in our mission.",
        }, {
          icon: <Gift className="h-10 w-10 text-primary" />,
          title: "Choose Your Amount",
          amount: 'custom',
          description: "Enter the amount you would like to contribute.",
        }, {
          icon: <Star className="h-10 w-10 text-primary" />,
          title: "Champion",
          amount: "500",
          description: "You're a true champion! Your support makes a huge difference.",
        }].map((tier, index) => (
          <AnimatedElement key={index} animation="fadeIn" delay={`${(index + 1) * 100}` as any}>
            <Card hover className="h-full text-center p-6">
              <CardContent className="flex flex-col items-center gap-4">
                {tier.icon}
                <CardTitle>{tier.title}</CardTitle>
                <p className="text-gray-600">{tier.description}</p>
                <p className="text-2xl font-bold text-primary">{tier.amount === 'custom' ? 'Enter Amount' : `₹${tier.amount}`}</p>
                <button
                  className="bg-primary text-white font-semibold px-6 py-2 rounded-xl hover:bg-primary/90 transition duration-300 mt-4"
                  onClick={() => handleAmountChange(tier.amount)}
                >
                  {tier.amount === 'custom' ? 'Choose Amount' : 'Donate Now'}
                </button>
              </CardContent>
            </Card>
          </AnimatedElement>
        ))}
      </Section>

      {/* Popup for Custom Amount and User Details */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Enter Your Details</h2>
            {selectedAmount === 'custom' && (
              <div className="mb-4">
                <label htmlFor="amount" className="block">Enter Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="input-field"
                  onChange={(e) => setUserData({ ...userData, amount: parseInt(e.target.value) })}
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="name" className="block">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="input-field w-full md:w-[90%] lg:w-[80%] mx-auto" // Adjust width for better expansion
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="input-field w-full md:w-[90%] lg:w-[80%] mx-auto"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4 flex items-center">
              <select
                name="countryCode"
                value={userData.countryCode}
                onChange={handleInputChange}
                className="input-field w-1/3 lg:w-[20%]"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                {/* Add more country codes here */}
              </select>
              <input
                type="tel"
                name="contact"
                value={userData.contact}
                onChange={handleInputChange}
                className="input-field w-2/3 lg:w-[60%] ml-2"
                placeholder="Mobile Number"
                required
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                className="bg-primary text-white px-6 py-2 rounded-xl"
                onClick={handleSubmit}
                disabled={!!Object.keys(errors).length} // Disable if there are errors
              >
                Donate
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Donate;


// Need fixes for below
// 1. country code box is collapsed only + is visible instead of +91
// 2. validation for email and contacted to be fixed 
// 3. Contact heading is missing