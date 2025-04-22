import { useState } from 'react';

export interface FAQ {
  question: string;
  answer: string;
}

const useFaqEditor = (initialFaqs: FAQ[] = []) => {
  const [faqs, setFaqs] = useState<FAQ[]>(
    initialFaqs.length > 0 
      ? initialFaqs 
      : [{ question: '', answer: '' }]
  );

  // Add a new FAQ
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };
  
  // Remove an FAQ
  const removeFaq = (index: number) => {
    if (faqs.length <= 1) return;
    
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };
  
  // Update an FAQ
  const handleFaqChange = (index: number, field: keyof FAQ, value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };
  
  return {
    faqs,
    setFaqs,
    addFaq,
    removeFaq,
    handleFaqChange
  };
};

export default useFaqEditor;