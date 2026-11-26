# Supabase backend

Project reference: `tvalnknfvhbehoyptlcn`  
Region: `eu-central-1`

The browser uses only the modern publishable key. No secret or service-role key belongs in this repository.

## Applied migrations

1. `aerion_core_rls_schema`
   - profiles
   - research_projects
   - project_memberships
   - experiments
   - evidence_artifacts
   - scientific_claims
   - claim_evidence
   - manuscripts
   - audit_events
   - invitation roles and Row Level Security
2. `aerion_indexes_and_private_evidence_storage`
   - foreign-key/query indexes
   - private `aerion-evidence` bucket
   - project-folder storage policies

The authoritative migration history is recorded by Supabase. Before subsequent database work, list remote migrations and run Security, Performance and Health advisors.

## Access model

- Accounts are invitation-only; the frontend calls `signInWithOtp` with `shouldCreateUser:false`.
- Users cannot select or edit their own laboratory role.
- Project access is resolved from `project_memberships`.
- The internal role-check function lives in the non-exposed `private` schema.
- Every public table has RLS enabled.
- Evidence objects use `<project_uuid>/<artifact path>` and a private storage bucket.

## Deployment variables

```env
VITE_AUTH_MODE=supabase
VITE_SUPABASE_URL=https://tvalnknfvhbehoyptlcn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

The publishable key is designed for public clients and remains constrained by RLS. Never replace it with `sb_secret_...` or the legacy `service_role` key.

## Director bootstrap

The first director must be invited from the Supabase dashboard or a trusted server-side administrative workflow. After first login, create the research project with `created_by = auth.uid()`; a database trigger adds that creator as project director.

## Verification completed

- All nine public tables: RLS enabled.
- Security Advisor: no findings.
- Health Advisor: no findings.
- Foreign-key indexes added.
- Unused-index notices are expected until real workload begins.
