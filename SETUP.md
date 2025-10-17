# Vue Calendar App - Setup Guide

This Vue.js calendar application with Supabase integration is now fully functional! Here's how to set it up and use it.

## 🚀 Quick Start

### Option 1: Use with Local Storage (No Database Setup Required)

The app works out of the box with local storage. Just run:

```bash
npm install
npm run dev
```

### Option 2: Use with Supabase Database (Recommended)

#### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

#### 2. Set Up Environment Variables

1. Copy `env.local` to `.env`:

   ```bash
   cp env.local .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

#### 3. Set Up the Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Run the SQL script

#### 4. Install and Run

```bash
npm install
npm run dev
```

## ✨ Features

### ✅ Fully Working Features

- **Event Creation**: Add new events with title, start/end dates, and colors
- **Event Editing**: Click on any event to edit its details
- **Event Deletion**: Delete events with confirmation
- **Drag & Drop**: Drag events to reschedule them
- **Event Resizing**: Resize events by dragging their edges
- **Multiple Views**: Month, week, day, and list views
- **Real-time Updates**: Changes sync immediately with the database
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Visual feedback during operations
- **Responsive Design**: Works on desktop and mobile

### 🎨 UI Features

- Modern, gradient-based design
- Smooth animations and transitions
- Color-coded events
- Toast notifications for success/error messages
- Loading indicators
- Responsive layout

## 🛠️ Technical Details

### Database Schema

The app uses a simple `events` table with the following structure:

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  start TIMESTAMPTZ NOT NULL,
  end TIMESTAMPTZ,
  color TEXT DEFAULT '#3788d8',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Fallback System

- If Supabase is not configured, the app automatically falls back to localStorage
- All features work the same way regardless of the storage method
- Console messages indicate which storage method is being used

### Error Handling

- Form validation (required fields, date validation)
- Network error handling
- User-friendly error messages
- Automatic retry mechanisms

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linters
- `npm run format` - Format code

### Project Structure

```
src/
├── components/
│   └── CalendarComponent.vue  # Main calendar component
├── lib/
│   └── supabaseClient.ts      # Supabase client with fallback
├── App.vue                    # Root component
└── main.ts                    # Application entry point
```

## 🐛 Troubleshooting

### Common Issues

1. **Events not saving**: Check if Supabase credentials are correct in `.env`
2. **Database errors**: Ensure the database schema is set up correctly
3. **CORS issues**: Make sure your Supabase project allows your domain
4. **Local storage issues**: Clear browser storage if events aren't loading

### Debug Mode

Check the browser console for detailed logs:

- ✅ Green messages indicate successful operations
- ⚠️ Yellow messages indicate warnings (like fallback to localStorage)
- ❌ Red messages indicate errors

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
