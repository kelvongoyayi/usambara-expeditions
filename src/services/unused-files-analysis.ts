/**
 * Knip Analysis Results
 * 
 * This file documents the analysis of unused code in the codebase
 * based on Knip static analysis.
 */

// Unused Services
const unusedServices = [
  'src/services/bookings.service.ts',
  'src/services/destinations.service.ts', 
  'src/services/events.service.ts',
  'src/services/testimonials.service.ts',
  'src/services/tours.service.ts',
  'src/services/storage.service.ts'
];

// Services to Keep
const activeServices = [
  'src/services/profile.service.ts' // Used in auth components
];

// Unused Utilities
const unusedUtils = [];

// Active Utilities
const activeUtils = [
  'src/utils/date-utils.ts',    // Used in components
  'src/utils/migrate.ts'        // Used in migration scripts
];

/**
 * Analysis Summary:
 * 
 * 1. Service Layer
 * - Most service files are currently unused as the app uses mock data
 * - Keep profile.service.ts for auth
 * - Other services should be implemented when connecting to backend
 * - We've kept the interfaces and marked the services as unused with comments
 * 
 * 2. Utilities
 * - date-utils.ts and migrate.ts are actively used
 * 
 * 3. Data Files
 * - Current implementation uses local data files
 * - These will be replaced with service calls when backend is connected
 * 
 * 4. Components
 * - All UI components are in use
 * - Component system is well structured
 * 
 * Recommendations:
 * 1. Keep service files but mark them as unused with comments
 * 2. Keep mock data files until backend integration
 * 3. Document service interfaces for future implementation
 */

// Export analysis for reference
export const knipAnalysis = {
  unusedServices,
  activeServices,
  unusedUtils,
  activeUtils
};