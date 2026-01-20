# Database Migration Steps

## Issue
The Prisma client needs to be regenerated to recognize the new `WidgetSettings` model.

## Solution

### Step 1: Stop the Dev Server
Press `Ctrl+C` in the terminal running `npm run dev`

### Step 2: Regenerate Prisma Client
Run this command:
```bash
npm run setup
```

This will:
- Generate the new Prisma client with `WidgetSettings` model
- Apply any pending migrations

### Step 3: Restart Dev Server
```bash
npm run dev
```

## What Changed

### New Schema Structure
Instead of storing widget settings as JSON in the Shop model, we now have a separate `WidgetSettings` model:

```prisma
model WidgetSettings {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  shopDomain            String    @unique
  position              String    @default("bottom-right")
  phoneNumber           String?
  buttonText            String    @default("Chat with us")
  buttonColor           Json      // HSB color object
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

### Benefits
- ✅ Cleaner data structure
- ✅ Better type safety
- ✅ Easier to query and update
- ✅ Separate concerns (Shop vs Widget Settings)

## Verification

After restarting, the app should:
1. Load without Prisma errors
2. Show the Widget Settings page
3. Allow you to save settings
4. Store data in the `WidgetSettings` collection

## Troubleshooting

If you still see errors:

### Clear Prisma Cache
```bash
npx prisma generate --force
```

### Check Database Connection
```bash
npx prisma studio
```

This opens a GUI to view your database. You should see the `WidgetSettings` collection.

### Verify Schema
```bash
npx prisma validate
```

This checks if your schema is valid.

## Next Steps

Once the migration is complete:
1. Test the settings page
2. Save some test settings
3. Verify data is stored in MongoDB
4. Build the storefront widget
