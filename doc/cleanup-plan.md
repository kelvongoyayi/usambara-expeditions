# Codebase Cleanup Plan

## Current Status

After performing a detailed knip analysis and manual code review, we have determined:

1. **Services Layer**:
   - All service files have interfaces that match our database schema
   - Most services are partially implemented, using mock data rather than backend connections
   - These files should be kept but better documented

2. **Mock Data Files**:
   - Files in `src/data` provide mock data currently used by the services
   - These files will eventually be replaced once services connect to Supabase

3. **Unused Utilities**:
   - Some utility functions may exist that aren't being actively used

## Implementation Path

### Phase 1: Documentation ✅

- Added clear documentation to service files indicating implementation status
- Created implementation analysis report for future reference

### Phase 2: Connect Services to Supabase

Priority order for implementation:
1. Tours service - Critical for main functionality
2. Events service - Critical for main functionality
3. Bookings service - Needed for reservation system
4. Destinations service - Needed for location data
5. Testimonials service - Lower priority
6. Storage service - Can leverage existing file upload functionality

Implementation steps for each service:
1. Connect to Supabase client
2. Replace mock data with database queries
3. Implement proper error handling
4. Add loading states to UI components
5. Update unit tests

### Phase 3: Cleanup After Implementation

Once services are connected to Supabase:
1. Remove mock data files in `src/data`
2. Update service imports to ensure they're used consistently
3. Run final knip analysis to catch any remaining unused code
4. Remove temporary documentation comments

## Code Quality Guidelines

When implementing the services:

1. **Error Handling**:
   - Use try/catch blocks consistently
   - Provide meaningful error messages
   - Use toast notifications for user-facing errors

2. **Type Safety**:
   - Leverage TypeScript generated types from the database schema
   - Ensure type safety throughout service and component code

3. **Performance**:
   - Use appropriate Supabase queries (avoid overfetching)
   - Implement data caching where appropriate
   - Optimize image loading and storage

4. **Security**:
   - Follow Row-Level Security best practices
   - Never expose sensitive data in client code
   - Validate inputs before sending to the database

## Migration Testing Plan

For each service implementation:

1. Create a test plan with specific scenarios
2. Test both happy path and error cases
3. Verify data consistency between mock and real data
4. Test performance with larger datasets
5. Conduct user testing for critical flows

## Timeline Recommendation

Based on the current implementation priorities:

1. Tours & Events Services: 1-2 weeks
2. Bookings & Destinations Services: 1-2 weeks
3. Testimonials & Storage Services: 1 week
4. Final testing and cleanup: 1 week

Total estimated time: 4-6 weeks