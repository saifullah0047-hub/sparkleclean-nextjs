import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dataRaw from "@/data/data.json";
import type { ServiceItem } from "@/data/types";

/* ------------------------------------------------------------------ */
/*  Service knowledge – sourced entirely from data.json                */
/* ------------------------------------------------------------------ */

const homeServices = (
  dataRaw as { home: { services: { items: ServiceItem[] } } }
).home.services.items;

const specializedServices = (
  dataRaw as { services: { specialized: { items: ServiceItem[] } } }
).services.specialized.items;

const allServices = [...homeServices, ...specializedServices];

function serviceCatalogText(): string {
  return allServices
    .map(
      (s) =>
        `- ${s.title}: ${s.price} (${s.note}). ${s.desc}`
    )
    .join("\n");
}

function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildRecommendation(serviceTitle: string, why: string[]) {
  const svc = allServices.find((s) => s.title.toLowerCase() === serviceTitle.toLowerCase());
  return {
    title: svc?.title ?? serviceTitle,
    price: svc?.price ?? "We'll provide your exact price after a few details.",
    why,
    bookingId: slugFromTitle(svc?.title ?? serviceTitle),
    bookingPage: "/book",
    quotePage: "/contact",
  };
}

/* Keyword maps for each area + condition */
const AREA_KW: Record<string, string[]> = {
  kitchen: [
    "kitchen",
    "grease",
    "oven",
    "stove",
    "appliance",
    "countertop",
    "cabinet",
    "fridge",
    "refrigerator",
    "microwave",
    "sink",
    "food",
    "cooking",
    "range",
    "hood",
    "dishwasher",
  ],
  bathroom: [
    "bathroom",
    "shower",
    "tub",
    "toilet",
    "tile",
    "grout",
    "faucet",
    "sink",
    "mirror",
    "mildew",
    "mold",
    "vanity",
  ],
  "living room": [
    "living room",
    "lounge",
    "sofa",
    "couch",
    "carpet",
    "upholstery",
    "dusting",
    "tv",
    "entertainment",
    "coffee table",
  ],
  bedroom: [
    "bedroom",
    "bed",
    "mattress",
    "closet",
    "nightstand",
    "sheets",
    "linen",
    "wardrobe",
  ],
  "whole house": [
    "house",
    "home",
    "whole",
    "entire",
    "every room",
    "all rooms",
    "property",
    "apartment",
    "flat",
    "condo",
  ],
};

const INTENSITY_KW: Record<string, string[]> = {
  deep: [
    "deep",
    "intensive",
    "thorough",
    "grime",
    "buildup",
    "built-up",
    "heavy",
    "stain",
    "stubborn",
    "neglected",
    "spring clean",
    "detail",
  ],
  move: [
    "move",
    "moving",
    "move-in",
    "move-out",
    "deposit",
    "tenant",
    "landlord",
    "end of lease",
    "end of tenancy",
    "vacating",
  ],
  commercial: [
    "office",
    "commercial",
    "business",
    "retail",
    "store",
    "restaurant",
    "workplace",
    "corporate",
    "shop",
  ],
  carpet: [
    "carpet",
    "rug",
    "upholstery",
    "sofa",
    "couch",
    "fabric",
    "stain removal",
    "extraction",
  ],
  window: [
    "window",
    "glass",
    "mirror",
    "streak",
    "pane",
    "partition",
    "glazing",
  ],
  maintenance: [
    "regular",
    "weekly",
    "bi-weekly",
    "monthly",
    "routine",
    "maintenance",
    "tidy",
    "upkeep",
    "standard",
  ],
};

function matchArea(input: string): string[] {
  const lower = input.toLowerCase();
  const matches: string[] = [];
  for (const [area, keywords] of Object.entries(AREA_KW)) {
    if (keywords.some((kw) => lower.includes(kw))) matches.push(area);
  }
  return matches;
}

function matchIntensity(input: string): string {
  const lower = input.toLowerCase();
  for (const [level, keywords] of Object.entries(INTENSITY_KW)) {
    if (keywords.some((kw) => lower.includes(kw))) return level;
  }
  return "";
}

