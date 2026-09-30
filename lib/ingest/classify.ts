import "server-only";

import { GoogleGenAI } from "@google/genai";

// Configurable por entorno porque Google rota disponibilidad de modelos con
// frecuencia: gemini-3.1-flash-lite devolvia 503 por demanda alta y los
// gemini-2.5-* ya no estan disponibles para cuentas nuevas.
const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";
const TIMEOUT_MS = 10_000;

// El SDK reintenta solo hasta 5 veces con esperas de hasta 60s, lo que puede
// rebasar maxDuration (30s) y hacer que MacroDroid vea un timeout en vez de un
// skip limpio. Lo acotamos para que la falla sea rapida y predecible.
const RETRY_OPTIONS = {
  attempts: 3,
  initialDelay: 0.5,
  maxDelay: 4,
};

export type AccountOption = { id: string; name: string; type: string };
export type CategoryOption = { id: string; name: string; type: string };

export type TransactionType = "income" | "expense";

export type Classification =
  | {
      ok: true;
      amount: number;
      type: TransactionType;
      accountId: string;
      categoryId: string;
      description: string;
    }
  | { ok: false; reason: string };

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    is_transaction: {
      type: "boolean",
      description:
        "false si la notificación NO es un movimiento financiero: promociones, avisos de saldo, códigos de verificación, paquetes, Bienvenida, etc.",
    },
    amount: {
      type: "number",
      description:
        "Monto del movimiento. Número positivo, sin símbolo de moneda y sin separador de miles.",
    },
    type: {
      type: "string",
      enum: ["income", "expense"],
      description: "expense si el dinero sale de la cuenta, income si entra.",
    },
    account_id: {
      type: "string",
      description: "ID exacto de una de las CUENTAS proporcionadas.",
    },
    category_id: {
      type: "string",
      description:
        "ID exacto de una de las CATEGORÍAS proporcionadas cuyo tipo coincida con type.",
    },
    description: {
      type: "string",
      description:
        "Descripción breve en español, máximo 60 caracteres, sin incluir el monto.",
    },
  },
  required: [
    "is_transaction",
    "amount",
    "type",
    "account_id",
    "category_id",
    "description",
  ],
};

const SYSTEM_PROMPT = `Eres un clasificador de notificaciones bancarias para una app de finanzas personales en México.

Tu única tarea es leer una notificación de un banco o comercio y extraer el movimiento financiero.

CUENTAS DISPONIBLES (elige una y devuelve su id exacto):
{ACCOUNTS}

CATEGORÍAS DISPONIBLES (elige una y devuelve su id exacto):
{CATEGORIES}

REGLAS:
- type es "expense" si el dinero SALE de la cuenta e "income" si ENTRA.
- account_id debe salir de la lista de CUENTAS. Si la notificación menciona un banco, tarjeta o tipo de cuenta, elige la que coincida.
- category_id debe salir de la lista de CATEGORÍAS y su tipo debe ser igual a type.
- Si es una transferencia entre cuentas propias del usuario, no hay categoría que calce: devuelve is_transaction false.
- amount es el monto en número positivo, sin "$" y sin comas de miles.
- description en español, máximo 60 caracteres, sin el monto ni el nombre del banco.
- Si no hay un monto claro o es una promoción, un saludo o un código de verificación: is_transaction false.`;

function buildSystemPrompt(
  accounts: AccountOption[],
  categories: CategoryOption[],
) {
  const list = (items: { id: string; name: string; type: string }[]) =>
    items.map((i) => `- ${i.id} | ${i.name} | ${i.type}`).join("\n");

  return SYSTEM_PROMPT.replace("{ACCOUNTS}", list(accounts)).replace(
    "{CATEGORIES}",
    list(categories),
  );
}

function validate(
  parsed: Record<string, unknown>,
  accounts: AccountOption[],
  categories: CategoryOption[],
): Classification {
  if (typeof parsed.is_transaction !== "boolean") {
    return { ok: false, reason: "la respuesta no trae is_transaction" };
  }
  if (!parsed.is_transaction) {
    return {
      ok: false,
      reason: "la notificación no es un movimiento financiero",
    };
  }

  const { amount, type, account_id, category_id, description } = parsed;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return { ok: false, reason: `monto inválido: ${JSON.stringify(amount)}` };
  }
  if (type !== "income" && type !== "expense") {
    return { ok: false, reason: `tipo inválido: ${JSON.stringify(type)}` };
  }

  const account = accounts.find((a) => a.id === account_id);
  if (!account) {
    return {
      ok: false,
      reason: `account_id desconocido: ${JSON.stringify(account_id)}`,
    };
  }

  const category = categories.find((c) => c.id === category_id);
  if (!category) {
    return {
      ok: false,
      reason: `category_id desconocido: ${JSON.stringify(category_id)}`,
    };
  }

  if (category.type !== type) {
    return {
      ok: false,
      reason: `la categoría "${category.name}" es ${category.type} pero el tipo es ${type}`,
    };
  }

  const text = typeof description === "string" ? description.trim() : "";

  return {
    ok: true,
    amount: Math.round(amount * 100) / 100,
    type,
    accountId: account.id,
    categoryId: category.id,
    description: text ? text.slice(0, 120) : "Movimiento sin descripción",
  };
}

export async function classifyTransaction(input: {
  text: string;
  app: string;
  accounts: AccountOption[];
  categories: CategoryOption[];
}): Promise<Classification> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { ok: false, reason: "GEMINI_API_KEY no configurada" };

  const userContent = `Aplicación que generó la notificación: ${input.app}\n\nNotificación:\n${input.text}`;

  let raw: string | undefined;
  try {
    const response = await new GoogleGenAI({
      apiKey,
      httpOptions: { retryOptions: RETRY_OPTIONS },
    }).models.generateContent({
      model: MODEL,
      contents: userContent,
      config: {
        systemInstruction: buildSystemPrompt(input.accounts, input.categories),
        responseMimeType: "application/json",
        responseJsonSchema: RESPONSE_SCHEMA,
        abortSignal: AbortSignal.timeout(TIMEOUT_MS),
      },
    });
    raw = response.text;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: `error de Gemini: ${message}` };
  }

  if (!raw) return { ok: false, reason: "Gemini devolvió una respuesta vacía" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "Gemini devolvió JSON inválido" };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, reason: "Gemini devolvió algo que no es un objeto" };
  }

  return validate(
    parsed as Record<string, unknown>,
    input.accounts,
    input.categories,
  );
}
