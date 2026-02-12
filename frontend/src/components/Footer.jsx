import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-md flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              ZeroDay<span className="text-brand-600">Market</span>
            </span>
          </div>

          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} ZeroDay Market. Built for security research and education.
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
