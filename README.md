# RCBMC Directory - iOS-Ready Beta Version

A comprehensive community directory for discovering and supporting Black, Minority, Women, Veteran, Latino, Immigrant, Asian, and LGBTQ+ owned businesses in Richmond County.

## 🚀 Features

### Public Features
- **Business Directory**: Search and filter businesses by category, certifications, and location
- **Apple Maps Integration**: Direct location access for all businesses
- **Business Submission**: Self-service business listing submission
- **Newsletter Signup**: Community updates and event notifications
- **Events Calendar**: Upcoming chamber events and networking opportunities
- **Business Spotlight**: Featured business of the week
- **Responsive Design**: Mobile-first, iOS-ready interface

### Admin Features
- **Admin Dashboard**: Comprehensive business and subscriber management
- **Business Moderation**: Approve, reject, edit, and feature businesses
- **Analytics Overview**: Submission tracking and engagement metrics
- **CSV Export**: Export business and newsletter data
- **Magic Link Authentication**: Secure admin access

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Deployment**: Netlify (with automatic builds)
- **Maps**: Apple Maps integration
- **Email**: Supabase Edge Functions (configurable with SendGrid/Resend)

## 📱 iOS App Store Compliance

This web app is designed with iOS App Store guidelines in mind:

- **Touch Targets**: All interactive elements meet 44pt minimum requirement
- **Privacy Ready**: Structured for Privacy Policy compliance
- **Payment Compliance**: Designed to avoid In-App Purchase requirements
- **Sign in with Apple**: Ready for implementation alongside other auth methods
- **Accessibility**: High contrast ratios and screen reader support

## 🚨 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

Run the following migrations in your Supabase SQL Editor:

1. `supabase/migrations/create_businesses_table.sql` (if not already created)
2. `supabase/migrations/create_newsletter_subscribers.sql`
3. `supabase/migrations/update_businesses_table.sql`

### 3. Storage Setup (Optional)

Create a `business-logos` bucket in Supabase Storage for logo uploads.

### 4. Development

```bash
npm install
npm run dev
```

## 🔐 Admin Access

### Development
Use the keyboard shortcut: `Ctrl/Cmd + Shift + A` to open admin login.

### Production
Admin access is available through Supabase authentication:
- **Magic Link**: Email-based passwordless login
- **Password**: Traditional email/password authentication

### Admin Features
- **Pending Submissions**: Review and approve/reject new businesses
- **Business Management**: Edit, feature, and delete approved businesses
- **Newsletter Management**: View and export subscriber list
- **Analytics**: Track submissions and engagement
- **CSV Export**: Export data for external analysis

## 📊 Business Submission Flow

1. **Public Submission**: Anyone can submit a business via the "Add My Business" button
2. **Validation**: Client and server-side validation ensures data quality
3. **Pending Review**: Submissions are stored with `status: 'pending'`
4. **Admin Review**: Admins can approve, reject, or request changes
5. **Public Display**: Only approved businesses appear in the public directory
6. **Featured Spotlight**: Admins can feature businesses for homepage spotlight

## 🗂️ Data Models

### Business
```typescript
interface Business {
  id: string;
  business_name: string;
  owner_name: string;
  business_description: string;
  website_url?: string;
  business_category: string;
  certifications: string[];
  logo_url?: string;
  contact_email: string;
  contact_phone?: string;
  business_address: string;
  social_media: object;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
```

### Newsletter Subscriber
```typescript
interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  unsubscribed_at?: string;
}
```

## 🎨 Design System

### Colors
- **Primary**: Red (#dc2626, #b91c1c)
- **Secondary**: Black (#000000)
- **Accent**: White (#ffffff)
- **Success**: Green (#16a34a)
- **Warning**: Yellow (#eab308)
- **Error**: Red (#dc2626)

### Typography
- **Font**: Inter (system fallback)
- **Weights**: 400, 500, 600, 700, 800
- **Line Height**: 150% body, 120% headings

### Spacing
- **System**: 8px base unit
- **Touch Targets**: Minimum 44px (iOS compliance)
- **Breakpoints**: Mobile-first responsive design

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build settings are automatically detected from `netlify.toml`
3. Add environment variables in Netlify dashboard
4. Deploy automatically on push to main branch

### Manual Build
```bash
npm run build
# Deploy the `dist` folder to your hosting provider
```

## 🔮 Roadmap

### Phase 1 (Current - Beta)
- ✅ Business directory with search/filter
- ✅ Business submission and admin approval
- ✅ Newsletter signup and management
- ✅ Admin dashboard with analytics
- ✅ Business spotlight feature
- ✅ Apple Maps integration

### Phase 2 (Fall 2025)
- 🔄 Owner self-service accounts
- 🔄 Advanced event management with RSVPs
- 🔄 Business deals and promotions
- 🔄 Enhanced analytics and reporting
- 🔄 PWA features (offline support, install prompts)

### Phase 3 (2026)
- 📱 Native iOS/Android apps
- 🔄 Advanced search with location radius
- 🔄 Business networking features
- 🔄 Integration with chamber management systems
- 🔄 Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For technical support or questions:
- Email: info@rcblackminoritycc.org
- Website: [rcblackminoritycc.org](https://rcblackminoritycc.org)

---

**Richmond County Black & Minority Chamber of Commerce**  
*Empowering businesses, building community*