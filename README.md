# Blog Dashboard

> A modern, AI-generated blog dashboard built with Next.js, TypeScript, and Sanity CMS

![Dashboard Preview](https://via.placeholder.com/800x400/2563eb/ffffff?text=Blog+Dashboard)

## 🤖 AI Disclaimer

**This entire project was developed by Claude Sonnet 4, an AI assistant created by Anthropic.** The project was created for Tinotenda Muzovaka as a demonstration of AI-powered development capabilities. While the code has been generated using advanced AI, it follows modern web development best practices and standards.

## ✨ Features

- **📝 Posts Management**: Full CRUD operations for blog posts via Sanity CMS
- **📅 Calendar View**: Visual representation of posts by publication date
- **🎯 Content Planning**: Kanban-style board for planning and organizing upcoming posts
- **� Real-Time Analytics**: Live metrics with Chart.js-powered interactive charts
- **🤖 AI-Powered Insights**: Content optimization recommendations and performance goals
- **📈 Exportable Reports**: Comprehensive reports in PDF, CSV, and JSON formats
- **�📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🔍 Advanced Search & Filter**: Multi-criteria search with saved queries
- **🏷️ Smart Tags & Categories**: AI-suggested categorization and tagging
- **⏰ Scheduled Publishing**: Automated publishing with background workflows
- **🎨 Rich Text Editor**: TipTap-powered editor with markdown support
- **� Content Templates**: Pre-built templates for different post types
- **🔧 Bulk Operations**: Manage multiple posts efficiently
- **🎯 Performance Optimization**: Image lazy loading, CDN integration, and caching

## 🛠 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity
- **Charts**: Chart.js + React Chart.js 2
- **UI Components**: Headless UI, Lucide React
- **Date Handling**: date-fns
- **Rich Text**: TipTap Editor
- **Performance**: Optimized images, lazy loading, caching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Sanity account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.template .env.local
   ```

4. **Configure your Sanity project**
   
   Edit `.env.local` with your Sanity credentials:
   ```env
   SANITY_PROJECT_ID=your_project_id_here
   SANITY_DATASET=production
   SANITY_API_VERSION=2024-03-15
   SANITY_TOKEN=your_token_here
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Sanity Setup

### Required Schema

You'll need to create a Sanity schema for blog posts. Here's the basic structure:

```javascript
// schemas/post.js
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Scheduled', value: 'scheduled'}
        ]
      },
      initialValue: 'draft'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string'
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    }
  ]
}
```

### Getting Your Credentials

1. **Project ID**: Found in your Sanity project settings
2. **Dataset**: Usually 'production' for live sites
3. **API Token**: Create a token in your Sanity project settings with read/write permissions

## 📖 Usage Guide

### Managing Posts

1. **Create New Post**: Click "New Post" button in the Posts section
2. **Edit Post**: Click the "Edit" button on any post card
3. **Delete Post**: Click the "Delete" button (with confirmation)
4. **Search Posts**: Use the search bar to find specific posts
5. **Filter Posts**: Use status filters to view drafts, published, etc.

### Content Planning

1. **Plan New Post**: Navigate to Planning section and click "Plan New Post"
2. **Track Progress**: Move posts through Planned → In Progress → Completed
3. **Set Priorities**: Mark posts as High, Medium, or Low priority
4. **Schedule Content**: Set planned publication dates

### Calendar View

- **Monthly Overview**: See all posts and planned content in calendar format
- **Status Indicators**: Different colors for published, draft, and planned content
- **Quick Navigation**: Jump to current month or navigate through dates

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SANITY_PROJECT_ID` | Your Sanity project ID | Yes |
| `SANITY_DATASET` | Dataset name (usually 'production') | Yes |
| `SANITY_API_VERSION` | API version (e.g., '2024-03-15') | No |
| `SANITY_TOKEN` | API token with read/write permissions | Yes |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public project ID for client-side | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Public dataset name | Yes |

### Customization

The dashboard is built to be generic and reusable. You can customize:

- **Branding**: Update colors, fonts, and logos in the Tailwind config
- **Schema**: Modify the Sanity schema to match your content needs  
- **Features**: Add or remove functionality based on your requirements

## 📝 Development Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic post management (CRUD)
- [x] Calendar view with post visualization
- [x] Content planning with Kanban board
- [x] Responsive design
- [x] Sanity CMS integration

### Phase 2: Enhanced Features ✅
- [x] Rich text editor with TipTap integration
- [x] Image upload and management with optimization
- [x] Bulk post operations and multi-select
- [x] Advanced search and filtering with saved queries
- [x] Post templates and categories
- [x] Scheduled publishing with automation
- [x] Performance optimization and caching
- [x] SEO tools and meta management

### Phase 3: Analytics & Insights �
- [x] Analytics dashboard with mock data
- [ ] Real-time performance metrics integration
- [ ] Traffic and engagement tracking
- [ ] Content performance insights
- [ ] Exportable reports and data visualization
- [ ] Author collaboration analytics

### Phase 4: Advanced Features 🔮
- [ ] Multi-author support
- [ ] Comment management
- [ ] Newsletter integration
- [ ] Social media scheduling
- [ ] Content AI suggestions
- [ ] Advanced workflow automation

## 🎨 Suggested Project Names

Here are some abstract name suggestions for this project:

1. **Quill** - Simple, writing-focused
2. **Prism** - Reflects the multi-faceted nature of content management
3. **Nexus** - Connection point for all your content needs
4. **Canvas** - A blank slate for creativity
5. **Flux** - Continuous flow of content
6. **Zen Dashboard** - Calm, organized content management
7. **Echo** - Your voice amplified
8. **Orbit** - Everything revolves around your content
9. **Spark** - Ignite your creativity
10. **Tide** - Ebb and flow of content creation

## � Documentation

### Core Guides
- **[Performance Guide](PERFORMANCE.md)** - Comprehensive performance optimization guide
- **[Development Roadmap](ROADMAP.md)** - Detailed development phases and milestones
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Copilot Instructions](.github/copilot-instructions.md)** - AI-powered development guidelines

### API Documentation
The project includes well-documented API utilities:
- **Sanity Integration** - Complete CMS integration with type safety
- **Performance Optimization** - Caching, pagination, and request deduplication
- **Error Handling** - Comprehensive error states and fallbacks

### Component Library
All components are built with:
- **TypeScript** - Full type safety and IntelliSense support
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Performance** - Lazy loading, memoization, and optimization
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## �🐛 Troubleshooting

### Common Issues

**Posts not loading**
- Check your Sanity credentials in `.env.local`
- Verify your Sanity project is accessible
- Ensure your API token has the correct permissions

**Calendar events not showing**
- Make sure posts have `publishedAt` dates
- Check that planned posts are being saved to localStorage
- Verify date formatting in your data

**Styling issues**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Verify all required dependencies are installed

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment configuration
3. Review the Sanity project setup
4. Check the project's GitHub issues (if available)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Claude Sonnet 4** - AI assistant that created this entire project
- **Tinotenda Muzovaka** - Project owner and visionary
- **Next.js Team** - For the amazing React framework
- **Sanity** - For the flexible content management system
- **Tailwind CSS** - For the utility-first CSS framework

---

**Built with ❤️ by AI for the future of content management**
