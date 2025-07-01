# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a modern blog dashboard built with Next.js 15, TypeScript, and Tailwind CSS. The application integrates with Sanity CMS for content management and includes the following key features:

### Core Features
- **Posts Management**: CRUD operations for blog posts
- **Calendar View**: Visual representation of posts by publication date
- **Post Planning**: Content planning and scheduling interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity
- **UI Components**: Headless UI, Lucide React
- **Date Handling**: date-fns

## Coding Guidelines

### General Principles
- Use TypeScript strict mode and proper type definitions
- Follow React Server Components pattern where applicable
- Implement proper error handling and loading states
- Use semantic HTML and accessible components
- Prioritize performance and SEO optimization

### Component Structure
- Use functional components with hooks
- Implement proper prop typing with TypeScript interfaces
- Create reusable components in the `components` directory
- Use client components only when necessary (interactivity)

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography scale
- Use CSS Grid and Flexbox for layouts
- Implement dark mode support where appropriate

### Sanity Integration
- Use environment variables for Sanity configuration
- Implement proper data fetching patterns
- Handle loading and error states for CMS data
- Use Sanity's TypeScript types when available

### File Organization
- Group related components and utilities
- Use barrel exports (index.ts) for clean imports
- Place types in dedicated type definition files
- Organize API routes logically in the `app/api` directory

### Performance Considerations
- Implement proper caching strategies
- Optimize images and assets
- Use dynamic imports for code splitting
- Minimize client-side JavaScript bundle size

## Development Workflow
- Run development server with `npm run dev`
- Use ESLint and TypeScript for code quality
- Test components in isolation when possible
- Follow Git conventional commit messages

## Notes
- This project is designed to be generic and reusable
- Avoid hardcoding personal information
- Include proper documentation and examples
- Maintain clean, readable code with meaningful variable names
