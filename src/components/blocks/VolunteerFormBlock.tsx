'use client';

import React, { useState } from 'react';

export type VolunteerFormBlockProps = {
  title: string;
  description: string;
  buttonText: string;
  backgroundColor?: string;
};

export const VolunteerFormBlock: React.FC<VolunteerFormBlockProps> = ({
  title,
  description,
  buttonText,
  backgroundColor = '#ffffff',
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Volunteer form submitted:', formData);
    alert('Thank you for volunteering! We will be in touch soon.');
  };

  return (
    <div
      className="py-16 px-6"
      style={{ backgroundColor }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">{title}</h2>
        <p className="text-center text-gray-600 mb-8">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export const volunteerFormBlockConfig = {
  type: 'volunteer-form',
  name: 'Volunteer Form',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZjI5MzciIHRleHQtYW5jaG9yPSJtaWRkbGUiPlZvbHVudGVlciBGb3JtPC90ZXh0PjxyZWN0IHg9IjQwIiB5PSI0NSIgd2lkdGg9IjExMCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjE3MCIgeT0iNDUiIHdpZHRoPSIxMTAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI0MCIgeT0iNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI0MCIgeT0iOTUiIHdpZHRoPSIxMTAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI5MCIgeT0iMTI1IiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjI1IiByeD0iNiIgZmlsbD0iI2RjMjYyNiIvPjwvc3ZnPg==',
  defaultProps: {
    title: 'Join Our Team',
    description: 'Help us make a difference. Sign up to volunteer for our campaign.',
    buttonText: 'Sign Me Up',
    backgroundColor: '#ffffff',
  },
  propsSchema: {
    title: { type: 'text', label: 'Title' },
    description: { type: 'text', label: 'Description' },
    buttonText: { type: 'text', label: 'Button Text' },
    backgroundColor: { type: 'color', label: 'Background Color' },
  },
};
