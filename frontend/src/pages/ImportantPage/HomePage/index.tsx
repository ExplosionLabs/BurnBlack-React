import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import { motion } from "framer-motion";
import { FileText, Shield, TrendingUp, Users } from 'lucide-react';
import heroImage from "../../../assets/images/illustration.svg"; // Add a stock image or graphic

function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    const selectUserName = (state: RootState) => state.user.user?.name;
    const userName = useSelector(selectUserName);

    useEffect(() => {
        // Smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
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

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-gray-50">
          
            
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            File Your Taxes <span className="text-indigo-600">Effortlessly</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            India's most trusted tax filing platform. Save time and money with our intelligent tax filing solution.
                        </p>
                        <motion.div 
                            className="flex flex-col sm:flex-row justify-center gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link
                                to="/fileITR"
                                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
                            >
                                Start Filing Now
                            </Link>
                            <Link
                                to="#features"
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium border-2 border-indigo-600"
                            >
                                Learn More
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div 
                        className="text-center mb-16"
                        {...fadeInUp}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BURNBLACK?</h2>
                        <p className="text-xl text-gray-600">Everything you need to file your taxes confidently</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <FileText className="w-8 h-8" />,
                                title: "Easy Filing",
                                description: "File your ITR in minutes with our guided process"
                            },
                            {
                                icon: <Shield className="w-8 h-8" />,
                                title: "100% Accurate",
                                description: "Maximum tax savings with our advanced tax engine"
                            },
                            {
                                icon: <TrendingUp className="w-8 h-8" />,
                                title: "Real-time Processing",
                                description: "Track your refund status in real-time"
                            },
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: "Expert Support",
                                description: "Get help from our tax experts anytime"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-50 p-6 rounded-xl"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-indigo-600">
                <motion.div 
                    className="max-w-4xl mx-auto text-center px-4"
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to file your taxes?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join millions of Indians who trust BURNBLACK for their tax filing needs.
                    </p>
                    <Link
                        to="/fileITR"
                        className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium border-2 border-white"
                    >
                        Start Filing Now
                    </Link>
                </motion.div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center">Pricing</h2>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <motion.div
                            className="bg-gray-50 p-6 rounded-lg shadow-lg"
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className="text-lg font-medium text-gray-900">Basic Plan</h3>
                            <p className="mt-2 text-base text-gray-500">Free</p>
                            <ul className="mt-4 space-y-2">
                                <li className="text-gray-500">Basic tax filing</li>
                                <li className="text-gray-500">Email support</li>
                            </ul>
                            <Link
                                to="/register"
                                className="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                        <motion.div
                            className="bg-gray-50 p-6 rounded-lg shadow-lg"
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className="text-lg font-medium text-gray-900">Pro Plan</h3>
                            <p className="mt-2 text-base text-gray-500">$49/year</p>
                            <ul className="mt-4 space-y-2">
                                <li className="text-gray-500">Advanced tax filing</li>
                                <li className="text-gray-500">Priority support</li>
                                <li className="text-gray-500">GST compliance</li>
                            </ul>
                            <Link
                                to="/register"
                                className="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                        <motion.div
                            className="bg-gray-50 p-6 rounded-lg shadow-lg"
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className="text-lg font-medium text-gray-900">Enterprise Plan</h3>
                            <p className="mt-2 text-base text-gray-500">Contact us</p>
                            <ul className="mt-4 space-y-2">
                                <li className="text-gray-500">Custom solutions</li>
                                <li className="text-gray-500">Dedicated support</li>
                                <li className="text-gray-500">Financial management</li>
                            </ul>
                            <Link
                                to="/contact"
                                className="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Contact Us
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center">Contact Us</h2>
                    <div className="mt-10">
                        <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    First name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                    Last name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <footer className="bg-white">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <nav className="flex justify-center space-x-4">
                        <Link to="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
                        <Link to="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
                        <Link to="#contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

export default Main;
