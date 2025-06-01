# Fausto Zamparelli - Personal Portfolio

Welcome to my personal portfolio website! This is a modern, responsive web application built with Next.js that showcases my work, interests, and personal journey.

## 🌐 Live Website

Visit the live site at **[faustozamparelli.com](https://faustozamparelli.com)**

## ✨ Features

This portfolio includes several unique sections that represent different aspects of my life:

### 🏠 Homepage

- Personal introduction with profile photo
- Quick navigation to all sections
- All-time favorites showcase (Projects, Movies, Books, Music)
- Social media links integration

### 📂 Main Sections

- **Projects**: Coding projects and open-source contributions
- **Resume**: Professional experience, skills, and education
- **Lifetime Roadmap**: Personal achievements and future goals
- **Media Log**: Favorite films with ratings and reviews
- **Music Collection**: Favorite artists, albums, and songs
- **Book Shelf**: Books that have influenced my thinking
- **Hobbies**: Interests and activities outside of work

### 🎨 Features

- **Dark/Light Mode**: Theme toggle with system preference detection
- **Responsive Design**: Optimized for all device sizes
- **Interactive Modals**: Detailed stats and reviews for media content
- **Modern UI Components**: Built with Radix UI and shadcn/ui
- **Smooth Animations**: Page transitions and hover effects
- **Statistics Tracking**: Personal stats for books, movies, and music

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.2.4** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **shadcn/ui** - Beautiful UI components

### Additional Libraries

- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Chart.js & Recharts** - Data visualization
- **Next Themes** - Theme management
- **Date-fns** - Date utilities
- **Sonner** - Toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://127.0.0.1:3000](http://127.0.0.1:3000)

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── books/             # Books section
│   ├── hobbies/           # Hobbies section
│   ├── media/             # Media/movies section
│   ├── music/             # Music section
│   ├── projects/          # Projects showcase
│   ├── resume/            # Resume/CV page
│   ├── roadmap/           # Personal roadmap
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── navigation.tsx    # Navigation component
│   ├── socials.tsx       # Social media links
│   └── *-modal.tsx       # Various modal components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🎨 Customization

### Theming

The app supports both light and dark modes using `next-themes`. The theme toggle is available in the navigation bar.

### Content Updates

- **Personal info**: Update `app/page.tsx`
- **Projects**: Modify the `favoriteProjects` array in `app/page.tsx`
- **Media content**: Update respective data files in `app/data/`
- **Styling**: Customize colors in `tailwind.config.ts`

### Adding New Sections

1. Create a new directory in `app/`
2. Add a `page.tsx` file for the route
3. Update navigation in `components/navigation.tsx`
4. Add corresponding card in homepage

## 🌍 Deployment

This project is optimized for deployment on Vercel, but can be deployed on any platform that supports Next.js.

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure build settings (usually auto-detected)
3. Deploy!

### Other Platforms

1. Build the project: `pnpm build`
2. Start the server: `pnpm start`
3. The app will be available on port 3000

## 📧 Contact

Feel free to reach out if you have any questions or suggestions!

- **Website**: [faustozamparelli.com](https://faustozamparelli.com)
- **GitHub**: [github.com/faustozamparelli](https://github.com/faustozamparelli)
- **Email**: Available through the contact form on my website

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by Fausto Zamparelli**
