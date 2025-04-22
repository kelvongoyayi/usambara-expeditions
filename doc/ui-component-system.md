# UI Component System Usage

The project implements a comprehensive UI component system designed to accelerate development while maintaining consistent design and functionality. This document provides guidance on effectively using and extending this system.

## Component System Overview

The UI component system is organized into several categories:

### Button Components
- `Button`: Primary action component with multiple variants
- `IconButton`: Button with icon and optional label

### Display Components
- `Badge`: Small labels with various states and styles
- `Card`: Container component with hover states and options
- `RatingDisplay`: Star-based rating visualization
- `FeatureList`: List of features with consistent styling

### Form Components
- `InputField`: Text input with label, validation, and icon support
- `SelectField`: Dropdown select with label and validation
- `CheckboxField`: Checkbox with label and validation
- `TextareaField`: Multi-line text input with label and validation
- `QuantityField`: Numeric input with increment/decrement controls

### Feedback Components
- `Alert`: Information and status messages
- `Toast`: Temporary notifications

### Navigation Components
- `Pagination`: Page navigation with multiple styles
- `Tabs`: Tabbed interface with multiple styles
- `Stepper`: Multi-step process visualization

### Layout Components
- `Section`: Page section with title, subtitle, and styling options
- `LoadingImage`: Image with loading state and fallback

## Using the Component System

### 1. Basic Component Usage

Components are imported from their respective modules:

```jsx
import { Button, Card, Badge } from '../components/ui';
import { InputField, SelectField } from '../components/ui/forms';

// Using components
function MyComponent() {
  return (
    <Card className="p-6">
      <Badge variant="primary">New</Badge>
      <h2 className="text-xl font-bold mt-2">My Card</h2>
      <InputField 
        label="Your Name" 
        name="name" 
        required 
      />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### 2. Component Composition for Complex UI

Components can be composed to create more complex UI patterns:

```jsx
import { Card, Button, Badge, RatingDisplay } from '../components/ui';
import LoadingImage from '../components/ui/LoadingImage';

function TourCard({ tour }) {
  return (
    <Card className="h-full">
      <div className="relative h-48">
        <LoadingImage 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <Badge variant="primary" className="absolute top-2 right-2">
          {tour.category}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{tour.title}</h3>
        <RatingDisplay rating={tour.rating} showValue={true} />
        <p className="text-gray-600 mt-2">{tour.description}</p>
        <div className="mt-auto pt-4 flex justify-between items-center">
          <span className="font-bold">${tour.price}</span>
          <Button variant="primary" size="sm">Book Now</Button>
        </div>
      </div>
    </Card>
  );
}
```

### 3. Using Form Components

The form system is designed for ease of use and consistent validation:

```jsx
import { useState } from 'react';
import { Button } from '../components/ui';
import { 
  InputField, 
  SelectField, 
  CheckboxField, 
  TextareaField 
} from '../components/ui/forms';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <form className="space-y-4">
      <InputField
        label="Your Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      
      <InputField
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      
      <SelectField
        label="Subject"
        name="subject"
        options={[
          { value: '', label: 'Select a subject' },
          { value: 'booking', label: 'Booking Inquiry' },
          { value: 'support', label: 'Customer Support' },
          { value: 'feedback', label: 'Feedback' }
        ]}
        value={formData.subject}
        onChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
        error={errors.subject}
        required
      />
      
      <TextareaField
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={5}
        error={errors.message}
        required
      />
      
      <CheckboxField
        name="agreeToTerms"
        checked={formData.agreeToTerms}
        onChange={handleChange}
        label="I agree to the terms and conditions"
        error={errors.agreeToTerms}
      />
      
      <Button variant="accent" type="submit">
        Send Message
      </Button>
    </form>
  );
}
```

### 4. Layout Components Usage

The Section component provides consistent page structure:

```jsx
import Section from '../components/ui/Section';

function AboutPage() {
  return (
    <>
      <Section 
        title="About Our Company" 
        subtitle="Learn more about our mission and values"
        dark
      >
        {/* Dark background section content */}
      </Section>
      
      <Section 
        title="Our Team" 
        subtitle="Meet the experts behind our services"
      >
        {/* White background section content */}
      </Section>
      
      <Section 
        title="Our History" 
        subtitle="How we grew over the years"
        gradient
      >
        {/* Gradient background section content */}
      </Section>
    </>
  );
}
```

### 5. Navigation Components

Navigation components help with complex interactions:

```jsx
import { useState } from 'react';
import { Tabs, Pagination, Stepper } from '../components/ui/navigation';

