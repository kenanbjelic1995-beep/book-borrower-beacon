# BiblioTech external connection

- [x] Switch application authentication and data reads/writes to the user-owned instance.
- [x] Verify the external key and auth settings.
- [ ] Create external borrowers and loans tables — requires the owner to run the supplied SQL; anon key cannot create tables.
- [ ] Verify authenticated loan creation and return — blocked by missing external tables and no external test session.
- [ ] Push the project to GitHub — the owner connects Git sync in Project settings → Git, which creates a new private repository; an existing repository cannot be linked.
- [x] Application code no longer reads or writes Lovable Cloud; the platform connection itself stays in place and cannot be removed from chat.