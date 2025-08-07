# 🎨 Aurelia Galleria Mockup Generator

AI-powered mockup generator using **FLUX Pro** for creating professional Samsung Frame TV and lifestyle mockups for digital artwork.

![Aurelia Galleria](https://img.shields.io/badge/Aurelia-Galleria-gold?style=for-the-badge)
![FLUX Pro](https://img.shields.io/badge/FLUX-Pro-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-0db7ed?style=for-the-badge&logo=docker)

## ✨ Features

- **🤖 FLUX Pro AI** - State-of-the-art image generation using `black-forest-labs/flux-pro`
- **📱 10 Mockup Types** - Samsung Frame TV, lifestyle shots, instructional graphics
- **🎯 Professional Quality** - Perfect for Etsy digital art listings
- **⚡ Real-time Generation** - Live progress tracking with polling
- **💾 Bulk Downloads** - Individual or download all mockups at once
- **🎨 Beautiful UI** - Aurelia Galleria branding with Tailwind CSS
- **📱 Responsive** - Works perfectly on all devices
- **🔒 Secure** - API keys handled safely during build time

## 🖼️ Mockup Types

1. **Main Listing Image** (1:1) - Samsung Frame TV hero shot
2. **Alt Closeup Detail** (5:4) - Artwork detail focus
3. **Lifestyle Mockup** (3:2) - Boho-Scandi living room
4. **Secondary Angle** (5:4) - Different frame style
5. **Digital Download Notice** (4:5) - Product format explanation
6. **What's Included** (4:5) - Contents graphic
7. **How to Use Instructions** (4:5) - Usage guide
8. **Etsy Download Guide** (4:5) - Download instructions
9. **Collection Grid** (1:1) - Portfolio preview
10. **Brand Identity** (1:1) - Testimonial highlight

## 🚀 Quick Deploy to Coolify

[![Deploy to Coolify](https://img.shields.io/badge/Deploy%20to-Coolify-6366f1?style=for-the-badge)](https://coolify.io)

### 1. Connect Repository
- Add this GitHub repo to your Coolify project
- Select **Docker** as build method

### 2. Set Environment Variable
Add this **Build Environment Variable**:
```
VITE_REPLICATE_API_TOKEN=your_replicate_api_token_here
```

### 3. Deploy
- Coolify will automatically build and deploy
- Your mockup generator will be live in minutes!

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/aurelia-galleria-mockup-generator.git
cd aurelia-galleria-mockup-generator

# Install dependencies
npm install

# Start development server
VITE_REPLICATE_API_TOKEN=your_token npm run dev

# Build for production
npm run build
```

## 🐳 Docker Deployment

```bash
# Build with your API token
docker build --build-arg VITE_REPLICATE_API_TOKEN=your_token -t aurelia-mockup .

# Run container
docker run -p 3000:80 aurelia-mockup
```

## 💡 How It Works

1. **Upload Artwork** - JPG/PNG/WebP files up to 10MB
2. **Select Mockups** - Choose from 10 professional mockup types
3. **AI Generation** - FLUX Pro creates realistic interior scenes
4. **Download Results** - Get high-quality mockups for your listings

## 🔧 Technical Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **AI**: FLUX Pro via Replicate API
- **Icons**: Lucide React
- **Server**: Nginx (production)
- **Container**: Multi-stage Docker build
- **Deployment**: Coolify ready

## 🎯 Perfect For

- **Etsy Sellers** - Digital art mockups
- **Print on Demand** - Product visualization
- **Interior Designers** - Client presentations
- **Digital Artists** - Portfolio displays
- **Frame Shops** - Samsung Frame TV content

## 📋 API Requirements

- [Replicate Account](https://replicate.com) with API access
- FLUX Pro model access (premium)
- Sufficient API credits for generations

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_REPLICATE_API_TOKEN` | Your Replicate API token | ✅ Yes |

## 🆘 Support

For issues or questions:
- Check the [deployment guide](DEPLOY.md)
- Review container logs for errors
- Verify Replicate API token and credits

## 📄 License

Created for Aurelia Galleria digital artwork mockup generation.

---

**Ready to create stunning mockups?** 🎨 
Deploy now and start generating professional Samsung Frame TV mockups for your digital art!