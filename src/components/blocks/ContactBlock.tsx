'use client';

import React from 'react';

export type ContactBlockProps = {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  showForm?: boolean;
};

export const ContactBlock: React.FC<ContactBlockProps> = ({
  title,
  subtitle,
  email,
  phone,
  address,
  showForm = true,
}) => {
  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">{title}</h2>
          <p className="text-xl text-gray-600 animate-fade-in animation-delay-200">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in animation-delay-400">
            <div className="flex items-start gap-4">
              <div className="text-2xl">📧</div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                  {email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
                  {phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">📍</div>
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-gray-600">{address}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {showForm && (
            <div className="animate-fade-in animation-delay-600">
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const contactBlockConfig = {
  type: 'contact',
  name: 'Contact Section',
  category: 'content',
  defaultProps: {
    title: 'Get in Touch',
    subtitle: 'We would love to hear from you',
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    showForm: true,
  },
  propsSchema: {
    title: { type: 'text', label: 'Title' },
    subtitle: { type: 'text', label: 'Subtitle' },
    email: { type: 'text', label: 'Email' },
    phone: { type: 'text', label: 'Phone' },
    address: { type: 'text', label: 'Address' },
    showForm: { type: 'boolean', label: 'Show Contact Form' },
  },
};
