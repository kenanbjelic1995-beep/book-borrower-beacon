# BiblioTech external connection

- [x] Switch application authentication and data reads/writes to the user-owned instance.
- [x] Verify the external key and auth settings.
- [ ] Create external borrowers and loans tables — requires the owner to run the supplied SQL; anon key cannot create tables.
- [ ] Remove Lovable Cloud — requires a workspace admin to use Remove Database; permanently deletes Cloud data.
- [ ] Verify authenticated loan creation and return — blocked by missing external tables and no external test session.