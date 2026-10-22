# BiblioTech: user-owned Supabase setup

The app uses the public URL and anon key in `src/lib/external-supabase-config.ts` for both authentication and data. It does not use the generated Lovable Cloud client, reserved Cloud environment variables, or Cloud preview sessions. The anon key is public; RLS protects all records.

## Required steps

1. Run `setup.sql` in your own instance's SQL Editor. The checked instance currently has neither `borrowers` nor `loans`. The anon key cannot create tables.
2. In your own instance's Authentication URL configuration, add the preview origin and your eventual deployed origin to Redirect URLs, and set Site URL to the deployed origin when available.
3. Register a fresh librarian account in BiblioTech, or sign in with an account from your own instance. Cloud accounts and data are not transferred. The instance currently has email/password enabled, signup enabled, and email auto-confirm enabled; registration handles both immediate sessions and confirmation-required sessions without changing these settings.
4. A workspace admin can remove the old Cloud database in Lovable: **More → Database → Manage → Settings → Remove Database**. Removal is irreversible and permanently deletes Cloud database records, storage and functions. Export anything you need before removal. Code changes alone do not remove the platform connection.

All registered accounts have shared librarian access, matching the existing application. Do not open registration to untrusted users for a production library.

Generated Cloud integration files are left untouched because Lovable manages them. They are not imported by the application's auth or data flows. No private service-role key is required for BiblioTech's browser-based RLS access.