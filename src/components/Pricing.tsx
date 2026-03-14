import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  Globe, 
  MessageSquare, 
  BrainCircuit,
  CreditCard,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

interface PricingProps {
  isDarkMode?: boolean;
  userEmail?: string | null;
  userName?: string | null;
  onUpgrade?: () => void | Promise<void>;
}

export default function Pricing({ isDarkMode, userEmail, userName, onUpgrade }: PricingProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [dynamicPlans, setDynamicPlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        const data = await response.json();
        setDynamicPlans(data);
      } catch (error) {
        console.error('Failed to fetch plans', error);
      }
    };
    fetchPlans();
  }, []);

  const staticPlans = [
    {
      id: 'trial_1day',
      name: '1 Day Free Trial',
      price: '0',
      description: 'Experience HumnAi for a full day',
      features: [
        '1 AI Conversation',
        'Basic Vocabulary Lessons',
        'Standard Pronunciation Check',
        'Community Support'
      ],
      buttonText: 'Start Free Trial',
      isPopular: false,
      color: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    {
      id: 'trial_7day',
      name: '7 Days Trial',
      price: dynamicPlans.find(p => p.id === 'trial_7day')?.price || '99',
      description: 'Full practice access for a week',
      features: [
        '7 Days Full Access',
        'Daily 5 AI Conversations',
        'Basic Vocabulary Lessons',
        'Standard Pronunciation Check',
        'Community Support'
      ],
      buttonText: 'Get 7 Day Access',
      isPopular: true,
      color: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'monthly',
      name: 'Pro Monthly',
      price: dynamicPlans.find(p => p.id === 'monthly')?.price || '499',
      description: 'Full access with monthly flexibility',
      features: [
        'Unlimited AI Conversations',
        'All Learning Modules Unlocked',
        'Advanced AI Feedback',
        'Priority AI Processing',
        'Detailed Progress Reports',
        'Offline Learning Support'
      ],
      buttonText: 'Upgrade to Pro',
      isPopular: false,
      color: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      id: 'yearly',
      name: 'Pro Yearly',
      price: dynamicPlans.find(p => p.id === 'yearly')?.price || '4999',
      description: 'Best value for serious learners',
      features: [
        'Everything in Pro Monthly',
        'Save 20% annually',
        'Exclusive Pro Badges',
        'Early Access to New Features',
        '1-on-1 AI Coaching Sessions',
        'Certificate of Completion'
      ],
      buttonText: 'Get Yearly Pro',
      isPopular: false,
      color: 'bg-indigo-600',
      textColor: 'text-white'
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'trial_1day') {
      if (onUpgrade) {
        await onUpgrade();
      }
      alert('Your 1-day free trial has started! You now have Pro access.');
      return;
    }
    
    setIsLoading(planId);
    try {
      // 1. Create Order on Backend
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, email: userEmail })
      });
      
      const orderData = await response.json();
      
      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Handle Demo Mode
      if (orderData.isDemo) {
        const confirmDemo = window.confirm("Razorpay is not configured with API keys. Would you like to perform a 'Demo Upgrade' for testing purposes?");
        if (confirmDemo) {
          if (onUpgrade) await onUpgrade();
          alert("Demo Upgrade Successful! You now have Pro access.");
          return;
        }
        throw new Error("Payment cancelled (Demo Mode)");
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "HumnAi Pro",
        description: `Upgrade to ${staticPlans.find(p => p.id === planId)?.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment on Backend
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: userEmail,
              planId: planId
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            if (onUpgrade) {
              await onUpgrade();
            }
            alert(`Successfully upgraded to ${staticPlans.find(p => p.id === planId)?.name}!`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userName || "",
          email: userEmail || "",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment failed', error);
      if (error.message === "Payment cancelled (Demo Mode)") return;
      alert(error.message || 'Payment initialization failed. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="space-y-12 pb-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold uppercase tracking-wider"
        >
          <Sparkles size={16} />
          <span>Premium Learning Experience</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#111827] dark:text-white tracking-tight">
          Invest in Your Future
        </h2>
        <p className="text-lg text-[#6B7280] dark:text-[#A1A1AA] max-w-2xl mx-auto">
          Unlock the full potential of HumnAi and master English 3x faster with our Pro features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {staticPlans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative flex flex-col p-8 rounded-3xl border ${
              plan.isPopular 
                ? 'border-indigo-600 dark:border-indigo-500 shadow-2xl shadow-indigo-100 dark:shadow-none scale-105 z-10 bg-white dark:bg-[#121214]' 
                : 'border-[#E5E7EB] dark:border-[#1F1F22] bg-white dark:bg-[#121214]'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-[#111827] dark:text-white">₹{plan.price}</span>
                <span className="text-[#6B7280] dark:text-[#A1A1AA] font-medium">
                  {plan.id === 'trial_1day' ? '' : plan.id === 'trial_7day' ? '/7 days' : plan.id === 'yearly' ? '/year' : '/month'}
                </span>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">{plan.description}</p>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-3">
                  <div className={`mt-1 p-0.5 rounded-full ${plan.isPopular ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'}`}>
                    <Check size={12} />
                  </div>
                  <span className="text-sm text-[#374151] dark:text-gray-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={isLoading !== null}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                plan.isPopular 
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none' 
                  : 'bg-[#111827] dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading === plan.id ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {plan.buttonText}
                  {plan.id !== 'trial_1day' && <ArrowRight size={18} />}
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[#E5E7EB] dark:border-[#1F1F22]">
        {[
          { icon: Shield, label: 'Secure Payments', sub: 'SSL Encrypted' },
          { icon: Zap, label: 'Instant Access', sub: 'Unlock Pro Now' },
          { icon: Globe, label: 'Global Learning', sub: 'Anywhere, Anytime' },
          { icon: BrainCircuit, label: 'AI Powered', sub: 'Smart Feedback' }
        ].map((badge, i) => (
          <div key={i} className="text-center space-y-2">
            <div className="w-12 h-12 bg-gray-50 dark:bg-[#1C1C1E] rounded-2xl flex items-center justify-center mx-auto text-gray-400 dark:text-gray-500">
              <badge.icon size={24} />
            </div>
            <p className="font-bold text-[#111827] dark:text-white text-sm">{badge.label}</p>
            <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{badge.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
