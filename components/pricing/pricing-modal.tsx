"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib";
import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type PricingOption = {
  id: string;
  originalPrice: number;
  price: number;
  billingPeriod: string;
  badge?: string;
  discount?: string;
  totalSaved?: string;
};

const PRICING_OPTIONS: PricingOption[] = [
  {
    id: "yearly",
    originalPrice: 52,
    price: 18,
    billingPeriod: "Pay yearly",
    badge: "Best Value - Save €406",
    totalSaved: "€406",
  },
  {
    id: "quarterly",
    originalPrice: 52,
    price: 29,
    billingPeriod: "Pay quarterly",
  },
  {
    id: "monthly",
    originalPrice: 52,
    price: 39,
    billingPeriod: "Pay monthly",
    discount: "25% off",
  },
];

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [selectedOption, setSelectedOption] = useState("monthly");

  const selectedPricing = PRICING_OPTIONS.find((opt) => opt.id === selectedOption);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="bg-black/60 backdrop-blur-sm !z-[100]" />
        <SheetContent
          side="bottom"
          className="h-auto max-h-[90vh] rounded-t-3xl border-0 p-0 overflow-hidden !z-[101]"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-indigo-50 to-white" />
          
          {/* Content */}
          <div className="relative z-10 p-6 pb-8 max-w-2xl mx-auto">
            {/* Close indicator */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Pricing cards */}
            <div className="space-y-4 mb-6">
              {PRICING_OPTIONS.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Badge for yearly */}
                  {option.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                        {option.badge}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "w-full text-left rounded-2xl border-2 transition-all duration-200",
                      "bg-white/80 backdrop-blur-sm",
                      selectedOption === option.id
                        ? "border-blue-500 shadow-lg scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300",
                      option.badge && "pt-5"
                    )}
                  >
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-pink-500 line-through text-lg font-medium">
                            €{option.originalPrice}
                          </span>
                          <span className="text-3xl font-bold text-gray-900">
                            €{option.price}/month
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{option.billingPeriod}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {option.discount && (
                          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {option.discount}
                          </div>
                        )}
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            selectedOption === option.id
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 bg-white"
                          )}
                        >
                          {selectedOption === option.id && (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Buy button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg py-7 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => {
                  // Handle purchase
                  console.log("Purchase:", selectedPricing);
                }}
              >
                Buy now for €{selectedPricing?.price}/month
              </Button>

              {/* Guarantee text */}
              <div className="text-center mt-4 space-y-1">
                <p className="text-sm font-medium text-gray-700">100% risk-free.</p>
                <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  Cancel anytime within 7 days <Check className="w-4 h-4 text-green-500" />
                </p>
              </div>
            </motion.div>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}

