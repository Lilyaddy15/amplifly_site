-- Applied to amplifly-prod (subymyoazfdkroxoaahs) on 2026-10-22 as migration "lock_down_auto_confirm_user".
-- auto_confirm_user() is only meant to run as the BEFORE INSERT trigger on auth.users
-- (on_auth_user_created), which sets email_confirmed_at so new accounts can sign in at once.
-- It should not be callable over the API via /rest/v1/rpc/auto_confirm_user.
-- Trigger execution does not check EXECUTE on the function, so sign-up keeps working
-- (verified: a rolled-back insert into auth.users still came back confirmed).
revoke execute on function public.auto_confirm_user() from public, anon, authenticated;
