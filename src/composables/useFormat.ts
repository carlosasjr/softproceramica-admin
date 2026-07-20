/** Formatação de exibição (moeda, data, documento, telefone). */
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function useFormat() {
  return {
    currency(value: string | number | null | undefined): string {
      if (value === null || value === undefined || value === '') return '—';
      const n = typeof value === 'string' ? Number(value) : value;
      return Number.isFinite(n) ? brl.format(n) : '—';
    },
    date(value: string | null | undefined): string {
      if (!value) return '—';
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? '—' : dateFmt.format(d);
    },
    dateTime(value: string | null | undefined): string {
      if (!value) return '—';
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? '—' : dateTimeFmt.format(d);
    },
    document(value: string | null | undefined): string {
      if (!value) return '—';
      const v = value.replace(/\D/g, '');
      if (v.length === 11) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      if (v.length === 14) return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      return value;
    },
    phone(value: string | null | undefined): string {
      if (!value) return '—';
      const v = value.replace(/\D/g, '');
      if (v.length === 11) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      if (v.length === 10) return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      return value;
    },
    relative(value: string | null | undefined): string {
      if (!value) return '';
      const d = new Date(value).getTime();
      const diff = Date.now() - d;
      const min = Math.round(diff / 60000);
      if (min < 1) return 'agora';
      if (min < 60) return `há ${min} min`;
      const h = Math.round(min / 60);
      if (h < 24) return `há ${h} h`;
      const days = Math.round(h / 24);
      if (days < 30) return `há ${days} d`;
      return dateFmt.format(new Date(value));
    },
  };
}
