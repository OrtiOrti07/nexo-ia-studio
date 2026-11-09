import { deliverContact } from "@/lib/contact/deliver";
import {
  normalizeContact,
  validateContact,
  type ContactResponse,
} from "@/lib/contact/schema";

const json = (body: ContactResponse, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ status: "invalid", errors: {} }, 400);
  }

  const input = normalizeContact(raw);

  // Si el campo trampa viene relleno, lo tratamos como spam sin dar pistas.
  if (input.website) return json({ status: "delivered" });

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) return json({ status: "invalid", errors }, 422);

  const result = await deliverContact(input);

  if (result.status === "failed") {
    console.error("[contacto] Error al enviar el mensaje:", result.reason);
    return json({ status: "failed" }, 502);
  }

  return json(result);
}
