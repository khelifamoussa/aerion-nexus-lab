# Secure Access Architecture

## Security boundary

The current portal is a transparent **preview identity layer** for interface development. It is not presented as production security. It stores a four-hour session in `sessionStorage` and never embeds a real password or secret in the client bundle.

Production deployment will replace the preview adapter with Supabase Auth:

1. Email magic link or passwordless institutional login.
2. Invitation-only account provisioning.
3. Server-enforced Row Level Security.
4. Role claims for director, researcher, reviewer and student.
5. Private evidence buckets and signed download URLs.
6. Immutable audit events for experiment approval and manuscript export.

## Roles

| Role | Primary scope |
| --- | --- |
| Director | Configure agents, approve evidence, manage publication |
| Researcher | Run missions, write manuscripts, inspect evidence |
| Reviewer | Review claims, comment and block unsupported conclusions |
| Student | Read approved missions and evidence |

## Deployment rule

Never publish production secrets to GitHub or the browser bundle. Vite variables prefixed with `VITE_` are public by design. Only the Supabase anonymous key belongs in the client; service-role keys remain server-side.

## Next integration

Create `src/security/supabaseAdapter.js` only after the Supabase project, redirect origins and RLS policies are defined. The application should depend on the same session contract exposed by `security/auth.js`, keeping UI code provider-independent.
