import { BookOpen, User } from 'lucide-react';

const logo = "/assets/Neuravia Logo.png";

export function Header() {
  return (
    /* Header Container */
    <header className="border-b border-border-primary flex-shrink-0" style={{ backgroundColor: '#0a0a1f' }}>
      {/* Header Content Wrapper */}
      <div className="px-4 lg:px-6 py-4">
        {/* Header Inner Container */}
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Logo and Brand Section */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="NeuraVia Logo" className="h-10 w-auto" />
            <h1 className="text-xl lg:text-2xl font-semibold text-text-on-color">NeuraVia Academy</h1>
          </div>
          {/* Navigation Menu */}
          <nav className="flex items-center gap-4 lg:gap-6">
            {/* Lessons Link */}
            <a href="#lessons" className="flex items-center gap-2 text-text-on-color hover:text-brand-start transition-colors text-body-md">
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline">Lessons</span>
            </a>
            {/* Account Link */}
            <a href="#account" className="flex items-center gap-2 text-text-on-color hover:text-brand-start transition-colors text-body-md">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Account</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}