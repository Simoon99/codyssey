"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import { 
    Brain, Zap, Globe, Shield, Check, Clock, X, Star, Users, Lightbulb, Rocket, ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React from "react";

type Helper = {
    id: string;
    name: string;
    emoji: string;
    role: string;
    color: string;
};

const HELPERS: Helper[] = [
    {
        id: 'muse',
        name: 'Muse',
        emoji: '🌟',
        role: 'The Ideator',
        color: 'from-yellow-500 to-orange-500',
    },
    {
        id: 'architect',
        name: 'Architect',
        emoji: '🏗️',
        role: 'The Stack Master',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'crafter',
        name: 'Crafter',
        emoji: '✨',
        role: 'The Brand Weaver',
        color: 'from-purple-500 to-pink-500',
    },
    {
        id: 'hacker',
        name: 'Hacker',
        emoji: '🔧',
        role: 'The Dream Builder',
        color: 'from-green-500 to-emerald-500',
    },
    {
        id: 'hypebeast',
        name: 'Hypebeast',
        emoji: '📣',
        role: 'The Launch Maestro',
        color: 'from-indigo-500 to-blue-500',
    },
    {
        id: 'sensei',
        name: 'Sensei',
        emoji: '🎓',
        role: 'The Growth Sage',
        color: 'from-rose-500 to-pink-500',
    },
];

const MAIN_FEATURES = [
    {
        icon: Users,
        title: 'All 6 AI Helpers for Your Journey',
        description: 'From ideation to launch, get guidance every step of the way. Each helper is specialized for their role in product development.',
    },
    {
        icon: Zap,
        title: 'Built for Vibecoders',
        description: 'Perfect for developers using Cursor, Lovable, and Bolt. Helpers understand your workflow and enhance your productivity.',
    },
    {
        icon: Brain,
        title: 'AI-Powered Guidance',
        description: 'Smart recommendations, code reviews, marketing strategies, and growth tactics - all powered by advanced AI.',
    },
    {
        icon: Rocket,
        title: 'From Spark to Grow',
        description: 'A gamified journey tracking your progress through 6 levels. Stay motivated as you build and scale your product.',
    },
];

const BUNDLE_BENEFITS = [
    'Ideation and concept validation',
    'Product planning and roadmapping',
    'Development guidance and support',
    'Marketing strategy and positioning',
    'Growth hacking and scaling tactics',
    'Analytics and performance tracking',
    'Personalized recommendations',
    'Progress tracking with 6-level gamification',
    'AI-powered insights and suggestions',
    '24/7 availability across all helpers',
    'Integration with your development tools',
    'Community access with other indie makers',
];

type PricingTier = {
    id: string;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    discountPercentage: number;
    billingPeriod: string;
    description: string;
    isRecommended?: boolean;
};

const PRICING_TIERS: PricingTier[] = [
    {
        id: 'yearly',
        name: 'Pay Yearly',
        originalPrice: 52,
        discountedPrice: 18.2,
        discountPercentage: 65,
        billingPeriod: '/month',
        description: 'Pay yearly',
        isRecommended: true,
    },
    {
        id: 'quarterly',
        name: 'Pay Every 3 Months',
        originalPrice: 52,
        discountedPrice: 28.6,
        discountPercentage: 45,
        billingPeriod: '/month',
        description: 'Pay quarterly',
    },
    {
        id: 'monthly',
        name: 'Pay Monthly',
        originalPrice: 52,
        discountedPrice: 39,
        discountPercentage: 25,
        billingPeriod: '/month',
        description: 'Pay monthly',
    },
];

// Countdown Timer Component
function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 6,
        seconds: 19
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                
                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    return { hours: 2, minutes: 6, seconds: 19 };
                }
                
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
            </span>
        </div>
    );
}

