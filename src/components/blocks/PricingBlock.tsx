'use client';

import React from 'react';

export type PricingBlockProps = {
  title: string;
  subtitle: string;
  plans: Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
    highlighted?: boolean;
  }>;
};

export const PricingBlock: React.FC<PricingBlockProps> = ({
  title,
  subtitle,
  plans,
}) => {
  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">{title}</h2>
          <p className="text-xl text-gray-600 animate-fade-in animation-delay-200">{subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-lg border-2 transition-all duration-300 animate-fade-in ${
                plan.highlighted
                  ? 'border-blue-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.highlighted && (
                <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const pricingBlockConfig = {
  type: 'pricing',
  name: 'Pricing Table',
  category: 'marketing',
  defaultProps: {
    title: 'Simple Pricing',
    subtitle: 'Choose the plan that fits your needs',
    plans: [
      {
        name: 'Basic',
        price: '$9',
        period: 'month',
        features: ['Up to 10 users', 'Basic support', '5GB storage'],
      },
      {
        name: 'Pro',
        price: '$29',
        period: 'month',
        features: ['Up to 50 users', 'Priority support', '50GB storage', 'Advanced analytics'],
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: '$99',
        period: 'month',
        features: ['Unlimited users', '24/7 support', 'Unlimited storage', 'Custom integrations'],
      },
    ],
  },
  propsSchema: {
    title: { type: 'text', label: 'Title' },
    subtitle: { type: 'text', label: 'Subtitle' },
    plans: { type: 'array', label: 'Pricing Plans' },
  },
};
