# InPost Codebase Analysis

## Overview
InPost is a React-based web application for generating LinkedIn posts using AI. It features user authentication, post generation with customizable parameters, dashboard analytics, and data visualization.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC plugin
- **Styling**: Tailwind CSS with Shadcn/UI components
- **State Management**: React Context (AuthContext)
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Date Handling**: date-fns

### Backend & Database
- **Backend-as-a-Service**: Supabase
  - Authentication
  - Database (PostgreSQL)
  - Edge Functions
  - Storage
- **Server**: Express.js (in `/src/server/index.js` - appears unused in production)

### Key Dependencies
- `@supabase/supabase-js`: Supabase client
- `@tanstack/react-query`: Data fetching and caching
- `@radix-ui/*`: UI component primitives
- `react-hook-form`: Form handling
- `zod`: Schema validation
- `framer-motion`: Animations
- `recharts`: Data visualization

## Architecture

### Application Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── nav/            # Navigation components
├── pages/              # Route components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── lib/                # Library configurations
├── types/              # TypeScript type definitions
└── server/             # Express server (unused)
```

### Key Components

#### Authentication System
- **AuthContext**: Manages user authentication state using Supabase Auth
- **ProtectedRoute**: HOC for route protection
- **User Profile**: Stores user data (name, email, designation, experience level, profile image)

#### Post Generation
- **PostGenerator**: Main component for creating posts
- **Parameters**:
  - Topic (with search and custom topic addition)
  - Language (English, Hinglish, etc.)
  - Tone (Professional, Casual, etc.)
  - Length (Short, Medium, Long)
  - Experience Level
  - Influencer style matching
  - Custom inclusions

#### Dashboard & Analytics
- **UserDashboard**: Main dashboard with multiple tabs
- **Analytics Components**:
  - TopicDistribution
  - PostLengthDistribution
  - PostsByMonthChart
  - ToneAnalysis
  - LanguageAnalysis
  - HashtagAnalysis
  - ActivityHeatmapChart
  - RecentPosts
  - PostsTable
  - DashboardSummary

### Data Flow

#### Post Generation Flow
1. User selects parameters in PostGenerator
2. Component calls `generatePost()` from `/utils/groq.ts`
3. `generatePost()` invokes Supabase Edge Function `generate-post`
4. Edge function uses Groq API to generate content
5. Generated post is saved via `save-generated-post` edge function
6. Post metadata stored in normalized tables

#### Dashboard Data Flow
1. Dashboard components fetch data via edge functions
2. `getUserGeneratedPosts()` retrieves posts with metadata
3. Data processed and visualized using Recharts
4. Filtering handled by `getFilteredPostsByDateRange()`

## Database Schema

### Core Tables
- **users**: User profiles (user_id SERIAL PRIMARY KEY - Note: mismatch with Supabase UUID)
- **topics**: Available topics
- **influencers**: Influencer styles
- **language**: Supported languages
- **tone**: Post tones
- **experience_level**: Experience levels
- **length**: Post lengths
- **user_topic_preference**: User-topic relationships
- **user_generated_post_meta**: Post metadata (foreign keys to all parameter tables)
- **user_generated_post**: Actual post content

### Issues Identified
1. **User ID Type Mismatch**: Database schema uses SERIAL for user_id, but Supabase Auth uses UUID. Code handles this by storing UUID in SERIAL field, which may cause issues.

## API & Edge Functions

### Supabase Edge Functions
- `get-options`: Fetch dropdown options
- `log_visitor`: Track visitor analytics
- `get-id-by-value`: Get IDs for post parameters
- `save-generated-post`: Save generated posts
- `get-user-generated-posts`: Fetch user's posts
- `get-filtered-posts`: Posts with date filtering
- `generate-post`: AI post generation using Groq

### Groq Integration
- **Prompt Engineering**: Sophisticated prompts with multiple hooks (Risky Move, Unpopular Opinion, Failure Story, etc.)
- **Fallback**: Mock post generation if API fails
- **Parameters**: Topic, length, language, tone, experience, influencer, designation

## Key Features

### Post Generation
- AI-powered LinkedIn post creation
- Customizable parameters
- Influencer style matching
- Hashtag generation
- Post saving and history

### Analytics Dashboard
- Post statistics and trends
- Topic distribution charts
- Activity heatmaps
- Hashtag analysis
- Export functionality (CSV)
- Date range filtering

### User Management
- Supabase authentication
- Profile management
- Onboarding flow
- First-time user detection

### UI/UX
- Responsive design with mobile support
- Dark/light theme support
- Toast notifications
- Loading states
- Form validation

## Configuration

### Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_KEY`: Supabase anon key

### Build Configuration
- Vite with React SWC for fast builds
- TypeScript with strict settings
- ESLint for code quality
- Tailwind CSS with custom config
- PostCSS for CSS processing

## Development Workflow

### Scripts
- `dev`: Development server
- `build`: Production build
- `build:dev`: Development build
- `lint`: ESLint checking
- `preview`: Preview production build

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Component tagging in development

## Issues & Areas for Improvement

1. **Database Schema**: User ID type inconsistency
2. **Server Code**: Express server exists but appears unused
3. **Error Handling**: Some areas lack comprehensive error handling
4. **Testing**: No visible test setup
5. **Documentation**: README is empty
6. **Type Safety**: Some areas use `any` types

## Security Considerations
- Supabase handles authentication securely
- Edge functions run server-side
- Environment variables for sensitive data
- No client-side secrets exposed

## Performance
- React Query for efficient data fetching and caching
- Lazy loading of components
- Optimized bundle with Vite
- Supabase for scalable backend

## Deployment
- Static site deployment (Vite build)
- Supabase for backend services
- Environment-based configuration

This analysis covers the core architecture, technologies, and functionality of the InPost application. The codebase demonstrates modern React development practices with a focus on user experience and data visualization.