function getRecommendation(userText: string): {
  service: string;
  why: string[];
  extras: string[];
} {
  const areas = matchArea(userText);
  const intensity = matchIntensity(userText);
  const lower = userText.toLowerCase();

  if (intensity === "commercial") {
    return {
      service: "Commercial Cleaning",
      why: [
        "Tailored for offices, retail & commercial spaces",
        "After-hours scheduling available",
        "Sanitisation and surface care included",
      ],
      extras: [],
    };
  }

  if (
    intensity === "carpet" ||
    areas.includes("living room") &&
      (lower.includes("carpet") || lower.includes("sofa") || lower.includes("upholstery"))
  ) {
    return {
      service: "Deep Cleaning",
      why: [
        "Deep extraction removes embedded dirt and allergens",
        "Carpets and upholstery restored to fresh condition",
        "Safe, eco-friendly products used throughout",
      ],
      extras: ["Carpet Cleaning"],
    };
  }

  if (intensity === "window") {
    return {
      service: "Residential Cleaning",
      why: [
        "Streak-free interior window and glass cleaning",
        "Mirrors and glass surfaces polished to a shine",
        "Can be combined with any residential service",
      ],
      extras: ["Window & Glass"],
    };
  }

  if (intensity === "move") {
    return {
      service: "Move-Out Cleaning",
      why: [
        "Turnover-perfect cleaning for move-out condition",
        "Protects your security deposit",
        "Inside appliances, cabinets and every surface addressed",
      ],
      extras: [],
    };
  }

  if (intensity === "deep") {
    if (areas.includes("kitchen")) {
      return {
        service: "Deep Cleaning",
        why: [
          "Removes built-up grease and grime",
          "Deep-cleans inside oven, fridge and appliances",
          "Cleans hard-to-reach areas behind and under surfaces",
        ],
        extras: [],
      };
    }
    if (areas.includes("bathroom")) {
      return {
        service: "Deep Cleaning",
        why: [
          "Deep-scrubs tiles, grout and fixtures",
          "Removes mildew, soap scum and water stains",
          "Sanitises toilet, shower and vanity areas",
        ],
        extras: [],
      };
    }
    return {
      service: "Deep Cleaning",
      why: [
        "Detail-focused cleaning for heavy buildup",
        "Covers inside appliances, baseboards and hidden areas",
        "Allergen and grime removal throughout",
      ],
      extras: [],
    };
  }

  if (
    areas.includes("whole house") ||
    areas.length === 0
  ) {
    if (lower.includes("regular") || lower.includes("weekly") || lower.includes("maintenance")) {
      return {
        service: "Residential Cleaning",
        why: [
          "Regular cleaning tailored to your home",
          "Kitchens, bathrooms, living areas and floors covered",
          "Flexible weekly or bi-weekly scheduling",
        ],
        extras: [],
      };
    }
    return {
      service: "Residential Cleaning",
      why: [
        "Meticulous cleaning of every room in your home",
        "Kitchens, bathrooms, living areas and floors included",
        "Eco-friendly products and vetted professionals",
      ],
      extras: [],
    };
  }

  if (areas.includes("kitchen")) {
    const extras: string[] = [];
    const why: string[] = [
      "Degreases surfaces, countertops and backsplash",
      "Cleans inside appliances and cabinetry",
    ];
    if (lower.includes("oven")) {
      why.push("Oven deep-clean removes baked-on grease");
    }
    if (lower.includes("fridge") || lower.includes("refrigerator")) {
      why.push("Refrigerator interior cleaned and sanitised");
    }
    return { service: "Deep Cleaning", why, extras };
  }

  if (areas.includes("bathroom")) {
    return {
      service: "Deep Cleaning",
      why: [
        "Deep-scrubs tiles, grout and fixtures",
        "Removes mildew, soap scum and water stains",
        "Sanitises toilet, shower and vanity areas",
      ],
      extras: [],
    };
  }

  if (areas.includes("bedroom")) {
    return {
      service: "Residential Cleaning",
      why: [
        "Thorough bedroom cleaning and dusting",
        "Bed surfaces, nightstands and floors addressed",
        "Creates a fresh, healthy sleeping environment",
      ],
      extras: [],
    };
  }

  if (areas.includes("living room")) {
    return {
      service: "Residential Cleaning",
      why: [
        "Vacuums upholstery and floors thoroughly",
        "Dusts surfaces, shelves and entertainment areas",
        "Leaves living spaces fresh and inviting",
      ],
      extras: [],
    };
  }

  return {
    service: "Residential Cleaning",
    why: [
      "Comprehensive cleaning for every room",
      "Customised to your home's needs",
      "Eco-friendly products and professional care",
    ],
    extras: [],
  };
}

