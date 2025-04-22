import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  name: string;
  description: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: string;
  onStepClick: (stepId: string) => void;
  completedSteps: string[];
}

const FormStepper: React.FC<FormStepperProps> = ({ 
  steps, 
  currentStep, 
  onStepClick,
  completedSteps
}) => {
  return (
    <nav aria-label="Progress" className="px-4 sm:px-6">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li 
            key={step.id}
            className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8' : ''}`}
          >
            {stepIdx !== steps.length - 1 ? (
              <div 
                className="absolute inset-0 flex items-center" 
                aria-hidden="true"
                style={{ left: '32px', right: '0', top: '15px' }}
              >
                <div className={`h-0.5 w-full ${
                  completedSteps.includes(step.id) ? 'bg-brand-600' : 'bg-gray-200'
                } transition-colors duration-300`}></div>
              </div>
            ) : null}
            
            <div className="group relative">
              <span className="flex h-9 items-center">
                <span
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                    currentStep === step.id
                      ? 'bg-white border-2 border-brand-600 text-brand-600 shadow-md'
                      : completedSteps.includes(step.id)
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  } ${
                    !completedSteps.includes(step.id) && currentStep !== step.id 
                    ? 'group-hover:bg-gray-300'
                    : ''
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span className="text-sm font-medium">{stepIdx + 1}</span>
                  )}
                </span>
              </span>
              <div className="mt-3 flex min-w-0 flex-col items-center text-center">
                <button
                  onClick={() => onStepClick(step.id)}
                  disabled={!completedSteps.includes(step.id) && step.id !== currentStep}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    currentStep === step.id 
                      ? 'text-brand-600'
                      : completedSteps.includes(step.id)
                      ? 'text-gray-900 group-hover:text-brand-700'
                      : 'text-gray-500'
                  } focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {step.name}
                </button>
                <span className="text-xs text-gray-500 transition-opacity duration-300 group-hover:opacity-100">{step.description}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default FormStepper;