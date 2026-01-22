'use client';

import React from 'react';

export type TestimonialBlockProps = {
  title: string;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }>;
};

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  title,
  testimonials,
}) => {
  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">{title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const testimonialBlockConfig = {
  type: 'testimonial',
  name: 'Testimonials',
  category: 'content',
  defaultProps: {
    title: 'What People Say',
    testimonials: [
      {
        quote: 'This product changed my life. Highly recommended!',
        author: 'John Smith',
        role: 'CEO, Company Inc.',
      },
      {
        quote: 'Amazing service and support. Could not be happier.',
        author: 'Sarah Johnson',
        role: 'Marketing Director',
      },
      {
        quote: 'The best decision we made this year.',
        author: 'Michael Chen',
        role: 'Founder, Startup XYZ',
      },
    ],
  },
  propsSchema: {
    title: { type: 'text', label: 'Title' },
    testimonials: { type: 'array', label: 'Testimonials' },
  },
};
