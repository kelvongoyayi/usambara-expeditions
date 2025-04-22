import { useState } from 'react';

export interface FormField {
  name: string;
  initialValue: any;
  required?: boolean;
  validator?: (value: any) => string | undefined;
}

export const useFormFields = <T extends Record<string, any>>(initialFields: FormField[]) => {
  // Initialize form values from fields
  const initialValues = initialFields.reduce((acc, field) => {
    acc[field.name] = field.initialValue;
    return acc;
  }, {} as T);
  
  // State for form values and errors
  const [values, setValues] = useState<T>(initialValues as T);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox differently
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setValues(prev => ({ ...prev, [name]: target.checked }));
    } else if (type === 'number') {
      setValues(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle array field change (for arrays of strings)
  const handleArrayChange = (arrayName: string, index: number, value: string) => {
    setValues(prev => {
      const array = [...(prev[arrayName] || [])];
      array[index] = value;
      return { ...prev, [arrayName]: array };
    });
  };
  
  // Add item to array
  const addArrayItem = (arrayName: string) => {
    setValues(prev => {
      const array = [...(prev[arrayName] || []), ''];
      return { ...prev, [arrayName]: array };
    });
  };
  
  // Remove item from array
  const removeArrayItem = (arrayName: string, index: number) => {
    setValues(prev => {
      const array = [...(prev[arrayName] || [])];
      array.splice(index, 1);
      return { ...prev, [arrayName]: array };
    });
  };
  
  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    initialFields.forEach(field => {
      // Check required fields
      if (field.required && (values[field.name] === undefined || values[field.name] === null || values[field.name] === '')) {
        newErrors[field.name] = `${field.name} is required`;
        isValid = false;
      }
      
      // Run custom validator if provided
      if (field.validator) {
        const error = field.validator(values[field.name]);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues as T);
    setErrors({});
  };
  
  // Set a specific field value
  const setFieldValue = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    validateForm,
    resetForm,
    setFieldValue
  };
};

export default useFormFields;