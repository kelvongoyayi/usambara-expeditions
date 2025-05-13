import React, { useEffect, useState } from "react";
import { MapPin, Clock, DollarSign, Sun, Mountain, Users, HomeIcon, Star, Check, ChevronsUpDown, AlertTriangle } from "lucide-react";
import { InputField, TextareaField, SelectField, Button, CheckboxField } from "../../../../components/ui";
import DetailsPanelLayout from "../../shared/DetailsPanelLayout";
import { destinationsService } from "../../../../services/destinations.service";

// Define the Tour type inline to avoid import issues
interface Tour {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category?: string;
  location?: string;
  duration?: number | string;
  min_group_size?: number;
  max_group_size?: number;
  difficulty?: string;
  best_season?: string;
  accommodation_type?: string;
  destination_id?: string;
  start_location?: string;
  end_location?: string;
  status?: string;
  [key: string]: any;
}

// Define FormErrors type inline
type FormErrors = Record<string, string>;

interface BasicInfoStepProps {
  formValues: any;
  onChange: (values: any) => void;
  errors: FormErrors;
  onValidation?: (isValid: boolean) => void;
}

const categoryOptions = [
  { value: "hiking", label: "Hiking" },
  { value: "cycling", label: "Cycling" },
  { value: "cultural", label: "Cultural" },
  { value: "4x4", label: "4x4 Expedition" },
  { value: "motocamping", label: "Motocamping" },
  { value: "school", label: "School Tours" },
];

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "challenging", label: "Challenging" },
  { value: "difficult", label: "Difficult" },
];

const seasonOptions = [
  { value: "all_year", label: "All Year" },
  { value: "dry_season", label: "Dry Season" },
  { value: "green_season", label: "Green Season" },
];

const accommodationOptions = [
  { value: "camping", label: "Camping" },
  { value: "lodge", label: "Lodge" },
  { value: "hotel", label: "Hotel" },
  { value: "mixed", label: "Mixed" },
];

