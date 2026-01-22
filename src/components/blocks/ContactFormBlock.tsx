'use client';

import React, { useState } from 'react';

export type ContactFormBlockProps = {
  title: string;
  description: string;
  buttonText: string;
  backgroundColor?: string;
};

export const ContactFormBlock: React.FC<ContactFormBlockProps> = ({
  title,
  description,
  buttonText,
  backgroundColor = '#ffffff',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
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
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export const contactFormBlockConfig = {
  type: 'contact-form',
  name: 'Contact Form',
  category: 'components',
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZjI5MzciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbnRhY3QgRm9ybTwvdGV4dD48cmVjdCB4PSI0MCIgeT0iNDUiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI0MCIgeT0iNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI0MCIgeT0iOTUiIHdpZHRoPSIyNDAiIGhlaWdodD0iMzUiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI5MCIgeT0iMTQwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjI1IiByeD0iNiIgZmlsbD0iIzNiODJmNiIvPjwvc3ZnPg==',
  defaultProps: {
    title: 'Get In Touch',
    description: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    buttonText: 'Send Message',
    backgroundColor: '#ffffff',
  },
  propsSchema: {
    title: { type: 'text', label: 'Title' },
    description: { type: 'text', label: 'Description' },
    buttonText: { type: 'text', label: 'Button Text' },
    backgroundColor: { type: 'color', label: 'Background Color' },
  },
};
