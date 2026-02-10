import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

export function generateResi(courier: string): string {
    const prefixMap: Record<string, string> = {
        JNE: "JNE",
        POS_INDONESIA: "POS Indonesia",
        JNT: "JNT",
        JNT_CARGO: "JNT Cargo",
        SICEPAT: "SiCepat",
        TIKI: "Tiki",
        ANTERAJA: "AnterAja",
        WAHANA: "Wahana",
        NINJA: "Ninja",
        LION: "Lion",
        PCP_EXPRESS: "PCP Express",
        JET_EXPRESS: "JET Express",
        REX_EXPRESS: "REX Express",
        FIRST_LOGISTICS: "First Logistics",
        ID_EXPRESS: "ID Express",
        SHOPEE_EXPRESS: "Shopee Express",
        KGXPRESS: "KGXpress",
        SAP_EXPRESS: "SAP Express",
        JX_EXPRESS: "JX Express",
        RPX: "RPX",
        LAZADA_EXPRESS: "Lazada Express",
        INDAH_CARGO: "Indah Cargo",
        DAKOTA_CARGO: "Dakota Cargo",
        KURIR_REKOMENDASI: "Kurir Rekomendasi",
        LIST_COURIER: "List Courier",
        CHECK_QUOTA_HIT: "Check Quota/HIT",
    };

    const prefix = prefixMap[courier.toLowerCase()] || courier.toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const unique = nanoid();

  return `${prefix}${date}${unique}`;
}