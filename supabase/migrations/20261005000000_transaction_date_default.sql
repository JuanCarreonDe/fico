-- La ingesta automática (app/api/ingest) calculaba la fecha con
-- new Date().toLocaleDateString("en-CA"), que se evalúa en el proceso Node y
-- en Vercel corre en UTC: una notificación de las 21:57 se guardaba con la
-- fecha del día siguiente. Delegamos el "hoy" al servidor, cuya TimeZone del
-- proyecto (America/Mexico_City) coincide con la del usuario.
--
-- create_transaction y update_transaction siempre pasan p_transaction_date
-- explícito, así que este default solo aplica al insert directo de la ingesta.

alter table public.transactions
  alter column transaction_date set default current_date;

comment on column public.transactions.transaction_date is
  'Fecha en que ocurrió el movimiento. Si se omite, se usa la fecha local del servidor (CURRENT_DATE).';