import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FileText, 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Star,
  ChevronDown,
  MessageCircle,
  Clock,
  Zap,
  Award,
  HelpCircle
} from 'lucide-react';
import heroImage from "../../../assets/images/hero-illustration.svg";
import { useState } from "react";

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Smart Filing",
    description: "AI-powered tax filing that adapts to your unique situation"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Bank-Grade Security",
    description: "Your data is encrypted and protected with enterprise-grade security"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Maximum Savings",
    description: "Our tax engine finds every possible deduction to maximize your refund"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Support",
    description: "Get help from certified tax professionals anytime"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Real-time Updates",
    description: "Track your filing status and refund in real-time"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "File your taxes in minutes, not hours"
  }
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer",
    content: "BURNBLACK made tax filing incredibly simple. I saved over ₹15,000 in taxes I didn't know I could claim!",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Business Owner",
    content: "As a small business owner, tax filing used to be a nightmare. BURNBLACK handles everything seamlessly.",
    rating: 5
  },
  {
    name: "Amit Kumar",
    role: "Freelancer",
    content: "The guided filing process is excellent. Even as a freelancer with multiple income sources, it was straightforward.",
    rating: 5
  }
];

const faqs = [
  {
    question: "How does BURNBLACK ensure accurate tax filing?",
    answer: "We use advanced AI algorithms and have a team of tax experts who review each filing. Our system is regularly updated with the latest tax laws and regulations."
  },
  {
    question: "What documents do I need to file my taxes?",
    answer: "You'll need your PAN card, Aadhaar card, Form 16 (if employed), bank statements, investment proofs, and any other income-related documents."
  },
  {
    question: "How long does it take to file taxes with BURNBLACK?",
    answer: "Most users complete their filing in 15-20 minutes. The actual processing time depends on your specific situation and document availability."
  },
  {
    question: "Is my data secure with BURNBLACK?",
    answer: "Yes, we use bank-grade encryption and security measures. We're also a government-authorized ERI license holder."
  }
];

const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for simple tax filing needs",
    features: [
      "Basic tax filing",
      "Email support",
      "Standard processing",
      "Basic tax savings"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Pro",
    price: "₹999",
    description: "Best for professionals and small businesses",
    features: [
      "Advanced tax filing",
      "Priority support",
      "Fast processing",
      "Maximum tax savings",
      "GST compliance",
      "Document storage"
    ],
    cta: "Get Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For businesses with complex tax needs",
    features: [
      "Custom solutions",
      "Dedicated support",
      "Instant processing",
      "Advanced analytics",
      "API access",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

function HomePage() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  useEffect(() => {
    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(this: HTMLAnchorElement, e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              style={{ opacity, scale }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                File Your Taxes <span className="text-blue-600">Smarter</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                India's most intelligent tax filing platform. Save time and maximize your refund with our AI-powered solution.
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to={isUserLoggedIn ? "/fileITR" : "/register"}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
                >
                  Start Filing Now
                </Link>
                <Link
                  to="#features"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium border-2 border-blue-600"
                >
                  Learn More
                </Link>
              </motion.div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                </div>
                <p className="text-gray-600">
                  <span className="font-semibold">10,000+</span> happy filers this month
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="Tax Filing Illustration"
                className="w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">100% Accurate Filing</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BURNBLACK?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to file your taxes with confidence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`bg-white p-8 rounded-xl shadow-lg ${
                  plan.popular ? 'ring-2 ring-blue-600' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-600">/year</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={isUserLoggedIn ? "/fileITR" : "/register"}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about BURNBLACK
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      activeFAQ === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to file your taxes?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of Indians who trust BURNBLACK for their tax filing needs.
            </p>
            <Link
              to={isUserLoggedIn ? "/fileITR" : "/register"}
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
            >
              Start Filing Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="#features" className="hover:text-white">Features</Link></li>
                <li><Link to="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/fileITR" className="hover:text-white">File ITR</Link></li>
                <li><Link to="/tax-saving" className="hover:text-white">Tax Savings</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/guides" className="hover:text-white">Tax Guides</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/refund" className="hover:text-white">Refund Policy</Link></li>
                <li><Link to="/compliance" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} BURNBLACK. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
