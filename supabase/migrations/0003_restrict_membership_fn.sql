-- Security advisor fix: the RLS helper must not be callable anonymously via /rest/v1/rpc.
-- Signed-in users keep EXECUTE because RLS policies evaluate it as the calling role.
-- (The remaining "authenticated can execute" advisory is intentional: the function only
-- answers whether the *caller* belongs to a workspace.)
revoke execute on function public.is_workspace_member(text) from public, anon;
grant execute on function public.is_workspace_member(text) to authenticated;
