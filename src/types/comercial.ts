// Tipos do módulo Comercial (E5) — espelham os API Resources do backend (Sprint 07).

export type ProdutoStatus = 'ativo' | 'inativo';
export type PropostaStatus =
  | 'rascunho'
  | 'enviada'
  | 'visualizada'
  | 'em_negociacao'
  | 'aprovada'
  | 'reprovada'
  | 'cancelada';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
  produtos_count?: number; // presente no index (withCount)
  created_at?: string;
}

export interface Produto {
  id: number;
  categoria_id: number | null;
  codigo: string | null;
  nome: string;
  unidade: string | null;
  preco: string | null; // decimal → string
  imagem_file_asset_id: number | null;
  descricao: string | null;
  status: ProdutoStatus;
  categoria?: Categoria; // quando a relação é carregada
  created_at?: string;
}

// Item de preço da tabela (presente em show/store/update; ausente no index).
export interface TabelaPrecoItem {
  produto_id: number;
  nome: string;
  preco: string;
}

export interface TabelaPreco {
  id: number;
  nome: string;
  descricao: string | null;
  is_padrao: boolean;
  ativo: boolean;
  precos?: TabelaPrecoItem[];
  created_at?: string;
}

export interface PropostaItem {
  id: number;
  produto_id: number | null;
  descricao: string; // maps from descricao_snapshot
  unidade: string; // maps from unidade_snapshot
  quantidade: string; // decimal:3 → string
  preco_unitario: string; // decimal:2 → string (congelado)
  desconto: string; // decimal:2 → string
  subtotal: string; // decimal:2 → string
  posicao: number;
}

export interface Proposta {
  id: number;
  numero: string; // ex.: "PROP-2026-0001"
  branch_id: number;
  cliente_id: number;
  contato_id: number | null;
  oportunidade_id: number;
  vendedor_id: number | null;
  status: PropostaStatus;
  condicoes: string | null;
  observacoes: string | null;
  desconto_total: string; // decimal:2 → string
  valor_total: string; // decimal:2 → string (computado)
  enviada_em: string | null;
  visualizada_em: string | null;
  decidida_em: string | null;
  tem_pdf: boolean;
  share_url?: string; // presente quando há token de compartilhamento ativo
  itens?: PropostaItem[]; // carregado nos endpoints de recurso único
  // Relação de cliente (CRM) — presente conforme o endpoint.
  cliente?: { id: number; nome: string; titular?: { id: number; nome: string } | null };
  created_at?: string;
}

// Payload de item enviado ao backend (add/edit) — espelha os Form Requests.
export interface PropostaItemInput {
  produto_id?: number | null;
  tabela_preco_id?: number | null;
  descricao?: string | null;
  unidade?: string | null;
  quantidade?: number | null;
  preco_unitario?: number | null;
  desconto?: number | null;
}
