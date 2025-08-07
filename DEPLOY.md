# Aurelia Galleria Mockup Generator - Coolify Deployment Guide

## 🚀 Quick Deploy to Coolify

### 1. Add Your Repository to Coolify
1. In Coolify, go to **Projects** → **Create New Project**
2. Connect your Git repository containing this code
3. Select **Docker** as the build method

### 2. Environment Variables
Set the following **Build Environment Variable** in Coolify:

```
VITE_REPLICATE_API_TOKEN=your_actual_replicate_api_token_here
```

### 3. Deploy Settings
- **Port**: `80` (automatically detected)
- **Health Check**: Enabled (built-in)
- **Build Pack**: Docker
- **Dockerfile**: `Dockerfile` (root of repository)

### 4. Domain Configuration
- Set your custom domain in Coolify
- SSL will be automatically configured

## 🔧 Technical Details

### Docker Configuration
- **Multi-stage build** for optimized production image
- **nginx:alpine** for lightweight production server
- **Built-in health checks** for Coolify monitoring
- **Gzip compression** enabled
- **Security headers** configured
- **Static asset caching** optimized

### Application Features
- ✅ **FLUX Pro Integration** - Using `black-forest-labs/flux-pro`
- ✅ **10 Mockup Types** - Samsung Frame TV, lifestyle, instructional graphics
- ✅ **Real-time Generation** - Live progress tracking
- ✅ **Professional UI** - Aurelia Galleria branding
- ✅ **Responsive Design** - Works on all devices
- ✅ **Download Management** - Individual and bulk downloads

### API Configuration
The app automatically detects your Replicate API token and:
- Shows "**Detected - Using FLUX Pro for generation**" when configured
- Falls back to demo mode when no token is provided
- Handles all API errors gracefully with user-friendly messages

## 📋 Deployment Checklist

- [ ] Repository connected to Coolify
- [ ] `VITE_REPLICATE_API_TOKEN` environment variable set
- [ ] Domain configured (optional)
- [ ] SSL enabled (automatic)
- [ ] Health checks passing
- [ ] Test mockup generation with real API key

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Test with Docker
docker build --build-arg VITE_REPLICATE_API_TOKEN=your_token -t aurelia-mockup .
docker run -p 3000:80 aurelia-mockup
```

## 🔐 Security Notes

- API token is only available during build time
- No secrets exposed in client-side code
- Security headers configured in nginx
- Rate limiting enabled for API endpoints
- Sensitive files blocked by nginx configuration

## 📈 Performance

- **Gzip compression** reduces bundle size by ~70%
- **Static asset caching** (1 year for JS/CSS)
- **Optimized nginx** configuration
- **Alpine Linux** base for minimal attack surface
- **Multi-stage build** for smaller final image

## 🎯 Usage

1. Upload your digital artwork (JPG/PNG/WebP, max 10MB)
2. Select which mockup types to generate (default: all 10)
3. Click "Generate Selected Mockups"
4. Download individual mockups or all at once
5. Use generated mockups for your Etsy listings

## 🆘 Troubleshooting

### Build Fails
- Check that `VITE_REPLICATE_API_TOKEN` is set in build environment variables
- Ensure repository has all required files (package.json, Dockerfile, etc.)

### API Errors
- Verify your Replicate API token is valid
- Check your Replicate account has sufficient credits
- Monitor console for specific error messages

### Health Check Failures
- Container takes ~30 seconds to start (normal)
- Check container logs in Coolify for nginx errors
- Ensure port 80 is properly exposed

## 📞 Support

For deployment issues, check:
1. Coolify logs for build/runtime errors
2. Browser console for client-side errors  
3. Replicate dashboard for API usage/errors

---

**Ready to deploy!** 🚀 Just connect your repo to Coolify and set your API token!