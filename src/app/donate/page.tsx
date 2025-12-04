'use client'

import { motion } from 'framer-motion'
import { Heart, CreditCard, Building, Smartphone } from 'lucide-react'

const donationOptions = [
  { amount: 25, label: '$25' },
  { amount: 50, label: '$50' },
  { amount: 100, label: '$100' },
  { amount: 250, label: '$250' },
]

export default function DonatePage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Heart className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Give</h1>
            <p className="text-xl text-gray-600">
              Your generosity helps us spread the Gospel, serve our community, and support those in need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Make a Donation</h2>
              
              {/* Quick Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {donationOptions.map((option) => (
                    <button
                      key={option.amount}
                      className="py-4 px-6 border-2 border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all duration-300 font-semibold text-gray-900"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Or Enter Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    id="custom-amount"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Frequency
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 px-6 border-2 border-primary-600 bg-primary-600 text-white rounded-lg font-semibold">
                    One-Time
                  </button>
                  <button className="py-3 px-6 border-2 border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all duration-300 font-semibold text-gray-900">
                    Monthly
                  </button>
                </div>
              </div>

              {/* Designation */}
              <div className="mb-6">
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation (Optional)
                </label>
                <select
                  id="designation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="general">General Fund</option>
                  <option value="missions">Missions</option>
                  <option value="building">Building Fund</option>
                  <option value="youth">Youth Ministry</option>
                  <option value="outreach">Community Outreach</option>
                </select>
              </div>

              {/* Submit Button */}
              <button className="w-full btn-primary text-lg py-4">
                Continue to Payment
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Secure payment processing powered by Stripe
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Other Ways to Give</h2>
            <p className="section-subtitle">
              Choose the method that works best for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 text-center shadow-lg"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mail a Check</h3>
              <p className="text-gray-600 mb-4">
                Make checks payable to ImageWord Ministries and mail to:
              </p>
              <p className="text-sm text-gray-700 font-medium">
                123 Church Street<br />
                City, State 12345
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 text-center shadow-lg"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bank Transfer</h3>
              <p className="text-gray-600 mb-4">
                Set up a direct bank transfer or ACH payment
              </p>
              <button className="text-primary-600 font-medium hover:text-primary-700">
                Get Bank Details →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-8 text-center shadow-lg"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Text to Give</h3>
              <p className="text-gray-600 mb-4">
                Text GIVE to
              </p>
              <p className="text-2xl font-bold text-primary-600">
                (123) 456-7890
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Your Impact</h2>
            <p className="text-xl text-primary-100">
              Every gift makes a difference. Your generosity supports our ministries, 
              helps those in need, and spreads the message of hope and love throughout our community and beyond.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
