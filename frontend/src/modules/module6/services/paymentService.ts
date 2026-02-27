export type VerifyPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
};

const PAYMENT_API_BASE_URL =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

export async function createOrder(amount: number): Promise<RazorpayOrder> {
  const response = await fetch(`${PAYMENT_API_BASE_URL}/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });

  if (!response.ok) {
    throw new Error(`Order creation failed with status ${response.status}`);
  }

  return response.json();
}

export async function verifyPayment(payload: VerifyPayload): Promise<{ success?: boolean; message?: string }> {
  const response = await fetch(`${PAYMENT_API_BASE_URL}/payment/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || 'Payment verification failed');
  }

  return data;
}