export default function PricingPage() {
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [selectedPricingTier, setSelectedPricingTier] = useState<string>('monthly');
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [portalRoot, setPortalRoot] = useState<Element | null>(null);

    useEffect(() => {
        setPortalRoot(document.body);
    }, []);

    // Remove body padding for full-width banner and optimize scrolling
    useEffect(() => {
        document.body.style.paddingLeft = '0';
        document.body.style.paddingRight = '0';
        
        // Enable smooth scrolling with hardware acceleration
        document.documentElement.style.scrollBehavior = 'smooth';
        document.body.style.scrollBehavior = 'smooth';
        
        // Prevent layout shifts
        document.body.style.overflowX = 'hidden';
        
        return () => {
            document.body.style.paddingLeft = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.scrollBehavior = '';
            document.body.style.scrollBehavior = '';
            document.body.style.overflowX = '';
        };
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showPricingModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showPricingModal]);

    const handleRedeemClick = () => {
        setShowPricingModal(true);
    };

    const closePricingModal = () => {
        setShowPricingModal(false);
    };

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqs = [
        {
            question: "Can I cancel anytime?",
            answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period."
        },
        {
            question: "Is there a free trial?",
            answer: "We offer a 30-day money-back guarantee, so you can try Codyssey risk-free and get a full refund if you're not satisfied."
        },
        {
            question: "Which tools does Codyssey work with?",
            answer: "Codyssey is optimized for Cursor, Lovable, and Bolt. Our AI helpers guide you through the entire product development journey with these tools."
        },
        {
            question: "Do you offer team plans?",
            answer: "Currently, Codyssey Pro is for individual use. Contact our support team to discuss enterprise or team licensing options."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards through Stripe. You can also contact our team for other payment arrangements."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, all your data is encrypted and securely stored. We comply with GDPR and other data protection regulations."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Countdown Timer Banner - Always visible at top */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 w-full">
                <div className="flex items-center justify-center gap-3">
                    <span className="font-semibold text-base">Autumn Sale: Up to 65% OFF</span>
                    <CountdownTimer />
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="pb-8 w-full">
                <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-3">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                        </motion.div>

                        {/* TrustPilot-style Rating Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-center mb-12"
                            style={{ willChange: 'transform, opacity' }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 mb-6 border border-border/40">
                                <Image
                                    src="/assets/trustpilot-rating.avif"
                                    alt="TrustPilot Rating 4.8 out of 5"
                                    width={90}
                                    height={18}
                                    priority
                                    className="h-4 w-auto"
                                />
                                <span className="text-xs font-medium text-foreground">4.8/5.0 Rating</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                From ideation to launch<br />— every step done right
                            </h2>
                        </motion.div>

                        {/* Hero Card - Bundle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                            className="max-w-4xl mx-auto mb-12"
                            style={{ willChange: 'transform, opacity' }}
                        >
                            <div className="relative overflow-hidden rounded-3xl p-10 shadow-xl border border-border bg-card">
                                <div className="flex items-start justify-between gap-8">
                                    {/* Left Side - Content */}
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-2">Pricing</p>
                                        <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                            Codyssey Pro
                                        </h2>
                                        
                                        {/* Benefits List */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <span className="text-base text-foreground">All 6 AI Helpers for your journey</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <span className="text-base text-foreground">Gamified progress tracking</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <span className="text-base text-foreground">From idea to launched product</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <span className="text-base text-foreground">Built for Cursor, Lovable & Bolt</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <span className="text-base text-foreground">30-day money back guarantee</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Pricing & Avatars */}
                                    <div className="flex flex-col items-end gap-6">
                                        {/* Pricing */}
                                        <div className="text-right">
                                            <p className="text-xl text-red-500 line-through mb-1">€52</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-bold text-foreground">€18</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">per month</p>
                                        </div>

                                        {/* Helper Avatars */}
                                        <div className="grid grid-cols-3 gap-2">
                                            {HELPERS.slice(0, 6).map((helper, index) => (
                                                <div
                                                    key={helper.id}
                                                    className={cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center text-lg",
                                                        "bg-gradient-to-br shadow-lg transition-all hover:scale-110",
                                                        helper.color
                                                    )}
                                                >
                                                    {helper.emoji}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Everything Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                            className="mb-12"
                            style={{ willChange: 'transform, opacity' }}
                        >
                            <h2 className="text-2xl font-bold mb-8">Everything You're Getting</h2>
                            <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-6">
                                <div className="space-y-6">
                                    {MAIN_FEATURES.map((feature, index) => {
                                        const Icon = feature.icon;
                                        return (
                                            <div key={index} className="flex gap-3">
                                                <Icon className="w-6 h-6 flex-shrink-0 text-primary" />
                                                <div>
                                                    <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>

                        {/* Included Helpers */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold">Included with Codyssey Pro</h2>
                                    <p className="text-sm text-muted-foreground mt-1">6 AI helpers covering every step of your product journey</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full hover:bg-muted transition-colors">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-muted transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {HELPERS.map((helper) => (
                                    <div
                                        key={helper.id}
                                        className={cn(
                                            "relative overflow-hidden rounded-3xl aspect-square",
                                            "bg-gradient-to-br",
                                            helper.color,
                                            "group cursor-pointer transition-all hover:shadow-lg"
                                        )}
                                    >
                                        {/* Background placeholder - simulates character image */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-7xl mb-2 opacity-80">{helper.emoji}</div>
                                            </div>
                                        </div>

                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                        {/* Content overlay */}
                                        <div className="absolute inset-0 flex flex-col justify-between p-4">
                                            {/* Helper name at top */}
                                            <div>
                                                <h3 className="font-bold text-white text-lg drop-shadow-lg transform group-hover:scale-105 transition-transform">
                                                    {helper.name}
                                                </h3>
                                            </div>

                                            {/* Helper role at bottom */}
                                            <div>
                                                <p className="text-white/90 text-xs font-medium drop-shadow-lg">
                                                    {helper.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Benefits */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                            <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {BUNDLE_BENEFITS.map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-2.5">
                                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Trust Section */}
                        <div className="mb-12 max-w-4xl mx-auto">
                            <div className="bg-card rounded-2xl border border-border p-8">
                                <div className="text-center">
                                    <h2 className="text-xl font-bold mb-2">Trusted by Indie Makers Worldwide</h2>
                                    <p className="text-sm text-muted-foreground">Join thousands of developers building amazing products with Cursor, Lovable, and Bolt.</p>
                                </div>
                            </div>
                        </div>

                        {/* Guarantee Section */}
                        <div className="mb-12 max-w-4xl mx-auto">
                            <div className="bg-card rounded-2xl border border-border p-6">
                                <div className="flex items-start gap-4">
                                    <Shield className="w-10 h-10 text-primary flex-shrink-0" />
                                    <div>
                                        <h2 className="text-lg font-bold mb-1.5">Risk-Free Guarantee</h2>
                                        <p className="text-sm text-muted-foreground">Not satisfied with Codyssey? Get a full refund within 30 days. No questions asked. We're confident it will help you launch faster.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="mb-12 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                                {faqs.map((faq, index) => (
                                    <div key={index} className={cn("border-border", index !== faqs.length - 1 && "border-b")}>
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className="w-full text-left p-5 hover:bg-muted/30 transition-colors flex items-center justify-between group"
                                        >
                                            <h3 className="font-semibold text-foreground">{faq.question}</h3>
                                            <ChevronDown 
                                                className={cn(
                                                    "w-5 h-5 text-muted-foreground transition-transform duration-200",
                                                    openFAQ === index && "rotate-180"
                                                )}
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {openFAQ === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-sm text-muted-foreground px-5 pb-5">{faq.answer}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>
            </div>

            {/* Pricing Modal - Rendered via Portal to ensure proper fixed positioning */}
            {portalRoot && createPortal(
                <AnimatePresence mode="wait">
                    {showPricingModal && (
                        <React.Fragment key="pricing-modal">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                onClick={closePricingModal}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
                                style={{ willChange: 'opacity' }}
                            />

                            {/* Floating Close Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                onClick={closePricingModal}
                                className="fixed top-4 right-4 z-[65] p-3 rounded-full bg-background border border-border hover:bg-muted transition-all shadow-xl"
                                style={{ willChange: 'transform, opacity' }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>

                            {/* Modal */}
                            <motion.div
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ 
                                    type: "spring", 
                                    damping: 35, 
                                    stiffness: 400,
                                    mass: 0.8
                                }}
                                className="fixed inset-x-0 bottom-0 z-[60]"
                                style={{ willChange: 'transform, opacity' }}
                            >
                            <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border relative max-h-[85vh] overflow-y-auto">
                                {/* Content */}
                                <div className="px-4 md:px-6 pt-5 pb-5 md:pt-8 md:pb-6 max-w-xl mx-auto">
                                    {/* Pricing Tiers */}
                                    <div className="space-y-2 md:space-y-3">
                                        {PRICING_TIERS.map((tier, index) => (
                                            <div key={tier.id} className="relative">
                                                {/* Most Popular Badge - Only for recommended tier */}
                                                {tier.isRecommended && (
                                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-2">
                                                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg whitespace-nowrap">
                                                            Most Popular - Save €{Math.round(52 * 12 - tier.discountedPrice * 12)}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <button
                                                    onClick={() => setSelectedPricingTier(tier.id)}
                                                    className={cn(
                                                        "w-full p-4 md:p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden group",
                                                        selectedPricingTier === tier.id
                                                            ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200 pt-6"
                                                            : "border-border hover:border-blue-400 hover:shadow-md hover:bg-muted/30 hover:scale-[1.02]",
                                                        tier.isRecommended && selectedPricingTier === tier.id && "pt-7"
                                                    )}
                                                    style={{
                                                        transformOrigin: 'center'
                                                    }}
                                                >
                                                    {/* Selection glow effect */}
                                                    {selectedPricingTier === tier.id && (
                                                        <motion.div
                                                            layoutId="selectedPricing"
                                                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10"
                                                            transition={{ 
                                                                type: "spring", 
                                                                bounce: 0.15, 
                                                                duration: 0.4,
                                                                ease: "easeInOut"
                                                            }}
                                                            style={{ willChange: 'transform' }}
                                                        />
                                                    )}
                                                    
                                                    <div className="flex items-center justify-between relative z-10">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2.5 mb-1.5">
                                                                <span className="text-sm text-pink-600 line-through">
                                                                    €{tier.originalPrice}
                                                                </span>
                                                                <span className={cn(
                                                                    "text-lg font-bold transition-colors",
                                                                    selectedPricingTier === tier.id && "text-blue-600"
                                                                )}>
                                                                    €{Math.round(tier.discountedPrice)}/month
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                {tier.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {selectedPricingTier === tier.id && (
                                                                <motion.span
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    exit={{ scale: 0, opacity: 0 }}
                                                                    transition={{ 
                                                                        type: "spring", 
                                                                        stiffness: 500, 
                                                                        damping: 25,
                                                                        duration: 0.3
                                                                    }}
                                                                    className="px-2.5 py-0.5 bg-pink-500 text-white text-xs font-bold rounded-full"
                                                                    style={{ willChange: 'transform, opacity' }}
                                                                >
                                                                    {tier.discountPercentage}% off
                                                                </motion.span>
                                                            )}
                                                            <motion.div
                                                                initial={false}
                                                                animate={{
                                                                    scale: selectedPricingTier === tier.id ? 1 : 0,
                                                                    opacity: selectedPricingTier === tier.id ? 1 : 0
                                                                }}
                                                                transition={{ 
                                                                    type: "spring", 
                                                                    stiffness: 500, 
                                                                    damping: 25,
                                                                    duration: 0.3
                                                                }}
                                                                className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0"
                                                                style={{ willChange: 'transform, opacity' }}
                                                            >
                                                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        size="lg"
                                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-base py-5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                                    >
                                        Buy now for €{Math.round(PRICING_TIERS.find(t => t.id === selectedPricingTier)?.discountedPrice || 0)}/month
                                    </Button>

                                    <div className="text-center mt-4 text-xs text-muted-foreground">
                                        <p>100% risk-free.<br />Cancel anytime within 7 days ✓</p>
                                    </div>
                                </div>
                            </div>
                            </motion.div>
                        </React.Fragment>
                    )}
                </AnimatePresence>,
                portalRoot
            )}

            {/* Fog & CTA Button - Sticky at bottom of viewport */}
            {!showPricingModal && (
                <div 
                    className="sticky bottom-0 left-0 right-0 z-[40] w-full h-20 flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(to top, rgba(245, 245, 245, 1) 0%, rgba(245, 245, 245, 0.95) 25%, rgba(245, 245, 245, 0.7) 50%, rgba(245, 245, 245, 0) 100%)'
                    }}
                >
                    <Button
                        onClick={handleRedeemClick}
                        className="bg-gradient-to-r from-[#31A8FF] via-[#4763FF] to-[#2E5FD8] text-white font-bold text-lg px-8 md:px-12 py-6 rounded-full shadow-[0_12px_30px_rgba(71,99,255,0.35)] hover:shadow-[0_20px_50px_rgba(71,99,255,0.6)] transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                        Redeem 65% OFF
                    </Button>
                </div>
            )}
        </div>
    );
}
