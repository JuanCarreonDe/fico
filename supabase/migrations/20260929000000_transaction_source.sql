-- Soporte para ingesta automatica de notificaciones bancarias.
-- Añade el origen de la transaccion y el texto crudo que la originó,
-- para poder distinguirlas de las creadas manualmente y evitar duplicados
-- cuando un webhook se reintenta por timeout.

do $$ begin
  create type public.transaction_source as enum ('manual', 'auto');
exception when duplicate_object then null;
end $$;

alter table public.transactions
  add column if not exists source public.transaction_source not null default 'manual',
  add column if not exists raw_text text;

comment on column public.transactions.source is
  'Origen de la transaccion: manual (creada en la app) o auto (ingesta de notificacion bancaria).';

comment on column public.transactions.raw_text is
  'Texto crudo de la notificacion que originó la transaccion. Solo para ingesteduras automáticas.';
