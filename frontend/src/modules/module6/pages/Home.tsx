import { useEffect, useMemo, useState } from 'react';
import Payment from '../components/Payment';
import { createOrder, verifyPayment, type VerifyPayload } from '../services/paymentService';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (payload: unknown) => void) => void;
    };
  }
}

const RAZORPAY_KEY =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_RAZORPAY_KEY_ID ||
  'rzp_test_SI9H5jHBxdeTjW';

async function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return true;

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const paymentAmount = useMemo(() => 500, []);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    setStatus('Starting payment...');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setStatus('Razorpay checkout failed to load.');
        return;
      }

      const order = await createOrder(paymentAmount);
      if (!order?.id) {
        setStatus('Order creation failed.');
        return;
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'CareerAI',
        description: 'Premium Mock Payment',
        order_id: order.id,
        handler: async (response: VerifyPayload) => {
          try {
            const result = await verifyPayment(response);
            setStatus(result?.success ? 'Payment verified successfully.' : 'Payment verification failed.');
          } catch {
            setStatus('Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => setStatus('Payment popup closed.')
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setStatus('Payment failed. Please try again.');
      });
      rzp.open();
    } catch {
      setStatus('Something went wrong while processing payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Razorpay Integration</h1>
        <p className="mt-3 text-slate-600">Use this page to test secure payment flow from the app.</p>

        <Payment onPay={handlePayment} isLoading={isLoading} amount={paymentAmount} />

        {status && <p className="mt-5 text-sm font-medium text-slate-700">{status}</p>}
      </div>
    </div>
  );
}
