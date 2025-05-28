# Technical Implementation Guide

## Authentication & Authorization

### User Roles and Permissions
The system implements role-based access control (RBAC) with two primary roles:
- `user`: Regular users with access to personal tax filing features
- `admin`: Administrators with access to system management features

#### Role Implementation
```typescript
// User Model
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  // ... other fields
}

// JWT Token Payload
interface TokenPayload {
  id: string;
  email: string;
  role: string;
}
```

#### Role-Based Middleware
```javascript
// Middleware for role-based access control
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    next();
  };
};

// Usage in routes
router.get('/admin/dashboard', verifyToken, checkRole('admin'), adminController.getDashboard);
```

### Admin Features
1. **User Management**
   - View all users
   - Manage user roles
   - Deactivate/activate users
   - View user details and documents

2. **GST Management**
   - View and manage GST filings
   - Verify GST documents
   - Generate GST reports

3. **System Management**
   - View system metrics
   - Manage tax rates and rules
   - Handle support tickets

### Security Measures
1. **Token-based Authentication**
   - JWT tokens with role information
   - Token expiration and refresh mechanism
   - Secure token storage

2. **Role Verification**
   - Server-side role verification
   - Protected routes with role middleware
   - Client-side role-based UI rendering

3. **API Security**
   - Rate limiting for admin routes
   - IP-based access restrictions
   - Audit logging for admin actions

## Frontend Implementation

### Admin Dashboard
1. **Protected Routes**
```typescript
// Admin route protection
const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return user?.role === 'admin' ? children : null;
};
```

2. **Role-Based Navigation**
```typescript
// Admin navigation items
const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin/dashboard', icon: Shield },
  { name: 'User Management', href: '/admin/users' },
  { name: 'GST Management', href: '/admin/gst' }
];
```

### State Management
1. **User State**
```typescript
// Redux user state
interface UserState {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  loading: boolean;
  error: string | null;
}
```

2. **Role-Based Actions**
```typescript
// Role-based action creators
const setUserRole = (userId: string, role: string) => async (dispatch) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    dispatch(updateUserSuccess(response.data));
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }
};
```

## API Endpoints

### Admin Routes
```typescript
// Admin API endpoints
const adminRoutes = {
  // User Management
  GET_USERS: '/api/v1/admin/users',
  UPDATE_USER_ROLE: '/api/v1/admin/users/:userId/role',
  DEACTIVATE_USER: '/api/v1/admin/users/:userId/deactivate',
  
  // GST Management
  GET_GST_FILINGS: '/api/v1/admin/gst/filings',
  VERIFY_GST_DOCUMENT: '/api/v1/admin/gst/documents/:id/verify',
  
  // System Management
  GET_SYSTEM_METRICS: '/api/v1/admin/metrics',
  UPDATE_TAX_RATES: '/api/v1/admin/tax-rates',
  GET_SUPPORT_TICKETS: '/api/v1/admin/support-tickets'
};
```

### Response Formats
```typescript
// Success Response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Error Response
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Database Schema

### User Collection
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user' 
  },
  // ... other fields
});
```

### Admin Audit Log
```javascript
const adminAuditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});
```

## Testing

### Role-Based Testing
```typescript
describe('Admin Routes', () => {
  it('should allow admin access to dashboard', async () => {
    const adminToken = generateAdminToken();
    const response = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  it('should deny user access to admin routes', async () => {
    const userToken = generateUserToken();
    const response = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(403);
  });
});
``` 