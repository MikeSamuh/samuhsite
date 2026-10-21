// The admin's document store. Small JSON documents under string keys: page
// content, blog posts, magic-link tokens. Two backends behind one interface:
//
//   Upstash Redis   on Vercel, through the Marketplace integration. Set
//                   UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or
//                   the KV_REST_API_* pair the integration also writes)
//   local files     .data/store on the machine running `next dev`, so the
//                   admin works with nothing provisioned. Never committed
//
// Server only. Nothing here runs in the browser or in middleware.

import fs from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

export interface Store {
  get<T>(key: string): Promise<T | null>;
  /** ttl in seconds, for tokens; omit for documents that live until deleted */
  set<T>(key: string, value: T, opts?: { ttl?: number }): Promise<void>;
  del(key: string): Promise<void>;
  /** every key under a prefix, for example "post:" */
  list(prefix: string): Promise<string[]>;
}

export type StoreKind = "upstash" | "file";

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

export function storeKind(): StoreKind {
  return redisConfig() ? "upstash" : "file";
}

function redisStore(cfg: { url: string; token: string }): Store {
  const redis = new Redis({ url: cfg.url, token: cfg.token });
  return {
    async get<T>(key: string) {
      const v = await redis.get<T>(key);
      return v ?? null;
    },
    async set(key, value, opts) {
      if (opts?.ttl) await redis.set(key, value, { ex: opts.ttl });
      else await redis.set(key, value);
    },
    async del(key) {
      await redis.del(key);
    },
    async list(prefix) {
      const keys: string[] = [];
      let cursor = "0";
      do {
        const [next, batch] = await redis.scan(cursor, { match: `${prefix}*`, count: 200 });
        keys.push(...batch);
        cursor = String(next);
      } while (cursor !== "0");
      return keys.sort();
    },
  };
}

const FILE_DIR = path.join(process.cwd(), ".data", "store");

function fileStore(): Store {
  const fileFor = (key: string) => path.join(FILE_DIR, `${encodeURIComponent(key)}.json`);
  const read = (key: string): { v: unknown; exp?: number } | null => {
    const f = fileFor(key);
    if (!fs.existsSync(f)) return null;
    try {
      return JSON.parse(fs.readFileSync(f, "utf8"));
    } catch {
      return null;
    }
  };
  return {
    async get<T>(key: string) {
      const rec = read(key);
      if (!rec) return null;
      if (rec.exp && rec.exp < Date.now()) {
        fs.rmSync(fileFor(key), { force: true });
        return null;
      }
      return rec.v as T;
    },
    async set(key, value, opts) {
      fs.mkdirSync(FILE_DIR, { recursive: true });
      const rec = { v: value, ...(opts?.ttl ? { exp: Date.now() + opts.ttl * 1000 } : {}) };
      fs.writeFileSync(fileFor(key), JSON.stringify(rec, null, 2));
    },
    async del(key) {
      fs.rmSync(fileFor(key), { force: true });
    },
    async list(prefix) {
      if (!fs.existsSync(FILE_DIR)) return [];
      return fs
        .readdirSync(FILE_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => decodeURIComponent(f.slice(0, -5)))
        .filter((k) => k.startsWith(prefix))
        .sort();
    },
  };
}

let instance: Store | null = null;

export function store(): Store {
  if (instance) return instance;
  const cfg = redisConfig();
  instance = cfg ? redisStore(cfg) : fileStore();
  return instance;
}
