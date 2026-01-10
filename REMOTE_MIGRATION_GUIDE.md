# Remote Database Migration Guide

## Prerequisites
- Backup your remote database first!
- Make sure you have the correct DATABASE_URL

## Step 1: Backup Remote Database (CRITICAL!)
```bash
# Create backup
mysqldump -h 192.154.96.150 -u cybercra_veridb -p cybercra_veridb > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Step 2: Update .env for Remote
```bash
# Temporarily update DATABASE_URL in .env
DATABASE_URL="mysql://cybercra_veridb:qYEtMY6luW@192.154.96.150:3306/cybercra_veridb"
```

## Step 3: Deploy Migration
```bash
# Option A: Deploy existing migrations (RECOMMENDED)
npx prisma migrate deploy

# Option B: Push schema directly (if no migrations exist)
npx prisma db push
```

## Step 4: Verify Tables
```bash
# Generate Prisma Client
npx prisma generate

# Open Prisma Studio to verify
npx prisma studio
```

## Step 5: Restore Local .env
```bash
# Change DATABASE_URL back to local
DATABASE_URL="mysql://root:@localhost:3306/verihuman"
```

## Verification Checklist
- [ ] Backup created successfully
- [ ] Connected to remote database
- [ ] Migration deployed without errors
- [ ] RateLimit table exists
- [ ] ApiUsage table exists
- [ ] Tables have correct columns and indexes
- [ ] Local .env restored

## Rollback (if needed)
```bash
# Restore from backup
mysql -h 192.154.96.150 -u cybercra_veridb -p cybercra_veridb < backup_YYYYMMDD_HHMMSS.sql
```

## Expected Tables
After migration, you should see:
- `User`
- `Account`
- `Session`
- `VerificationToken`
- `ActivityLog`
- `RateLimit` ← NEW
- `ApiUsage` ← NEW

## SQL to Verify (if needed)
```sql
-- Check if tables exist
SHOW TABLES;

-- Check RateLimit structure
DESCRIBE RateLimit;

-- Check ApiUsage structure
DESCRIBE ApiUsage;

-- Check indexes
SHOW INDEX FROM RateLimit;
SHOW INDEX FROM ApiUsage;
```
