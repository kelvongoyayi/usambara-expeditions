// Script to update comments in service files
import fs from 'fs';
import path from 'path';

const services = [
  {
    path: 'src/services/tours.service.ts',
    status: 'IMPLEMENTATION STATUS: PARTIAL',
    note: 'This service is currently using mock data but has the correct interfaces.\nIt will need to be updated to use Supabase queries when connecting to the backend.'
  },
  {
    path: 'src/services/events.service.ts',
    status: 'IMPLEMENTATION STATUS: PARTIAL',
    note: 'This service is currently using mock data but has the correct interfaces.\nIt will need to be updated to use Supabase queries when connecting to the backend.'
  },
  {
    path: 'src/services/bookings.service.ts',
    status: 'IMPLEMENTATION STATUS: PARTIAL',
    note: 'This service is currently using mock data but has the correct interfaces.\nIt will need to be updated to use Supabase queries when connecting to the backend.'
  },
  {
    path: 'src/services/destinations.service.ts',
    status: 'IMPLEMENTATION STATUS: PARTIAL',
    note: 'This service is currently using mock data but has the correct interfaces.\nIt will need to be updated to use Supabase queries when connecting to the backend.'
  },
  {
    path: 'src/services/testimonials.service.ts',
    status: 'IMPLEMENTATION STATUS: PLACEHOLDER',
    note: 'This service is currently not used in the application but the interface is needed.\nIt will be fully implemented when connecting to the backend.'
  },
  {
    path: 'src/services/storage.service.ts',
    status: 'IMPLEMENTATION STATUS: PLACEHOLDER',
    note: 'This service is currently not used in the application but the interface is needed.\nIt will be fully implemented when connecting to the backend.'
  },
  {
    path: 'src/services/profile.service.ts',
    status: 'IMPLEMENTATION STATUS: COMPLETE',
    note: 'This service is fully implemented and connects to Supabase authentication.'
  }
];

function processFile(filePath, status, note) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if this file already has the status marker
    if (content.includes('IMPLEMENTATION STATUS:')) {
      console.log(`File already has implementation status marker: ${filePath}`);
      return;
    }

    // Find the imports section end
    let lines = content.split('\n');
    let insertLine = 0;
    
    // Find the last import line
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        insertLine = i + 1;
      } else if (lines[i].trim() && !lines[i].trim().startsWith('import ') && insertLine > 0) {
        // This is the first non-empty line after imports
        break;
      }
    }

    // Add a blank line after imports if not already there
    if (lines[insertLine].trim() !== '') {
      lines.splice(insertLine, 0, '');
      insertLine++;
    }

    // Add the status comment
    lines.splice(
      insertLine, 
      0, 
      `// ${status}`,
      `// ${note.split('\n').join('\n// ')}`
    );
    
    // Add another blank line after comments
    if (lines[insertLine + 2].trim() !== '') {
      lines.splice(insertLine + 2, 0, '');
    }

    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Updated file: ${filePath}`);
  } catch (err) {
    console.error(`Error updating file: ${filePath}`, err);
  }
}

// Main execution
console.log('Updating service files with implementation status comments...');

services.forEach(service => {
  processFile(service.path, service.status, service.note);
});

console.log('Service file updates completed!');