function generateRuleBasedResponse(userText: string): {
  message: string;
  recommendedService: string | null;
  serviceId: string | null;
  price: string | null;
  reason: string[];
  showBookButton: boolean;
  showQuoteButton: boolean;
} {
  const { service, why, extras } = getRecommendation(userText);
  const recommendation = buildRecommendation(service, why);

  const extraText =
    extras.length > 0
      ? `\n\nI'd also recommend adding: **${extras.join(", ")}**`
      : "";

  return {
    message: `Based on your description, I recommend our **${service}** service.${extraText}`,
    recommendedService: service,
    serviceId: recommendation.bookingId,
    price: recommendation.price,
    reason: why,
    showBookButton: true,
    showQuoteButton: true,
  };
}

/* ------------------------------------------------------------------ */
/*  System prompt                                                      */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are CleanAI, a friendly and knowledgeable cleaning assistant for SparkleClean, a premium cleaning service company. Your job is to help customers find the right cleaning service based on their needs.

## AVAILABLE SERVICES (use ONLY these — never invent new ones)

${serviceCatalogText()}

## RULES

1. **NEVER invent services, prices, availability, discounts, or business information.** All prices and details must come strictly from the service catalog above.
2. When recommending a service, you MUST respond with a JSON object inside a \`\`\`json code block with this exact structure:
   \`\`\`json
   {
     "message": "Your conversational reply to the user",
     "recommendedService": "Exact service title from catalog",
     "serviceId": "slugified service title (lowercase, hyphens)",
     "price": "the exact price from the catalog",
     "reason": "Why this service fits their needs (array of strings, each a short sentence)",
     "showBookButton": true,
     "showQuoteButton": true
   }
   \`\`\`
3. If the user asks about a service we don't offer (e.g. car washing, lawn care), set \`recommendedService\` to null, \`serviceId\` to null, \`price\` to null, \`reason\` to [], and explain politely that we don't offer that service, then list what we DO offer.
4. If the user's message is a general question (pricing policy, availability, guarantees, etc.), set \`recommendedService\` to null and provide a helpful answer.
5. If you need more information to recommend a service, ask a follow-up question. Set \`recommendedService\` to null, \`showBookButton\` to false, \`showQuoteButton\` to false, and ask a concise, relevant follow-up.
6. Be conversational, friendly, and concise. Keep messages under 150 words.
7. When you recommend a service, explain WHY it fits based on the customer's specific situation.
8. Use the exact prices from the catalog. Format as shown (e.g. "$129", "From $89").
9. When asked "what services do you offer" or similar, list them briefly with prices.

## RESPONSE FORMAT

Always respond with valid JSON in a \`\`\`json code block. Example:
\`\`\`json
{
  "message": "Based on your kitchen grease and dirty oven, I recommend our Deep Cleaning service which covers appliance interiors thoroughly.",
  "recommendedService": "Deep Cleaning",
  "serviceId": "deep-cleaning",
  "price": "$399",
  "reason": ["Removes built-up grease and grime", "Deep-cleans inside oven, fridge and appliances", "Covers hard-to-reach areas"],
  "showBookButton": true,
  "showQuoteButton": true
}
\`\`\`

For follow-up questions (no recommendation yet):
\`\`\`json
{
  "message": "Sure! Is this a regular cleaning or a deep cleaning you're looking for?",
  "recommendedService": null,
  "serviceId": null,
  "price": null,
  "reason": [],
  "showBookButton": false,
  "showQuoteButton": false
}
\`\`\`

For unsupported services:
\`\`\`json
{
  "message": "Sorry, we don't offer car washing services. We specialize in home and office cleaning: Residential ($129), Commercial ($299), Deep Cleaning ($399), Move-Out ($349), Carpet (from $89), Upholstery (from $119), and Window & Glass (from $139). Would any of these interest you?",
  "recommendedService": null,
  "serviceId": null,
  "price": null,
  "reason": [],
  "showBookButton": false,
  "showQuoteButton": false
}
\`\`\`

IMPORTANT: Always output your full response as just the JSON code block. Do NOT include any text outside the code block.`;

/* ------------------------------------------------------------------ */
/*  Request validation                                                 */
/* ------------------------------------------------------------------ */

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 20;

type ChatMessage = { role: "user" | "assistant"; content: string };

type RequestBody = {
  message: string;
  history?: ChatMessage[];
};

