# BurnBlack Supabase Deployment Instructions

## 🚀 Complete the Database Schema Deployment

### Step 1: Deploy Schema via Supabase Dashboard

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/cgdafnbmqalyjchvhwsf
   - Login with your Supabase account

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy Migration Content**
   - Open: `supabase/migrations/20250621093329_create_burnblack_schema.sql`
   - Copy the entire file content

4. **Execute Schema Creation**
   - Paste the SQL content into the query editor
   - Click "Run" to execute
   - Wait for completion (should create 25+ tables)

5. **Verify Success**
   - Check "Database" → "Tables" to see all created tables
   - Should see: users, personal_details, contact_details, etc.

### Step 2: Test Database Connection

```bash
# Verify Prisma can connect
npx prisma db pull

# Generate updated client
npx prisma generate
```

### Step 3: Initialize Backend Integration

1. **Create Prisma Client**
   ```bash
   # In backend directory
   mkdir -p lib
   ```

2. **Create backend/lib/prisma.js**
   ```javascript
   import { PrismaClient } from '@prisma/client'

   const globalForPrisma = globalThis;

   export const prisma = globalForPrisma.prisma || new PrismaClient()

   if (process.env.NODE_ENV !== 'production') {
     globalForPrisma.prisma = prisma
   }
   ```

3. **Create backend/lib/supabase.js**
   ```javascript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

### Step 4: Test Connection

```bash
# Test database connection
node -e "
import('./backend/lib/prisma.js').then(async ({ prisma }) => {
  try {
    const result = await prisma.user.findMany({ take: 1 })
    console.log('✅ Database connection successful')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
})
"
```

## 🔄 Next Development Phases

### Phase 2: Data Migration (After Schema Deployment)
1. Create MongoDB → PostgreSQL migration scripts
2. Migrate user data first
3. Migrate tax data progressively
4. Validate data integrity

### Phase 3: Backend API Updates
1. Replace Mongoose with Prisma queries
2. Update authentication to Supabase Auth
3. Modify API endpoints
4. Test all CRUD operations

### Phase 4: Frontend Integration
1. Install Supabase client in frontend
2. Update authentication flows
3. Modify API calls
4. Test user interface

## 📋 Quick Checklist

- [ ] Execute SQL migration in Supabase Dashboard
- [ ] Verify tables created (should see 25+ tables)
- [ ] Test Prisma connection with `npx prisma db pull`
- [ ] Create Prisma and Supabase client files
- [ ] Test database connectivity
- [ ] Begin Phase 2 (Data Migration)

## 🆘 Troubleshooting

### If Migration Fails:
1. Check SQL syntax in migration file
2. Verify permissions in Supabase Dashboard
3. Try running migration in smaller chunks
4. Contact Supabase support if needed

### If Connection Fails:
1. Verify environment variables in `.env`
2. Check database URL format
3. Ensure Supabase project is active
4. Test connection via Supabase Dashboard

---

**Current Status**: Infrastructure 100% ready, waiting for schema deployment
**Next Step**: Execute SQL migration in Supabase Dashboard