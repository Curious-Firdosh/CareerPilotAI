import React from 'react';
import '../styles/PricingCards.scss';

const pricingData = [
  {
    id: 1,
    tier: 'Starter',
    price: '90',
    credits: '30',
    description: 'Perfect for preparing for a few specific job roles.',
    features: [
      '30 Credits (Up to 6 full analyses)', 
      'Deep Resume & JD Matching', 
      'Technical & Behavioral Questions', 
      'Skill Gap Identification',
      'High-quality PDF Export'
    ],
    isPopular: false,
  },
  {
    id: 2,
    tier: 'Pro',
    price: '200',
    credits: '75',
    description: 'Ideal for active job seekers applying to multiple companies.',
    features: [
      '75 Credits (Up to 15 full analyses)', 
      'Deep Resume & JD Matching', 
      'Personalized Learning Roadmap', 
      'Advanced Interview Questions', 
      'Priority PDF Export generation'
    ],
    isPopular: true,
  },
  {
    id: 3,
    tier: 'Elite',
    price: '500',
    credits: '200',
    description: 'For career coaches or heavy job hunters.',
    features: [
      '200 Credits (Up to 40 full analyses)', 
      'Everything in Pro', 
      'Unlimited Revision Roadmaps', 
      'Store past analyses', 
      'Dedicated email support'
    ],
    isPopular: false,
  },
];

const PricingCards = () => {
  return (
    <div className="pricing-section">
      <div className="pricing-header">
        <h2>Supercharge Your Job Hunt</h2>
        <p>1 Full Analysis + PDF Report costs exactly 5 Credits. No hidden fees.</p>
      </div>

      <div className="pricing-container">
        {pricingData.map((plan) => (
          <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`} key={plan.id}>
            {plan.isPopular && <div className="badge">Most Popular</div>}
            
            <div className="card-header">
              <h3 className="tier-name">{plan.tier}</h3>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
              </div>
              <p className="credits-highlight">{plan.credits} Credits</p>
              <p className="description">{plan.description}</p>
            </div>

            <ul className="feature-list">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="cta-button">
              {plan.isPopular ? 'Get Started' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCards;