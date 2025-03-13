# Pet Profile App - React Native Coding Test

## Overview

This is a coding test to create a pet profile application using React Native and Supabase. The application should display pet information along with their health logs in a tabbed interface.

## Requirements

### 1. UI Implementation

Modify the pet profile screen to include:

- A tabbed interface with three sections:

  1. **Weight Logs Tab**

     - Display weight measurements with dates
     - Each log should show:
       - Weight value (in kg)
       - Date of measurement
     - Include an "Add new weight log" button at the bottom

  2. **Body Condition Tab**

     - Display body condition assessments
     - Each log should show:
       - Body condition description (single word/phrase)
       - Date of assessment
     - Include an "Add new body conditions" button at the bottom

  3. **Vet Visits Tab**
     - Display veterinary visit records
     - Each log should show:
       - Visit notes (text area)
       - Date of visit
     - Include an "Add new vet visits" button at the bottom

### 2. Supabase Integration

- Create a Supabase account and set up a new project
- Create the following tables:

  ```sql
  -- Pets table
  create table pets (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    species text not null,
    breed text,
    age integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    owner_id uuid references auth.users not null
  );

  -- Weight logs table
  create table weight_logs (
    id uuid default uuid_generate_v4() primary key,
    pet_id uuid references pets not null,
    weight decimal not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Body condition logs table
  create table body_condition_logs (
    id uuid default uuid_generate_v4() primary key,
    pet_id uuid references pets not null,
    body_condition text not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Vet visit logs table
  create table vet_visit_logs (
    id uuid default uuid_generate_v4() primary key,
    pet_id uuid references pets not null,
    notes text not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null
  );
  ```

- Implement data fetching from Supabase in the application
- Handle loading and error states appropriately

### 3. Cross-Platform Compatibility

- Ensure the application works correctly on both:
  - iOS devices/simulators
  - Android devices/emulators
- Test and verify that all features work consistently across platforms

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Supabase account and project at https://supabase.com
4. Copy your Supabase project credentials
5. Create a `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```
6. Start the development server:
   ```bash
   npx expo start
   ```

## Evaluation Criteria

- Code organization and clarity
- UI implementation accuracy
- Supabase integration and data management
- Error handling and loading states
- Cross-platform compatibility
- TypeScript usage and type safety
- Git commit history and incode comments

## Submission

1. Create a new Supabase project
2. Implement the required features
3. Update this README with:
   - Any additional dependencies you've added
   - Any assumptions or decisions you've made
4. Push your code to your own repository
5. Share the repository URL

## Time Expectation

- Expected completion time: 2-4 hours

## Notes

- Feel free to use additional libraries if needed
- Comment your code where necessary
- Include error handling and loading states
- Consider edge cases and data validation
- Focus on code quality and user experience

# UPDATES

### Dependencies added in the code:

- @supabase/supabase-js
- @react-navigation/bottom-tabs
- @react-navigation/native
- @react-native-community/datetimepicker
- react-native-date-picker
- react-native-screens
- react-native-url-polyfill
- react-native-vector-icons

## Understandings and Assumptions from my behalf ot the test desc:

- Will not need to use the createPet, deletePet since there is no mentioning in the description regarding these two functions.
- Created three bottom tabs for the single added pet in the table mentioned as follows: body condition tab, weight logs tab, vet visits tab.
- User can add as much body_condition, vet_visits and weights logging as he needs and will always find the latest entry according to date, so if it in the present time or future reference, anything in the past will consider the current value.
- Adjusted the UI for the iOS and Android to be identical without any out of bounds issues.
- Handled edge cases and loading indicator before fetching for memory consumption and optimization.
- No pagination handled as there is no list to paginate over. (easy to be accomplished in case required)
- Able to test the functions in the petServices such as createPet and deletePet eventhough they are not mentioned to be used, and was successful with the credentials of Supabase.
- Hardcoded the pet uuid for the tabs (not the generation of the uuid), for fetching the body_condition, vet_visits and weights_logs since there is no navigation done only tab screens for a single pet added in the Supabase.
