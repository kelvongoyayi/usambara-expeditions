import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  dark?: boolean;
  gradient?: boolean;
  id?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  className = '',
  dark = false,
  gradient = false,
  id
}) => {
  const baseClasses = 'py-16 sm:py-20 md:py-24';
  
  const bgClasses = dark 
    ? 'bg-brand-900 text-white' 
    : gradient 
      ? 'bg-gradient-to-b from-white to-gray-50'
      : 'bg-white';
  
  return (
    <section className={`${baseClasses} ${bgClasses} ${className} overflow-hidden`} id={id}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16">
            {title && (
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-dark-800'}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-lg md:text-xl max-w-3xl mx-auto ${dark ? 'text-white/80' : 'text-dark-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;