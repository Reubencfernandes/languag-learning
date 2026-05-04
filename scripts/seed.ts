import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { stories } from "../lib/db/schema";

const connectionString = process.env.DATABASE_URL ?? "postgres://langlearn:langlearn@localhost:5432/langlearn";
const client = postgres(connectionString);
const db = drizzle(client);

type SeedStory = {
  targetLang: string;
  level: string;
  title: string;
  content: string;
  vocab: Array<{ word: string; gloss: string }>;
};

const seed: SeedStory[] = [
  // --- Spanish A1 ---
  {
    targetLang: "es",
    level: "A1",
    title: "El desayuno de Ana",
    content:
      "Ana se levanta a las siete. Ella va a la cocina. Ana bebe un café y come pan con mantequilla. Su gato duerme en la silla. Después, Ana abre la ventana. Hace sol. Ella sonríe y dice: \"Hoy es un buen día.\"",
    vocab: [
      { word: "desayuno", gloss: "breakfast" },
      { word: "se levanta", gloss: "gets up" },
      { word: "cocina", gloss: "kitchen" },
      { word: "bebe", gloss: "drinks" },
      { word: "pan", gloss: "bread" },
      { word: "mantequilla", gloss: "butter" },
      { word: "gato", gloss: "cat" },
      { word: "silla", gloss: "chair" },
      { word: "ventana", gloss: "window" },
      { word: "sonríe", gloss: "smiles" },
    ],
  },
  {
    targetLang: "es",
    level: "A1",
    title: "En el parque",
    content:
      "Luis y María están en el parque. Hay muchos árboles y flores. Luis lee un libro. María escucha música. Un perro corre cerca de ellos. El perro es grande y amable. María le da agua. Luis dice: \"Me gusta este parque.\"",
    vocab: [
      { word: "parque", gloss: "park" },
      { word: "árboles", gloss: "trees" },
      { word: "flores", gloss: "flowers" },
      { word: "libro", gloss: "book" },
      { word: "música", gloss: "music" },
      { word: "perro", gloss: "dog" },
      { word: "corre", gloss: "runs" },
      { word: "amable", gloss: "friendly" },
      { word: "agua", gloss: "water" },
    ],
  },
  {
    targetLang: "es",
    level: "A1",
    title: "La tienda pequeña",
    content:
      "Hay una tienda pequeña en la calle. La tienda vende frutas, pan y leche. El señor García trabaja allí. Él es muy amable. Los niños compran manzanas rojas. El señor García dice: \"Adiós, hasta mañana.\"",
    vocab: [
      { word: "tienda", gloss: "shop" },
      { word: "calle", gloss: "street" },
      { word: "vende", gloss: "sells" },
      { word: "frutas", gloss: "fruits" },
      { word: "leche", gloss: "milk" },
      { word: "trabaja", gloss: "works" },
      { word: "niños", gloss: "children" },
      { word: "manzanas", gloss: "apples" },
      { word: "rojas", gloss: "red" },
    ],
  },
  // --- Spanish A2 ---
  {
    targetLang: "es",
    level: "A2",
    title: "El viaje al mar",
    content:
      "El verano pasado, mi familia y yo fuimos al mar. Llegamos al hotel por la tarde. Mi hermano quería nadar inmediatamente, pero yo tenía hambre. Comimos pescado fresco en un restaurante cerca de la playa. Después, caminamos por la arena mientras el sol bajaba. Mi madre dijo que era el día más bonito del verano. Volvimos al hotel cansados, pero muy felices.",
    vocab: [
      { word: "verano", gloss: "summer" },
      { word: "mar", gloss: "sea" },
      { word: "hotel", gloss: "hotel" },
      { word: "hermano", gloss: "brother" },
      { word: "nadar", gloss: "to swim" },
      { word: "pescado", gloss: "fish (food)" },
      { word: "playa", gloss: "beach" },
      { word: "caminamos", gloss: "we walked" },
      { word: "arena", gloss: "sand" },
      { word: "cansados", gloss: "tired" },
    ],
  },
  {
    targetLang: "es",
    level: "A2",
    title: "El perro perdido",
    content:
      "Ayer encontré un perro pequeño en mi jardín. Estaba mojado y tenía frío. Le di comida y una manta. Mi vecina vino y dijo que conocía al dueño, un hombre mayor que vivía en la esquina. Llamamos al hombre y él vino rápidamente. Cuando vio al perro, sus ojos se llenaron de lágrimas. Me dio las gracias muchas veces. Sentí que había hecho algo bueno.",
    vocab: [
      { word: "ayer", gloss: "yesterday" },
      { word: "jardín", gloss: "garden" },
      { word: "mojado", gloss: "wet" },
      { word: "frío", gloss: "cold" },
      { word: "manta", gloss: "blanket" },
      { word: "vecina", gloss: "neighbor (f)" },
      { word: "dueño", gloss: "owner" },
      { word: "esquina", gloss: "corner" },
      { word: "lágrimas", gloss: "tears" },
    ],
  },
  // --- French A1 ---
  {
    targetLang: "fr",
    level: "A1",
    title: "Le petit déjeuner de Sophie",
    content:
      "Sophie se lève à sept heures. Elle va dans la cuisine. Elle boit un café et mange du pain avec du beurre. Son chat dort sur la chaise. Puis Sophie ouvre la fenêtre. Il fait beau. Elle sourit et dit : « Aujourd'hui est un beau jour. »",
    vocab: [
      { word: "petit déjeuner", gloss: "breakfast" },
      { word: "se lève", gloss: "gets up" },
      { word: "cuisine", gloss: "kitchen" },
      { word: "boit", gloss: "drinks" },
      { word: "pain", gloss: "bread" },
      { word: "beurre", gloss: "butter" },
      { word: "chat", gloss: "cat" },
      { word: "chaise", gloss: "chair" },
      { word: "fenêtre", gloss: "window" },
      { word: "sourit", gloss: "smiles" },
    ],
  },
  {
    targetLang: "fr",
    level: "A1",
    title: "Au marché",
    content:
      "C'est samedi matin. Paul et Claire sont au marché. Il y a beaucoup de fruits et de légumes. Paul achète des pommes et des carottes. Claire choisit du fromage. Ils parlent avec le vendeur. Le vendeur est gentil. Ils rentrent à la maison avec un grand panier.",
    vocab: [
      { word: "marché", gloss: "market" },
      { word: "fruits", gloss: "fruits" },
      { word: "légumes", gloss: "vegetables" },
      { word: "pommes", gloss: "apples" },
      { word: "carottes", gloss: "carrots" },
      { word: "fromage", gloss: "cheese" },
      { word: "vendeur", gloss: "seller" },
      { word: "gentil", gloss: "kind" },
      { word: "panier", gloss: "basket" },
    ],
  },
  // --- German A1 ---
  {
    targetLang: "de",
    level: "A1",
    title: "Ein Tag im Park",
    content:
      "Lena geht mit ihrem Hund in den Park. Die Sonne scheint. Die Kinder spielen Fußball. Lena setzt sich auf eine Bank. Sie liest ein Buch. Ihr Hund schläft unter dem Baum. Ein Vogel singt laut. Lena lächelt. Der Tag ist schön.",
    vocab: [
      { word: "Park", gloss: "park" },
      { word: "Hund", gloss: "dog" },
      { word: "Sonne", gloss: "sun" },
      { word: "Kinder", gloss: "children" },
      { word: "Fußball", gloss: "soccer" },
      { word: "Bank", gloss: "bench" },
      { word: "liest", gloss: "reads" },
      { word: "Buch", gloss: "book" },
      { word: "Baum", gloss: "tree" },
      { word: "Vogel", gloss: "bird" },
    ],
  },
];

async function main() {
  console.log(`Seeding ${seed.length} stories…`);
  await db.insert(stories).values(seed);
  console.log("Done.");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
