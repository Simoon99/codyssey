"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";

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

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const [selectedPricingTier, setSelectedPricingTier] = useState<string>('yearly');

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ 
                        type: "spring", 
                        damping: 35, 
                        stiffness: 400,
                        mass: 0.8
                    }}
                    className="fixed inset-0 z-[110] overflow-y-auto bg-background"
                    style={{ willChange: 'transform' }}
                >
                    {/* Floating Close Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
                        onClick={onClose}
                        className="fixed top-4 right-4 z-[120] p-3 rounded-full bg-background border border-border hover:bg-muted transition-all shadow-xl"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>

                    {/* Content */}
                    <div className="min-h-screen">
                        <div className="px-6 pt-20 pb-8 max-w-xl mx-auto">
                            {/* Pricing Tiers */}
                            <div className="space-y-3">
                                {PRICING_TIERS.map((tier) => (
                                    <div key={tier.id} className="relative">
                                        {/* Most Popular Badge - Only for recommended tier */}
                                        {tier.isRecommended && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-auto min-w-[200px] sm:min-w-0">
                                                <div className="bg-gradient-to-r from-[#31A8FF] via-[#4763FF] to-[#2E5FD8] text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap text-center">
                                                    Most Popular - Save €{Math.round(52 * 12 - tier.discountedPrice * 12)}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <button
                                            onClick={() => setSelectedPricingTier(tier.id)}
                                            className={cn(
                                                "w-full p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden group",
                                                selectedPricingTier === tier.id
                                                    ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200 pt-6"
                                                    : "border-border hover:border-blue-300 hover:shadow-sm",
                                                tier.isRecommended && selectedPricingTier === tier.id && "pt-8"
                                            )}
                                        >
                                            {/* Selection glow effect */}
                                            {selectedPricingTier === tier.id && (
                                                <motion.div
                                                    layoutId="selectedPricing"
                                                    className="absolute inset-0 bg-gradient-to-r from-[#31A8FF]/10 via-[#4763FF]/10 to-[#2E5FD8]/10"
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
                                className="w-full mt-6 bg-gradient-to-r from-[#31A8FF] via-[#4763FF] to-[#2E5FD8] hover:from-[#2E9FEE] hover:via-[#4055EE] hover:to-[#2954C7] text-white text-base py-5 rounded-full font-bold shadow-[0_12px_30px_rgba(71,99,255,0.35)] hover:shadow-[0_16px_36px_rgba(71,99,255,0.45)] transition-all duration-300"
                            >
                                Buy now for €{Math.round(PRICING_TIERS.find(t => t.id === selectedPricingTier)?.discountedPrice || 0)}/month
                            </Button>

                            <div className="text-center mt-4 text-xs text-muted-foreground">
                                <p>100% risk-free.<br />Cancel anytime within 7 days ✓</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
