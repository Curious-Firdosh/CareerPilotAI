import React from 'react';
import LandingHeader from '../Components/LandingHeader'; // Adjust path as needed
import { BrainCircuit, Code2, Target, Sparkles, Star } from 'lucide-react';
import '../styles/landingHeader.scss';

const LandingPage = () => {
  return (
    <div className="premium-landing-page">
      <LandingHeader />

      {/* ── SPECIFICATIONS / FEATURES SECTION ── */}
      <section className="specs-section">
        <div className="section-header">
          <h2 className="gradient-text">Engineered for Excellence</h2>
          <p>We don't just ask generic questions. Our AI builds a comprehensive profile of your technical baseline and target role.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-wrapper"><BrainCircuit size={28} /></div>
            <h3>Contextual AI Generation</h3>
            <p>Our neural engine analyzes your resume against the job description to generate hyper-specific scenarios, skipping the boilerplate.</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper"><Code2 size={28} /></div>
            <h3>Enterprise-Grade Evaluation</h3>
            <p>Code isn't just checked for syntax. We evaluate architectural choices using industry standards, incorporating frameworks like McCall's and Boehm's software quality models to ensure robust system design.</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper"><Target size={28} /></div>
            <h3>Targeted Tech Stacks</h3>
            <p>Whether you are optimizing SQL queries or building out highly scalable MERN stack architectures, the interviewer adapts to your specific domain.</p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Trusted by Top Engineers</h2>
          <p>See how we are helping developers ace their technical rounds.</p>
        </div>

        <div className="testimonials-grid">
          {/* Testimonial 1 */}
          <div className="testimonial-card">
            <div className="stars">
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
            </div>
            <p className="review-text">
              "The JavaScript execution context and closure questions were exactly what I faced during my onsite at Meta. The feedback on my event-loop explanation was a game changer."
            </p>
            <div className="reviewer">
              <div className="avatar">SJ</div>
              <div className="info">
                <h4>Sarah Jenkins</h4>
                <span>Frontend Engineer @ Meta</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="testimonial-card">
            <div className="stars">
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
            </div>
            <p className="review-text">
              "I was struggling to break into full-stack roles. The personalized roadmap honed my system design skills and helped me finally land a Senior Developer position."
            </p>
            <div className="reviewer">
              <div className="avatar" style={{ background: '#1e90ff' }}>DK</div>
              <div className="info">
                <h4>David Kumar</h4>
                <span>Full Stack Developer</span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="testimonial-card">
            <div className="stars">
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
              <Star size={16} fill="#ffb400" color="#ffb400" />
            </div>
            <p className="review-text">
              "The ability to paste a job description and instantly get a tailored 45-minute mock interview feels like magic. I walked into my interview completely stress-free."
            </p>
            <div className="reviewer">
              <div className="avatar" style={{ background: '#9333ea' }}>MT</div>
              <div className="info">
                <h4>Michael Torres</h4>
                <span>Backend Engineer @ Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="landing-footer">
        <p>© 2026 CAREERPILOT AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;