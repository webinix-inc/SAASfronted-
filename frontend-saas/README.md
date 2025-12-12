# SaaS Admin Panel

This is the super admin interface for managing the SaaS platform. It allows super admins to:

- Manage all tenants
- Control module access per tenant
- View platform analytics
- Manage billing and subscriptions
- Configure platform settings

## Setup

1. Install dependencies:
```bash
cd src/frontend-saas
npm install
```

2. Create a `.env` file in the project root (if not exists) and add:
```env
REACT_APP_API_URL=http://localhost:5000
SAAS_ADMIN_PORT=3002
```

3. Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3002`

## Features

### Tenant Management
- View all tenants with filtering and search
- Create new tenants
- Edit tenant information
- Suspend/activate tenants
- Manage tenant modules

### Module Management
- View all available modules
- Enable/disable modules per tenant
- Track module usage across platform
- Manage module dependencies

### Analytics
- Platform-wide statistics
- Tenant growth metrics
- Revenue tracking
- Module usage analytics

### Billing
- Manage subscription plans
- View tenant subscriptions
- Track revenue

## Authentication

Only users with `superadmin` role can access this panel. The default super admin credentials are:
- Email: `superadmin@admin.com`
- Password: `admin123`

**Important:** Change these credentials in production!

## API Endpoints

The SaaS admin panel uses the following backend endpoints:
- `/api/saas/*` - SaaS management endpoints (super admin only)
- `/api/modules/*` - Module management endpoints
- `/api/auth/*` - Authentication endpoints

## Development

This is a React application created with Create React App. For more information, see the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

