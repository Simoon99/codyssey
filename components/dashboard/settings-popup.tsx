"use client";

import { useState } from "react";
import { X, Settings, User, Package, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type SettingsTab = "profile" | "agent" | "subscription";

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPopup({ isOpen, onClose }: SettingsPopupProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  if (!isOpen) return null;

  const menuItems: Array<{
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: "profile",
      label: "User Profile",
      icon: <User size={20} />,
      description: "Manage your account information",
    },
    {
      id: "agent",
      label: "Agent (LLM)",
      icon: <Zap size={20} />,
      description: "Configure AI model settings",
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: <Package size={20} />,
      description: "Manage your subscription",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Settings Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="flex h-full max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl md:h-auto">
          {/* Left Sidebar Menu */}
          <div className="hidden w-64 flex-col border-r border-zinc-200 bg-gradient-to-b from-zinc-50 to-zinc-100 md:flex">
            {/* Header */}
            <div className="border-b border-zinc-200 p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Settings size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-zinc-900">Settings</h2>
                  <p className="text-xs text-zinc-600">Configure your experience</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-1 p-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left rounded-lg px-4 py-3 transition-all ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className={`text-xs ${activeTab === item.id ? "text-white/80" : "text-zinc-600"}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-zinc-200 p-4">
              <Button
                variant="ghost"
                className="w-full text-zinc-600 hover:text-zinc-900"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 p-4 md:hidden">
              <h3 className="text-lg font-bold text-zinc-900">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 hidden flex-col items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 md:flex md:h-10 md:w-10"
            >
              <X size={20} />
            </button>

            {/* Mobile Tab Navigation */}
            <div className="flex gap-2 border-b border-zinc-200 bg-white p-4 md:hidden overflow-x-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all flex-shrink-0 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Content Tabs */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "agent" && <AgentTab />}
              {activeTab === "subscription" && <SubscriptionTab />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Profile Tab Content
function ProfileTab() {
  return (
    <div className="max-w-2xl">
      <h3 className="mb-6 text-2xl font-bold text-zinc-900">User Profile</h3>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl text-white">
              👤
            </div>
            <Button variant="outline">Upload Photo</Button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
            defaultValue="Builder"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
            disabled
          />
          <p className="mt-1 text-xs text-zinc-600">
            Contact support to change your email
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Bio
          </label>
          <textarea
            placeholder="Tell us about your projects..."
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
            rows={4}
            defaultValue="Building amazing projects with Codyssey"
          />
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg">
            Save Changes
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

// Agent Tab Content
function AgentTab() {
  return (
    <div className="max-w-2xl">
      <h3 className="mb-6 text-2xl font-bold text-zinc-900">Agent Configuration</h3>

      <div className="space-y-6">
        {/* LLM Provider */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            LLM Provider
          </label>
          <select className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-purple-500 focus:outline-none">
            <option>OpenAI (GPT-4)</option>
            <option>OpenAI (GPT-3.5)</option>
            <option>Anthropic (Claude)</option>
          </select>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Temperature: <span className="text-purple-600">0.7</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.7"
            className="w-full"
          />
          <p className="mt-1 text-xs text-zinc-600">
            Lower = more focused, Higher = more creative
          </p>
        </div>

        {/* Max Tokens */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Max Tokens
          </label>
          <input
            type="number"
            placeholder="2000"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
            defaultValue="2000"
          />
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            System Prompt
          </label>
          <textarea
            placeholder="Custom system prompt..."
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-purple-500 focus:outline-none font-mono text-sm"
            rows={4}
            defaultValue="You are a helpful AI assistant specialized in helping developers and builders with their projects."
          />
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg">
            Save Configuration
          </Button>
          <Button variant="outline">Reset to Default</Button>
        </div>
      </div>
    </div>
  );
}

// Subscription Tab Content
function SubscriptionTab() {
  return (
    <div className="max-w-2xl">
      <h3 className="mb-6 text-2xl font-bold text-zinc-900">Subscription Management</h3>

      <div className="space-y-6">
        {/* Current Plan */}
        <div className="rounded-lg border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-zinc-900">Pro Plan</h4>
              <p className="text-sm text-zinc-600">Unlimited projects & AI assistance</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">$9.99</p>
              <p className="text-xs text-zinc-600">/month</p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <p className="text-sm font-medium text-green-700">Active • Renews on Dec 24, 2025</p>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="mb-3 font-medium text-zinc-900">Your Plan Includes:</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-zinc-700">
              <span className="text-green-600">✓</span>
              Unlimited projects
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-700">
              <span className="text-green-600">✓</span>
              Daily AI chat limits removed
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-700">
              <span className="text-green-600">✓</span>
              Priority support
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-700">
              <span className="text-green-600">✓</span>
              Advanced AI models
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 md:flex-row">
          <Button variant="outline">Manage Payment Method</Button>
          <Button variant="outline">Download Invoice</Button>
          <Button variant="outline" className="text-red-600 hover:bg-red-50">
            Cancel Subscription
          </Button>
        </div>

        {/* Usage */}
        <div className="border-t border-zinc-200 pt-6">
          <h4 className="mb-3 font-medium text-zinc-900">Usage This Month</h4>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-700">AI Requests</span>
                <span className="font-medium text-zinc-900">342 / 1000</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-200">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