// Define Destination type inline to avoid import issues
interface Destination {
  id: string;
  name: string;
  [key: string]: any;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formValues,
  onChange,
  errors,
  onValidation,
}) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  useEffect(() => {
    async function fetchDestinations() {
      setLoadingDestinations(true);
      try {
        const data = await destinationsService.getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setDestinations([]);
      } finally {
        setLoadingDestinations(false);
      }
    }

    fetchDestinations();
  }, []);

  useEffect(() => {
    const hasRequiredFields =
      formValues.title &&
      formValues.duration &&
      formValues.price &&
      formValues.description &&
      formValues.location;

    if (onValidation) {
      onValidation(hasRequiredFields);
    }
  }, [formValues, onValidation]);

  const handleChange = (field: string, value: any) => {
    // Ensure numeric fields are properly converted
    if (field === 'price' || field === 'min_group_size' || field === 'max_group_size') {
      const numValue = parseFloat(value);
      value = isNaN(numValue) ? 0 : numValue;
    }
    
    // Generate slug when title changes
    if (field === 'title' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      onChange({
        ...formValues,
        [field]: value,
        slug
      });
    } else {
      onChange({
        ...formValues,
        [field]: value
      });
    }
  };

  const validateDifficulty = (value: string) => {
    const validOptions = ['easy', 'moderate', 'challenging'];
    return validOptions.includes(value) ? value : 'moderate';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <DetailsPanelLayout title="General Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="col-span-1 md:col-span-2">
            <InputField
              label="Tour Title"
              id="title"
              name="title"
              value={formValues.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter tour title"
              error={errors.title}
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <TextareaField
              label="Description"
              id="description"
              name="description"
              value={formValues.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter tour description"
              className="min-h-24 sm:min-h-32"
              error={errors.description}
              required
            />
          </div>

          <div>
            <InputField
              label="Duration"
              id="duration"
              name="duration"
              value={formValues.duration || ""}
              onChange={(e) => handleChange("duration", e.target.value)}
              placeholder="e.g. 7 days, 6 nights"
              error={errors.duration}
              required
              icon={<Clock size={16} />}
            />
          </div>

          <div>
            <InputField
              label="Price (USD)"
              id="price"
              name="price"
              type="number"
              value={formValues.price || ""}
              onChange={(e) => handleChange("price", parseFloat(e.target.value))}
              placeholder="e.g. 599"
              error={errors.price}
              required
              icon={<DollarSign size={16} />}
            />
          </div>

          <div>
            <InputField
              label="Min Group Size"
              id="min_group_size"
              name="min_group_size"
              type="number"
              value={formValues.min_group_size || ""}
              onChange={(e) => handleChange("min_group_size", parseInt(e.target.value))}
              placeholder="e.g. 2"
              error={errors.min_group_size}
              icon={<Users size={16} />}
            />
          </div>

          <div>
            <InputField
              label="Max Group Size"
              id="max_group_size"
              name="max_group_size"
              type="number"
              value={formValues.max_group_size || ""}
              onChange={(e) => handleChange("max_group_size", parseInt(e.target.value))}
              placeholder="e.g. 12"
              error={errors.max_group_size}
              icon={<Users size={16} />}
            />
          </div>

          <div>
            <SelectField
              label="Category"
              name="category"
              options={categoryOptions}
              value={formValues.category || ""}
              onChange={(value) => handleChange("category", value)}
              error={errors.category}
              placeholder="Select category"
              required
            />
          </div>

          <div>
            <SelectField
              label="Difficulty Level"
              name="difficulty"
              options={difficultyOptions}
              value={formValues.difficulty || ""}
              onChange={(value) => handleChange("difficulty", validateDifficulty(value))}
              placeholder="Select difficulty"
              icon={<Mountain size={16} />}
            />
          </div>

          <div>
            <SelectField
              label="Best Season"
              name="season"
              options={seasonOptions}
              value={formValues.season || ""}
              onChange={(value) => handleChange("season", value)}
              placeholder="Select season"
              icon={<Sun size={16} />}
            />
          </div>

          <div>
            <SelectField
              label="Accommodation Type"
              name="accommodation_type"
              options={accommodationOptions}
              value={formValues.accommodation_type || ""}
              onChange={(value) => handleChange("accommodation_type", value)}
              placeholder="Select accommodation"
              icon={<HomeIcon size={16} />}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center space-x-2 pt-2 sm:pt-4">
            <CheckboxField
              label="Feature on homepage"
              name="featured"
              checked={formValues.featured || false}
              onChange={(e) => handleChange("featured", e.target.checked)}
            />
          </div>
        </div>
      </DetailsPanelLayout>

      <DetailsPanelLayout title="Location">
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div>
            <SelectField
              label="Primary Location"
              name="location"
              options={destinations.map(dest => ({ value: dest.name, label: dest.name }))}
              value={formValues.location || ""}
              onChange={(value) => handleChange("location", value)}
              error={errors.location}
              placeholder={loadingDestinations ? "Loading destinations..." : "Select destination"}
              required
              icon={<MapPin size={16} />}
            />
          </div>

          <div>
            <InputField
              label="Start Location"
              id="start_location"
              name="start_location"
              value={formValues.start_location || ""}
              onChange={(e) => handleChange("start_location", e.target.value)}
              placeholder="Tour start location"
              icon={<MapPin size={16} />}
            />
          </div>

          <div>
            <InputField
              label="End Location"
              id="end_location"
              name="end_location"
              value={formValues.end_location || ""}
              onChange={(e) => handleChange("end_location", e.target.value)}
              placeholder="Tour end location"
              icon={<MapPin size={16} />}
            />
          </div>
        </div>
      </DetailsPanelLayout>

      {/* Validation Alert */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 sm:px-4 py-2 sm:py-3 rounded flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 text-amber-500" />
          <span className="text-sm">
            Please fill in all required fields marked with an asterisk (*).
          </span>
        </div>
      )}
      
      {/* Success Message */}
      {formValues.title && formValues.description && formValues.price && formValues.duration && formValues.location && formValues.category && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-3 sm:px-4 py-2 sm:py-3 rounded flex items-center">
          <Check className="w-5 h-5 mr-2 flex-shrink-0 text-green-500" />
          <span className="text-sm">
            Basic information looks good! You can now move to the next step.
          </span>
        </div>
      )}
    </div>
  );
};

export default BasicInfoStep; 