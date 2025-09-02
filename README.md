# Brandcard

A light, mobile-friendly web app that generates on-brand images from simple inputs. Create beautiful social media posts, blog headers, and marketing materials in seconds.

## Features

### Core Features
- **Template Editor Lite** - Create custom templates with text and image fields
- **Template Library** - 10+ preset templates for common use cases
- **Rendering Engine** - Server-side image generation using `@vercel/og`
- **Storage & Sharing** - Save to Supabase Storage with share and download links
- **Accounts & Billing** - Supabase Auth and Stripe subscriptions

### Breakout Features
- **Shareable Template Forms** - Public links for templates with optional passwords
- **Smart Fill** - AI-powered content generation from simple prompts
- **URL to Image** - Extract Open Graph data from URLs to prefill templates
- **Slack Integration** - Generate images directly from Slack slash commands
- **Platform Pack** - Generate all social media sizes in one click

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, React Server Components
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: Supabase (Postgres, Auth, Storage)
- **Payments**: Stripe Checkout and customer portal
- **Image Generation**: `@vercel/og`
- **AI**: OpenAI API for Smart Fill
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)
- OpenAI API key (for Smart Fill)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd brandcard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
   
   # LLM Configuration
   LLM_API_KEY=your_openai_api_key_here
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `prisma/schema.sql` in the Supabase SQL editor
   - Create storage buckets: `renders`, `fonts`, `logos`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
brandcard/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── templates/         # Template management
│   └── t/                 # Public template forms
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── editor/           # Template editor components
│   └── forms/            # Form components
├── lib/                  # Utility libraries
│   ├── og/               # Image generation utilities
│   └── supabase/         # Database client
├── prisma/               # Database schema
└── scripts/              # Utility scripts
```

## API Routes

- `POST /api/render` - Generate single image
- `POST /api/render/pack` - Generate platform pack
- `POST /api/smartfill` - AI content generation
- `POST /api/url2image` - Extract OG data from URL
- `POST /api/slack/command` - Slack slash command
- `POST /api/webhooks/stripe` - Stripe webhook

## Database Schema

The app uses Supabase with the following main tables:
- `users` - User accounts
- `brand_kits` - Brand styling and assets
- `templates` - Template definitions
- `renders` - Generated images
- `subscriptions` - Stripe subscription data

## Deployment

### Vercel Deployment

1. **Connect to GitHub**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Set environment variables**
   - Add all environment variables in Vercel dashboard
   - Set `NEXT_PUBLIC_APP_URL` to your Vercel domain

3. **Deploy**
   - Vercel will automatically deploy on push to main branch

### Supabase Setup

1. **Create project** in Supabase dashboard
2. **Run SQL schema** from `prisma/schema.sql`
3. **Create storage buckets**:
   - `renders` (public)
   - `fonts` (public) 
   - `logos` (public)
4. **Configure RLS policies** as defined in schema

## Usage

### Creating Templates

1. Navigate to `/templates/new`
2. Set template dimensions and name
3. Add text and image fields
4. Save template

### Using Public Forms

1. Share template via `/t/{templateId}`
2. Users can fill out form and generate images
3. Images are automatically saved and shared

### Smart Fill

1. Enter a brief description of your content
2. AI generates appropriate headlines, subheads, and CTAs
3. Respects field length limits and brand guidelines

### Platform Pack

1. Generate one template in multiple social media sizes
2. Automatic text fitting and contrast checking
3. Download all sizes or individual images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@brandcard.com or create an issue in the GitHub repository.