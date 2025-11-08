import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Interactive components (keep the same cool animations)
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = target / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={ref}>{count}+</span>;
};

const InteractiveFeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`interactive-feature-card ${isVisible ? 'animate-in' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="feature-glow"></div>
      <div className="feature-icon-container">
        <Icon className="feature-icon" />
        <div className="icon-pulse"></div>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="feature-hover-content">
        <div className="sparkle">
          <SparklesIcon className="sparkle-icon" />
        </div>
      </div>
    </div>
  );
};

const FloatingElement = ({ children, delay = 0 }) => {
  return (
    <div 
      className="floating-element"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // College-focused features
  const features = [
    {
      icon: BellAlertIcon,
      title: 'Instant Campus Alerts',
      description: 'Real-time notifications for class cancellations, events, and urgent announcements. Never miss important updates.',
      color: '#3B82F6'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Student-Faculty Communication',
      description: 'Direct messaging, class discussions, and Q&A forums. Enhanced collaboration between students and professors.',
      color: '#8B5CF6'
    },
    {
      icon: CalendarIcon,
      title: 'Academic Scheduling',
      description: 'Smart scheduling for exams, assignments, and events. Integrated with academic calendar and deadlines.',
      color: '#F59E0B'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Campus Network',
      description: 'Role-based access control ensuring only authorized users can access sensitive information and announcements.',
      color: '#10B981'
    },
    {
      icon: BookOpenIcon,
      title: 'Department Specific',
      description: 'Targeted announcements for specific departments, courses, or student groups. Personalized content delivery.',
      color: '#EF4444'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Building',
      description: 'Foster campus community through clubs, events, and group announcements. Enhanced student engagement.',
      color: '#06B6D4'
    }
  ];

  // College-focused stats
  const stats = [
    { number: 95, label: 'Faster Announcement Delivery', suffix: '%' },
    { number: 80, label: 'Reduction in Paper Usage', suffix: '%' },
    { number: 300, label: 'Increase in Student Engagement', suffix: '%' },
    { number: 24, label: 'Hours Support Available', suffix: '/7' }
  ];

  const testimonials = [
    {
      name: 'Dr. Phani Kumar',
      role: 'Head of Computer Science Department',
      text: 'This platform has revolutionized how we communicate with students. The real-time features eliminated missed announcements completely.',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'Deepika Reddy',
      role: 'Student Representative',
      text: 'Finally, a platform that students actually use! The mobile-friendly design and instant notifications increased campus engagement dramatically.',
      avatar: '👨‍🎓',
      rating: 5
    },
    {
      name: 'Prof. Krishna Kishore',
      role: 'Dean of Academic Affairs',
      text: 'Implementation was seamless across all departments. The analytics help us understand student engagement patterns better.',
      avatar: '👨‍💼',
      rating: 5
    }
  ];

  const demoRequest = () => {
    document.getElementById('demo-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="college-landing-page">
      {/* Animated Background */}
      <div 
        className="animated-bg"
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`,
          '--scroll-y': `${scrollY}px`
        }}
      >
        <div className="bg-grid"></div>
        <div className="bg-glow"></div>
      </div>

      {/* Floating Elements */}
      <FloatingElement delay={0}>
        <div className="floating-shape shape-1"></div>
      </FloatingElement>
      <FloatingElement delay={1.5}>
        <div className="floating-shape shape-2"></div>
      </FloatingElement>
      <FloatingElement delay={2.5}>
        <div className="floating-shape shape-3"></div>
      </FloatingElement>

      {/* Navigation */}
      <nav className="college-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <AcademicCapIcon className="brand-icon" />
            <span>CampusConnect</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#demo-section">Notices</a>
            <button className="nav-cta" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="college-hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <SparklesIcon className="badge-icon" />
              <span>Smart College Communication Platform</span>
            </div>
            
            <h1 className="hero-title">
              Transforming
              <span className="gradient-text"> Campus Communication</span>
              <br />
              for the Digital Age
            </h1>
            
            <p className="hero-description">
              CampusConnect bridges the gap between students, faculty, and administration 
              through real-time notifications, scheduled announcements, and seamless collaboration. 
              Built specifically for educational institutions.
            </p>

            <div className="hero-actions">
              <button 
                className="college-btn primary"
                onClick={() => navigate('/login')}
              >
                <AcademicCapIcon className="btn-icon" />
                Access Portal
                <ArrowRightIcon className="btn-icon" />
              </button>
              
              <button className="college-btn secondary" onClick={demoRequest}>
                <PlayIcon className="btn-icon" />
                Notification Updates
              </button>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={stat.label} className="college-stat">
                  <div className="stat-number">
                    <AnimatedCounter target={stat.number} />
                    {stat.suffix}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-dashboard">
              <div className="campus-mockup">
                <div className="mockup-header">
                  <div className="mockup-nav">
                    <div className="nav-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="campus-name">CampusConnect</div>
                  </div>
                </div>
                <div className="mockup-content">
                  <div className="notification-pulse"></div>
                  <div className="mockup-announcement urgent">
                    <div className="announcement-header">
                      <div className="urgency-badge">URGENT</div>
                      <div className="announcement-title">Class Cancelled - CS301</div>
                    </div>
                    <div className="announcement-content">
                      Today's Computer Science class is cancelled due to...
                    </div>
                  </div>
                  <div className="mockup-announcement event">
                    <div className="announcement-header">
                      <div className="event-badge">EVENT</div>
                      <div className="announcement-title">Tech Fest 2024</div>
                    </div>
                    <div className="announcement-content">
                      Annual technical festival starts next week. Register now...
                    </div>
                  </div>
                  <div className="mockup-announcement academic">
                    <div className="announcement-header">
                      <div className="academic-badge">ACADEMIC</div>
                      <div className="announcement-title">Midterm Schedule</div>
                    </div>
                    <div className="announcement-content">
                      Midterm examination schedule has been published...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Partners */}
      <section className="campus-partners">
        <div className="partners-container">
          <span>Trusted by Educational Institutions:</span>
          <div className="partners-logos">
            {['IIT Delhi', 'NIT Karnataka', 'University of Mumbai', 'Delhi University', 'Amity University'].map((logo, i) => (
              <div key={logo} className="partner-logo" style={{ animationDelay: `${i * 0.2}s` }}>
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="college-features">
        <div className="features-container">
          <div className="section-header">
            <h2>Campus-Focused Features</h2>
            <p>Designed specifically for educational institutions to enhance communication and collaboration</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <InteractiveFeatureCard
                key={feature.title}
                {...feature}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="campus-demo">
        <div className="demo-container">
          <div className="demo-content">
            <h2>Experience CampusConnect</h2>
            <p>See how our platform transforms campus communication in real-time</p>
            
            <div className="demo-stats">
              <div className="demo-stat">
                <div className="stat-value">0</div>
                <div className="stat-label">Missed Announcements</div>
              </div>
              <div className="demo-stat">
                <div className="stat-value">Instant</div>
                <div className="stat-label">Notification Delivery</div>
              </div>
              <div className="demo-stat">
                <div className="stat-value">100%</div>
                <div className="stat-label">Mobile Access</div>
              </div>
            </div>

            <div className="demo-actions">
              <button className="college-btn primary large" onClick={() => navigate('/login')}>
                <AcademicCapIcon className="btn-icon" />
                Notification Updates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="campus-testimonials">
        <div className="testimonials-container">
          <div className="section-header">
            <h2>What Our Campus Community Says</h2>
            <p>Hear from students, faculty, and staff using CampusConnect daily</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name} 
                className="testimonial-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="testimonial-avatar">
                  {testimonial.avatar}
                </div>
                <div className="testimonial-content">
                  <div className="testimonial-rating">
                {'★'.repeat(testimonial.rating)}
              </div>
                  <p>"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="college-cta">
        <div className="cta-container">
          <div className="cta-content">
            <BuildingLibraryIcon className="cta-icon" />
            <h2>Ready to Transform Your Campus Communication?</h2>
            <p>Join the growing number of educational institutions using CampusConnect</p>
            
            <div className="cta-actions">
              <button 
                className="college-btn primary xl"
                onClick={() => navigate('/login')}
              >
                <AcademicCapIcon className="btn-icon" />
                Get Started Today
                <ArrowRightIcon className="btn-icon" />
              </button>
              
              <button className="college-btn secondary xl" onClick={demoRequest}>
                Request Notice Portal
              </button>
            </div>

            <div className="cta-features">
              <div className="feature-guarantee">
                <CheckBadgeIcon className="guarantee-icon" />
                <span>Free for educational institutions</span>
              </div>
              <div className="feature-guarantee">
                <CheckBadgeIcon className="guarantee-icon" />
                <span>No setup fees</span>
              </div>
              <div className="feature-guarantee">
                <CheckBadgeIcon className="guarantee-icon" />
                <span>Dedicated campus support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="college-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <AcademicCapIcon className="footer-brand-icon" />
              <div>
                <h3>CampusConnect</h3>
                <p>Smart College Communication Platform</p>
                <p className="footer-motto">Connecting Campus, Empowering Education</p>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Platform</h4>
                <a href="#features">Features</a>
                <a href="#demo">Notices</a>
                <a href="#security">Security</a>
              </div>
              <div className="link-group">
                <h4>For Colleges</h4>
                <a href="#implementation">Implementation</a>
                <a href="#training">Training</a>
                <a href="#support">Support</a>
              </div>
              <div className="link-group">
                <h4>Community</h4>
                <a href="#blog">Campus Blog</a>
                <a href="#events">Events</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 CampusConnect. Built with ❤️ for better education.</p>
            <p className="footer-note">A project by Computer Science and Engineering Department, for Students</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;