function NavigationExample() {
  const [activeTab, setActiveTab] = useState('details');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStep, setCurrentStep] = useState('personal');
  
  return (
    <div className="space-y-8">
      {/* Tabs Example */}
      <div>
        <Tabs
          tabs={[
            { id: 'details', label: 'Details' },
            { id: 'itinerary', label: 'Itinerary' },
            { id: 'reviews', label: 'Reviews' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />
        
        <div className="p-4 border rounded-lg mt-4">
          {activeTab === 'details' && <div>Details content here...</div>}
          {activeTab === 'itinerary' && <div>Itinerary content here...</div>}
          {activeTab === 'reviews' && <div>Reviews content here...</div>}
        </div>
      </div>
      
      {/* Pagination Example */}
      <div>
        <div className="border rounded-lg p-4 mb-4">
          Page {currentPage} content here...
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </div>
      
      {/* Stepper Example */}
      <div>
        <Stepper
          steps={[
            { id: 'personal', label: 'Personal Info', completed: true },
            { id: 'payment', label: 'Payment Details', completed: currentStep !== 'personal' },
            { id: 'confirm', label: 'Confirmation' }
          ]}
          currentStep={currentStep}
        />
        
        <div className="p-4 border rounded-lg mt-4">
          {currentStep === 'personal' && <div>Personal info form...</div>}
          {currentStep === 'payment' && <div>Payment form...</div>}
          {currentStep === 'confirm' && <div>Confirmation details...</div>}
        </div>
      </div>
    </div>
  );
}
```

## Extending the Component System

### 1. Adding New Variants

Components like Button support variants that can be extended:

```jsx
// In src/components/ui/buttons/Button.tsx
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'text' 
  | 'glass'
  | 'accent'
  | 'danger'
  | 'success'; // New variant

const getVariantClasses = (): string => {
  switch (variant) {
    // Existing variants...
    case 'success':
      return 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400';
    default:
      return 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500';
  }
};
```

### 2. Creating Compound Components

Build new components using the existing system:

```jsx
import { Card, Badge, Button } from '../components/ui';
import LoadingImage from '../components/ui/LoadingImage';

interface DestinationCardProps {
  destination: {
    id: string;
    name: string;
    image: string;
    description: string;
    tourCount: number;
  };
  onViewTours: (id: string) => void;
}

function DestinationCard({ destination, onViewTours }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-56">
        <LoadingImage 
          src={destination.image} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{destination.name}</h3>
        </div>
        <Badge 
          variant="primary" 
          className="absolute top-4 right-4"
        >
          {destination.tourCount} Tours
        </Badge>
      </div>
      <div className="p-4">
        <p className="text-gray-700 mb-4">{destination.description}</p>
        <Button 
          variant="outline" 
          onClick={() => onViewTours(destination.id)}
          fullWidth
        >
          Explore Tours
        </Button>
      </div>
    </Card>
  );
}

export default DestinationCard;
```

### 3. Adding Component Props

Extend component functionality by adding props:

```jsx
// Adding animation props to Card component
interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  animate?: boolean; // New prop
  animationDelay?: number; // New prop
}

const Card: React.FC<CardProps> = ({ 
  className = '', 
  children, 
  hover = true, 
  glass = false,
  animate = false,
  animationDelay = 0
}) => {
  return (
    <div 
      className={`
        ${glass 
          ? 'backdrop-blur-md bg-white/80 border border-white/20' 
          : 'bg-white'
        }
        rounded-xl overflow-hidden
        ${hover ? 'card-hover' : ''}
        ${glass ? 'shadow-sm' : 'shadow-soft'}
        ${animate ? 'opacity-0 animate-fade-in-up' : ''}
        ${className}
      `}
      style={{ animationDelay: animate ? `${animationDelay}s` : undefined }}
    >
      {children}
    </div>
  );
};
```

## Best Practices

1. **Component First Development**
   - Build and update components before implementing new pages
   - Test components in isolation before integration

2. **Consistent Props Pattern**
   - Use consistent prop names across components (e.g., `className`, `variant`, `size`)
   - Provide sensible defaults for all props

3. **Composition Over New Components**
   - Combine existing components rather than creating new ones
   - Create specialized components only when necessary

4. **Maintain Theme Consistency**
   - Use the established color scheme and design patterns
   - Leverage TailwindCSS classes for consistent styling

5. **Documentation Driven**
   - Document component props and usage
   - Add examples for complex components

6. **Responsive Design**
   - Ensure all components work well on all screen sizes
   - Test on mobile, tablet, and desktop

## Advanced Usage Techniques

### Dynamic Component Rendering

```jsx
function renderDynamicComponent(type, props) {
  const components = {
    'card': Card,
    'button': Button,
    'badge': Badge,
    'input': InputField,
    // Add more components as needed
  };
  
  const Component = components[type];
  if (!Component) return null;
  
  return <Component {...props} />;
}

// Usage
const dynamicElements = [
  { type: 'card', props: { className: 'p-4 mb-4' }, content: 'Card content' },
  { type: 'button', props: { variant: 'primary' }, content: 'Click Me' }
];

function DynamicUI() {
  return (
    <div>
      {dynamicElements.map((element, index) => (
        <div key={index}>
          {renderDynamicComponent(element.type, {
            ...element.props,
            children: element.content
          })}
        </div>
      ))}
    </div>
  );
}
```

### Themed Component Variations

```jsx
const themeStyles = {
  'safari': {
    primary: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-amber-500 hover:bg-amber-600',
    accent: 'text-green-700'
  },
  'adventure': {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-orange-500 hover:bg-orange-600',
    accent: 'text-blue-700'
  },
  'corporate': {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    secondary: 'bg-gray-700 hover:bg-gray-800',
    accent: 'text-indigo-700'
  }
};

function ThemedButton({ theme = 'safari', variant = 'primary', children, ...props }) {
  const themeVariants = themeStyles[theme] || themeStyles.safari;
  const variantClass = themeVariants[variant] || '';
  
  return (
    <button 
      className={`px-4 py-2 rounded-lg text-white transition-colors ${variantClass}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

By leveraging these techniques and best practices, you can rapidly develop new features while maintaining consistency and quality throughout the application.