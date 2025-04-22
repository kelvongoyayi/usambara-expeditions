// Cleanup script to handle unused files
import fs from 'fs';
import path from 'path';

// Files that are unused but should be kept for future implementation
const unusedButKeep = [
  'src/services/profile.service.ts', // Used in auth components
];

// Services that are unused but will be needed in the future
const unusedServices = [
  'src/services/bookings.service.ts',
  'src/services/destinations.service.ts', 
  'src/services/events.service.ts',
  'src/services/testimonials.service.ts',
  'src/services/tours.service.ts',
  'src/services/storage.service.ts'
];

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(`Error checking if file exists: ${filePath}`, err);
    return false;
  }
}

// Function to add comments to a file indicating it's currently unused
function addUnusedCommentToFile(filePath) {
  try {
    if (!fileExists(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Already has unused comment
    if (content.includes('// This service is currently not used')) {
      console.log(`File already has unused comment: ${filePath}`);
      return;
    }

    const lines = content.split('\n');
    
    // Find the first non-import, non-comment line to add our comment before
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('import') && !line.startsWith('//')) {
        insertIndex = i;
        break;
      }
    }

    lines.splice(insertIndex, 0, '// This service is currently not used in the application but the interface is needed');
    lines.splice(insertIndex + 1, 0, '// Will be implemented when connecting to the backend');
    
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Added unused comment to: ${filePath}`);

  } catch (err) {
    console.error(`Error adding unused comment to file: ${filePath}`, err);
  }
}

// Main execution
console.log('Running cleanup script for unused files...');

// Process unused services - add comments
for (const servicePath of unusedServices) {
  if (fileExists(servicePath)) {
    console.log(`Processing unused service: ${servicePath}`);
    addUnusedCommentToFile(servicePath);
  } else {
    console.log(`Service file not found: ${servicePath}`);
  }
}

// Update cleanup results
const cleanupResultsPath = 'src/cleanup-results.md';
const cleanupResults = `# Codebase Cleanup Results

## Analyzed Unused Files

The following service files were identified as unused in the codebase:

- \`src/services/bookings.service.ts\`
- \`src/services/destinations.service.ts\`
- \`src/services/testimonials.service.ts\`
- \`src/services/events.service.ts\`
- \`src/services/tours.service.ts\`
- \`src/services/storage.service.ts\`

## Files Kept

- \`src/services/profile.service.ts\` - This file is used in the authentication components and must be kept.

## Analysis Summary

The current implementation uses local data files in the \`src/data\` directory instead of connecting to a backend service. These files provide mock data for:

- Destinations 
- Events
- Tours
- Testimonials

The project is structured to easily transition to using real services in the future, at which point the data files could be replaced with actual service calls.

## UI Components

All UI components in the component library appear to be in use throughout the application. The component system is well structured and organized into categories like:

- Buttons
- Display components
- Forms
- Navigation
- Feedback

## Next Steps

1. We've kept the service files but marked them with comments indicating they're not currently used
2. When backend services are implemented in the future, update the application to use real API calls instead of mock data
3. Continue using the current pattern of UI components which is well organized and maintains good code reusability

The codebase is now more maintainable with clear documentation of which services are currently unused but will be needed in the future.
`;

fs.writeFileSync(cleanupResultsPath, cleanupResults);
console.log(`Updated cleanup results file: ${cleanupResultsPath}`);

console.log('Cleanup script completed successfully!');