function parseBody(body: unknown): RequestBody | string {
  if (!body || typeof body !== "object") return "Invalid request body";
  const obj = body as Record<string, unknown>;
  if (typeof obj.message !== "string" || !obj.message.trim()) {
    return "Missing or invalid message field";
  }
  if (obj.message.length > MAX_MESSAGE_LENGTH) {
    return `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`;
  }
  if (obj.history !== undefined) {
    if (!Array.isArray(obj.history)) return "history must be an array";
    if (obj.history.length > MAX_HISTORY) {
      return `Too many history messages (max ${MAX_HISTORY})`;
    }
    for (const h of obj.history) {
      if (!h || typeof h !== "object") return "Invalid history entry";
      const entry = h as Record<string, unknown>;
      if (entry.role !== "user" && entry.role !== "assistant") {
        return "Invalid history role";
      }
      if (typeof entry.content !== "string") {
        return "Invalid history content";
      }
    }
  }
  return { message: obj.message.trim(), history: (obj.history as ChatMessage[]) || [] };
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                       */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  let message = "";
  try {
    const rawBody = await request.json();
    const parsed = parseBody(rawBody);
    if (typeof parsed === "string") {
      return NextResponse.json(
        { success: false, message: parsed },
        { status: 400 }
      );
    }

    message = parsed.message;
    const history = parsed.history ?? [];
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable is not set");
      return NextResponse.json(
        { success: false, message: "AI assistant is not configured. Please contact support." },
        { status: 500 }
      );
    }

    /* Build conversation for Gemini */
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 600,
      },
    });

    /* Build chat history for Gemini format */
    const chatHistory = history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({ history: chatHistory });

    /* Call Gemini API with timeout */
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let result;
    let useFallback = false;
    try {
      result = await chat.sendMessage(message);
    } catch (err) {
      useFallback = true;
      console.error("Gemini API error, using rule-based fallback:", err);
    }
    clearTimeout(timeout);

    let validatedResponse: {
      success: true;
      message: string;
      recommendedService: string | null;
      serviceId: string | null;
      price: string | null;
      reason: string[];
      showBookButton: boolean;
      showQuoteButton: boolean;
    };

    if (useFallback || !result) {
      /* Rule-based fallback */
      const fallback = generateRuleBasedResponse(message);
      validatedResponse = {
        success: true,
        ...fallback,
      };
    } else {
      const response = result.response;
      const raw = response.text();

      if (typeof raw !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "AI returned an invalid response. Please try again.",
          },
          { status: 502 }
        );
      }

      /* Extract JSON from the response (may be wrapped in ```json ... ```) */
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/\{[\s\S]*\}/);
      let parsedResponse: Record<string, unknown>;

      try {
        parsedResponse = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : raw);
      } catch {
        /* If JSON parsing fails, wrap the raw text as a message */
        parsedResponse = {
          message: raw,
          recommendedService: null,
          serviceId: null,
          price: null,
          reason: [],
          showBookButton: false,
          showQuoteButton: false,
        };
      }

      /* Validate and sanitize the response */
      validatedResponse = {
        success: true,
        message: typeof parsedResponse.message === "string" ? parsedResponse.message : "I'm here to help with your cleaning needs!",
        recommendedService: typeof parsedResponse.recommendedService === "string" ? parsedResponse.recommendedService : null,
        serviceId: typeof parsedResponse.serviceId === "string" ? parsedResponse.serviceId : null,
        price: typeof parsedResponse.price === "string" ? parsedResponse.price : null,
        reason: Array.isArray(parsedResponse.reason) ? parsedResponse.reason.filter((r): r is string => typeof r === "string") : [],
        showBookButton: typeof parsedResponse.showBookButton === "boolean" ? parsedResponse.showBookButton : false,
        showQuoteButton: typeof parsedResponse.showQuoteButton === "boolean" ? parsedResponse.showQuoteButton : false,
      };

      /* Extra safety: ensure the recommended service actually exists */
      if (validatedResponse.recommendedService) {
        const exists = allServices.some(
          (s) => s.title.toLowerCase() === validatedResponse.recommendedService!.toLowerCase()
        );
        if (!exists) {
          validatedResponse.recommendedService = null;
          validatedResponse.serviceId = null;
          validatedResponse.price = null;
          validatedResponse.reason = [];
          validatedResponse.showBookButton = false;
        }
      }
    }

    return NextResponse.json(validatedResponse, { status: 200 });
  } catch (error) {
    console.error("AI assistant error:", error);
    const fallback = generateRuleBasedResponse(message || "clean my kitchen");
    return NextResponse.json(
      {
        success: true,
        ...fallback,
      },
      { status: 200 }
    );
  }
}