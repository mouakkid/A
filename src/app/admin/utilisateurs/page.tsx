import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getCurrentUser, isAdmin } from "@/lib/auth/session";
import { setUserRoleAction } from "@/lib/admin/actions";
import { banUserAction } from "@/lib/forum/actions";
import { formatDate } from "@/lib/utils/format";

export default async function AdminUsers() {
  const me = await getCurrentUser();
  if (!isAdmin(me)) redirect("/admin");
  const list = await db.select({ id: users.id, username: users.username, email: users.email, role: users.role, bannedAt: users.bannedAt, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(200);
  return (
    <div>
      <h1 className="text-2xl font-bold">Utilisateurs ({list.length})</h1>
      <table className="mt-6 w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-[0.12em] text-fg-subtle"><tr><th className="py-2">Pseudo</th><th className="py-2">E-mail</th><th className="py-2">Rôle</th><th className="py-2">Inscrit</th><th className="py-2">Actions</th></tr></thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.id} className="border-t border-border">
              <td className="py-2 font-medium">{u.username}{u.bannedAt && <span className="ml-2 text-xs text-danger">suspendu</span>}</td>
              <td className="py-2 text-fg-muted">{u.email}</td>
              <td className="py-2">
                {u.id === me!.id ? u.role : (
                  <form action={setUserRoleAction} className="flex items-center gap-1">
                    <input type="hidden" name="userId" value={u.id} />
                    <select name="role" defaultValue={u.role} className="h-8 rounded border border-border bg-bg px-2 text-xs">{["member", "moderator", "editor", "admin"].map((r) => <option key={r} value={r}>{r}</option>)}</select>
                    <button className="rounded-full border border-border px-2 py-1 text-xs hover:bg-bg-muted">OK</button>
                  </form>
                )}
              </td>
              <td className="py-2">{formatDate(u.createdAt)}</td>
              <td className="py-2">
                {u.id !== me!.id && u.role !== "admin" && (
                  <form action={banUserAction}><input type="hidden" name="userId" value={u.id} /><input type="hidden" name="action" value={u.bannedAt ? "unban" : "ban"} /><button className="rounded-full border border-border px-2 py-1 text-xs hover:bg-bg-muted">{u.bannedAt ? "Réactiver" : "Suspendre"}</button></form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
