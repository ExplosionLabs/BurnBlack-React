# 🚀 BurnBlack Supabase Manual Deployment Guide

## ⚠️ IMPORTANT: Required Manual Step

Due to permission restrictions with the MCP connection (connected as read-only user), the database schema must be deployed manually through the Supabase Dashboard. This is a **one-time setup** required to complete the migration.

## 📋 Step-by-Step Deployment Instructions

### Step 1: Access Supabase Dashboard

1. **Open your browser** and go to: https://supabase.com/dashboard/project/cgdafnbmqalyjchvhwsf
2. **Login** with your Supabase account credentials
3. **Navigate to SQL Editor**: Click "SQL Editor" in the left sidebar

### Step 2: Execute Migration SQL

1. **Create New Query**: Click "New Query" button
2. **Copy Migration Content**:
   - Open the file: `supabase/migrations/20250621093329_create_burnblack_schema.sql`
   - Select ALL content (Cmd+A / Ctrl+A)
   - Copy to clipboard (Cmd+C / Ctrl+C)

3. **Paste and Execute**:
   - Paste the SQL content into the query editor
   - Click "Run" button
   - **Wait for completion** (may take 30-60 seconds)

### Step 3: Verify Deployment Success

After execution, you should see:
- ✅ Success message
- ✅ Multiple CREATE statements executed
- ✅ No error messages

**Check Tables Created**:
1. Go to "Database" → "Tables" in the left sidebar
2. You should see **25+ tables** including:
   - `users`
   - `personal_details`
   - `contact_details`
   - `form16_data`
   - `properties`
   - `capital_gains`
   - `business_income`
   - `wallet`
   - And many more...

## 🔧 Post-Deployment Verification

### Automated Verification Script

After manual deployment, run this to verify everything works:

```bash
# Pull the deployed schema to verify Prisma connectivity
npx prisma db pull

# Regenerate Prisma client with new schema
npx prisma generate

# Test database connectivity
node -e "
import('./node_modules/@prisma/client/index.js').then(async ({ PrismaClient }) => {
  const prisma = new PrismaClient()
  try {
    const result = await prisma.\$executeRaw\`SELECT COUNT(*) as tables FROM information_schema.tables WHERE table_schema = 'public'\`
    console.log('✅ Database connection successful')
    console.log('📊 Tables found:', result)
    await prisma.\$disconnect()
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
})
"
```

### Manual Verification in Dashboard

1. **Check Table Count**: Should see 25+ tables in Database → Tables
2. **Test Query**: In SQL Editor, run:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```
3. **Expected Result**: List of all BurnBlack tables

## 📁 Backend Integration Setup

After successful deployment, create these backend files:

### 1. Create Prisma Client (`backend/lib/prisma.js`)

```javascript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### 2. Create Supabase Client (`backend/lib/supabase.js`)

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})
```

### 3. Test Database Connection

Create `test-connection.js`:

```javascript
import { prisma } from './backend/lib/prisma.js'
import { supabase } from './backend/lib/supabase.js'

async function testConnections() {
  console.log('🧪 Testing database connections...')
  
  try {
    // Test Prisma connection
    const userCount = await prisma.user.count()
    console.log('✅ Prisma connection successful')
    console.log('👥 Current users:', userCount)
    
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    if (error) throw error
    console.log('✅ Supabase connection successful')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnections()
```

## 🚧 If Migration Fails

### Common Issues and Solutions:

1. **Permission Denied Error**:
   - Ensure you're using Supabase Dashboard, not local tools
   - Check you're logged into the correct Supabase account

2. **SQL Syntax Error**:
   - Copy the ENTIRE migration file content
   - Don't modify the SQL content
   - Check for any copy/paste truncation

3. **Timeout Error**:
   - Break the migration into smaller chunks
   - Execute in sections (enums first, then tables)

4. **Tables Already Exist**:
   - Drop existing tables if this is a fresh setup
   - Or use `CREATE TABLE IF NOT EXISTS` syntax

### Alternative: Chunk-by-Chunk Deployment

If the full migration fails, execute in these sections:

**Section 1: Extensions and Enums**
```sql
-- Copy and run this section first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- All CREATE TYPE statements
```

**Section 2: Core Tables**
```sql
-- Users and related tables
-- Copy CREATE TABLE statements for:
-- users, personal_details, contact_details, bank_details, address_details
```

**Section 3: Income Tables**
```sql
-- Income-related tables
-- Copy CREATE TABLE statements for:
-- form16_data, properties, capital_gains, etc.
```

Continue until all tables are created.

## ✅ Success Criteria

Migration is complete when:
- [ ] 25+ tables visible in Supabase Dashboard
- [ ] `npx prisma db pull` succeeds
- [ ] `npx prisma generate` succeeds  
- [ ] Test connection script runs successfully
- [ ] No errors in Supabase Dashboard SQL Editor

---

## 🎯 Next Steps After Deployment

1. **Complete Migration**: Execute manual deployment above
2. **Verify Setup**: Run verification scripts
3. **Initialize Backend**: Create Prisma/Supabase client files
4. **Begin Data Migration**: Start Phase 2 (MongoDB → PostgreSQL data transfer)
5. **Update APIs**: Replace Mongoose with Prisma (Phase 3)
6. **Frontend Updates**: Integrate Supabase Auth (Phase 4)

---

**Status**: Ready for manual deployment via Supabase Dashboard
**Estimated Time**: 5-10 minutes for deployment + verification