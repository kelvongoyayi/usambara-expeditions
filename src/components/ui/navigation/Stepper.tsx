import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  completed?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.completed || index < currentStepIndex;
          const isPrevious = index < currentStepIndex;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step Circle with Label */}
              <div className="relative flex flex-col items-center group">
                {/* Step indicator */}
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                    shadow-sm transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-accent-500 text-white scale-100' 
                      : isActive 
                        ? 'bg-brand-600 text-white scale-110 ring-4 ring-brand-100' 
                        : 'bg-gray-100 text-gray-400 scale-90'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 md:w-6 md:h-6" />
                  ) : (
                    <span className="text-sm md:text-base font-semibold">{index + 1}</span>
                  )}
                </div>
                
                {/* Label with transition effects */}
                <div className="mt-2 transition-all duration-300">
                  <span className={`text-xs md:text-sm font-medium text-center block whitespace-nowrap px-1 ${
                    isActive 
                      ? 'text-brand-600 transform scale-110' 
                      : isCompleted 
                        ? 'text-accent-500' 
                        : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                
                {/* Tooltip for mobile - appears on hover/tap */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                  bg-dark-800 text-white text-xs rounded py-1 px-2 hidden group-hover:block md:hidden z-10
                  whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {step.label}
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-1 md:mx-4 relative h-0.5 z-0">
                  {/* Background line */}
                  <div className="absolute inset-0 w-full bg-gray-200 rounded-full"></div>
                  
                  {/* Progress line with animation */}
                  <div 
                    className={`absolute inset-0 rounded-full transition-all duration-700 ease-in-out ${
                      isPrevious ? 'bg-accent-500 w-full' : 
                      isActive ? 'bg-brand-600 w-1/2' : 'w-0'
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;