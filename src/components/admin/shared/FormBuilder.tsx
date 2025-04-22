import React from 'react';
import { InputField, TextareaField, SelectField, CheckboxField } from '../../ui/forms';
import { Upload, X, Plus, Link } from 'lucide-react';

// Field Types
export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'array';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  icon?: React.ReactNode;
  helpText?: string;
  colSpan?: 'full' | 'half';
}

interface FormBuilderProps {
  fields: FormField[];
  values: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleArrayChange?: (name: string, index: number, value: string) => void;
  addArrayItem?: (name: string) => void;
  removeArrayItem?: (name: string, index: number) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  values,
  errors,
  handleChange,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {fields.map((field) => (
        <div
          key={field.name}
          className={`${
            field.colSpan === 'full' ? 'lg:col-span-2' : field.colSpan === 'half' ? '' : 'lg:col-span-2'
          }`}
        >
          {field.type === 'textarea' ? (
            <TextareaField
              label={field.label}
              name={field.name}
              value={values[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              error={errors[field.name]}
              rows={4}
            />
          ) : field.type === 'select' && field.options ? (
            <SelectField
              label={field.label}
              name={field.name}
              options={field.options}
              value={values[field.name] || ''}
              onChange={(value) => {
                handleChange({
                  target: {
                    name: field.name,
                    value
                  }
                } as React.ChangeEvent<HTMLSelectElement>);
              }}
              required={field.required}
              error={errors[field.name]}
              icon={field.icon}
            />
          ) : field.type === 'checkbox' ? (
            <CheckboxField
              label={field.label}
              name={field.name}
              checked={!!values[field.name]}
              onChange={(e) => {
                handleChange({
                  target: {
                    name: field.name,
                    checked: e.target.checked,
                    value: e.target.checked,
                    type: 'checkbox'
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              error={errors[field.name]}
            />
          ) : field.type === 'array' && handleArrayChange && addArrayItem && removeArrayItem ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {Array.isArray(values[field.name]) && values[field.name].map((item: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(field.name, index, e.target.value)}
                    placeholder={field.placeholder}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(field.name, index)}
                    className="ml-2 p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem(field.name)}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add {field.label.toLowerCase()}
              </button>
              
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ) : (
            <InputField
              label={field.label}
              name={field.name}
              type={field.type}
              value={values[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              error={errors[field.name]}
              icon={field.icon}
              helperText={field.helpText}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FormBuilder;