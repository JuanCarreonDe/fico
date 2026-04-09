# Plan: Carga única de datos al entrar a la app

## Problema actual

- `/transactions`: hace 5 RPC calls en SSR cada visita
- `/dashboard`: hace 2 RPC calls cada visita
- Al navegar entre páginas, se re-ejecutan todas las queries

## Solución propuesta

### 1. Crear `AppDataProvider` global (`components/app-data-provider.tsx`)

- Cargar datos al iniciar sesión (summary, transactions, categories, accounts, balances)
- Usar el `transaction-store` existente para persistir en memoria
- Solo cargar una vez por sesión

### 2. Modificar páginas para leer del store

- `app/transactions/page.tsx`: usar datos del store en vez de fetch
- `app/dashboard/page.tsx`: usar datos del store
- Si no hay datos, mostrar skeleton

### 3. Usar cache existente (opcional)

- `lib/db/cache-client.ts` ya tiene funciones con `unstable_cache`
- Configurar revalidación apropiada

## Preguntas para决定

1. ¿Persistir en memoria (solo sesión) o también en localStorage?
2. ¿El dashboard también usa el store o sigue haciendo fetch?