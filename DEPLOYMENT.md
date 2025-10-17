# Vue Calendar App - Deployment Guide

## 🚀 Vercel Deployment

This Vue Calendar App is optimized for deployment on Vercel with Supabase as the backend.

### Prerequisites

1. **Supabase Project**: Ensure your Supabase project is set up with the database schema
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Push your code to GitHub

### Environment Variables

Set these environment variables in your Vercel dashboard:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the `database-setup.sql` script to create the events table and policies

### Deployment Steps

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   - In Project Settings > Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Set them for Production, Preview, and Development

3. **Deploy**:
   - Vercel will automatically detect this as a Vite project
   - The build command `npm run build` will be used
   - The output directory `dist` will be served

### Build Optimization

The project is optimized with:

- **Code Splitting**: Separate chunks for Vue, Calendar, and Supabase libraries
- **Tree Shaking**: Unused code is eliminated
- **Minification**: ESBuild for fast, efficient minification
- **Gzip Compression**: Assets are compressed for faster loading
- **Caching**: Static assets are cached for 1 year

### Performance Features

- **Lazy Loading**: Calendar components load only when needed
- **Optimized Supabase Client**: Disabled unnecessary features for better performance
- **Efficient State Management**: Computed properties for reactive updates
- **Error Handling**: Graceful fallback to local storage if Supabase fails

### Security Headers

The app includes security headers:

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Monitoring

- Check Vercel Analytics for performance metrics
- Monitor Supabase usage in the dashboard
- Use browser dev tools to verify performance

### Troubleshooting

1. **Database Connection Issues**:
   - Verify environment variables are set correctly
   - Check Supabase project is active
   - Ensure RLS policies allow public access

2. **Build Failures**:
   - Check Node.js version (requires 20.19.0+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

3. **Runtime Errors**:
   - Check browser console for errors
   - Verify Supabase client initialization
   - Test with local storage fallback

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Database schema deployed to Supabase
- [ ] RLS policies configured for public access
- [ ] Build completes without errors
- [ ] App loads and functions correctly
- [ ] Events can be created, edited, and deleted
- [ ] Calendar displays events properly
- [ ] Responsive design works on mobile

### Support

For issues or questions:

1. Check the browser console for errors
2. Verify Supabase connection in the network tab
3. Test with the provided test files
4. Review the FIXES.md file for common solutions
