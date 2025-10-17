# Vue.js Calendar App with Supabase

A modern, responsive calendar application built with Vue.js 3, TypeScript, and Supabase for event management.

## Features

- 📅 **Interactive Calendar**: Full-featured calendar with month, week, and day views
- 🎨 **Modern UI**: Beautiful, responsive design with gradient backgrounds and smooth animations
- ✨ **Event Management**: Create, edit, delete, and drag-and-drop events
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🗄️ **Database Integration**: Real-time data persistence with Supabase
- 🎯 **Event Views**: Switch between calendar and list views
- 🎨 **Color Coding**: Customizable event colors for better organization

## Tech Stack

- **Frontend**: Vue.js 3 with TypeScript
- **Calendar**: FullCalendar.js
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Styling**: CSS3 with modern gradients and animations

## Prerequisites

- Node.js (v20.19.0 or higher)
- npm or yarn
- Supabase account

## Environment Setup

1. Copy the environment example file:

   ```bash
   cp env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Supabase Database Setup

Create a table named `events` with the following schema:

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  start TIMESTAMPTZ NOT NULL,
  "end" TIMESTAMPTZ,
  color TEXT DEFAULT '#3788d8'
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on events" ON events
  FOR ALL USING (true);
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/marlounadela/calendar-app-vue-db.git
   cd calendar-app-vue-db
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Deployment

### Vercel Deployment

This project is configured for easy deployment on Vercel:

1. **Connect to Vercel**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add your Supabase credentials in Vercel's environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy**: Vercel will automatically build and deploy your app

The `vercel.json` configuration file is already set up with:

- Build command: `npm run build`
- Output directory: `dist`
- SPA routing support

### Manual Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service

## Project Structure

```
src/
├── components/
│   └── CalendarComponent.vue    # Main calendar component
├── lib/
│   └── supabaseClient.ts        # Supabase configuration
├── App.vue                      # Root component
└── main.ts                      # Application entry point
```

## Features in Detail

### Calendar Views

- **Month View**: Traditional monthly calendar grid
- **Week View**: Detailed weekly schedule
- **Day View**: Hourly day schedule
- **Events List**: Alternative list view of all events

### Event Management

- **Create Events**: Click on dates or use the "Add Event" button
- **Edit Events**: Click on existing events to modify them
- **Delete Events**: Remove events with confirmation
- **Drag & Drop**: Move events between dates
- **Resize Events**: Adjust event duration by dragging edges

### Responsive Design

- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts for different screen sizes
- Optimized for both desktop and mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Vue.js and Supabase
