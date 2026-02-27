type PaymentProps = {
  onPay: () => void;
  isLoading?: boolean;
  amount?: number;
};

export default function Payment({ onPay, isLoading = false, amount = 500 }: PaymentProps) {
  return (
    <button
      onClick={onPay}
      disabled={isLoading}
      className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
}
