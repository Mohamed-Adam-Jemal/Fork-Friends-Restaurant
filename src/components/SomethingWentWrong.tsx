'use client';

import { RefreshCw } from 'lucide-react';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function SomethingWentWrong({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
      <div className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center w-65">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
        <p className="text-red-700 mb-4">{message || 'Something went wrong.'}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            <RefreshCw size={16} /> Retry
          </button>
        )}
      </div>
    </div>
  );
}
