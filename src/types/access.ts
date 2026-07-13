/** Tipos de Gestão & Administração do Tenant (M5.3), espelhando os API Resources do backend (Access). */

/** Filial gerível (seletor do form de Departamento). */
export interface Filial {
  id: number;
  name: string;
}

/** Departamento — pertence a uma Filial; responsável opcional; contagem de Filas (leitura). */
export interface Department {
  id: number;
  branch_id: number;
  name: string;
  slug: string;
  responsavel_id: number | null;
  responsavel: { id: number; name: string } | null;
  filas_count: number;
  created_at: string | null;
}

/** Payload de criação/edição de Departamento (slug é derivado no backend). */
export interface DepartmentInput {
  branch_id: number;
  name: string;
  responsavel_id?: number | null;
}

/* ----------------------------- M5.3.3 — Usuários ----------------------------- */

/** Ciclo de vida do usuário do Tenant (governa o login). */
export type UserStatus = 'ativo' | 'suspenso' | 'pendente';

/** Escopo de uma atribuição de papel (ADR-010). */
export type ScopeType = 'tenant' | 'branch' | 'department';

/** Papel atribuído ao usuário num escopo (leitura da lista). */
export interface UserRole {
  role: string | null;
  slug: string | null;
  scope_type: ScopeType;
  scope_id: number | null;
}

/** Usuário do Tenant (espelha UserResource). */
export interface AccessUser {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  roles?: UserRole[];
  created_at: string | null;
}

/** Papel do catálogo (para atribuir no convite — MVP §3.4). */
export interface Role {
  id: number;
  name: string;
  slug: string;
}

/** Payload do convite (papel + escopo pré-atribuídos). */
export interface InviteInput {
  name: string;
  email: string;
  role_id: number;
  scope_type: ScopeType;
  scope_id?: number | null;
}

/** Resposta do convite/reenvio: o LINK copiável (decisão §3.1). */
export interface InviteResult {
  user_id: number;
  expires_at: string | null;
  invite_url: string;
}

/* -------------------------- M5.3.4 — Papéis & Escopos -------------------------- */

/** Atribuição de papel a um usuário num escopo (espelha RoleAssignmentResource). */
export interface RoleAssignmentItem {
  id: number;
  role_id: number;
  role: string | null;
  slug: string | null;
  scope_type: ScopeType;
  scope_id: number | null;
}

/** Payload para atribuir um papel × escopo (só ATRIBUIR os existentes — §3.4). */
export interface AssignRoleInput {
  role_id: number;
  scope_type: ScopeType;
  scope_id?: number | null;
}

/** Uma permissão efetiva do usuário (chave × escopo) — preview reusando `effective()`. */
export interface EffectivePermission {
  permission: string;
  scope_type: ScopeType;
  scope_id: number | null;
}
