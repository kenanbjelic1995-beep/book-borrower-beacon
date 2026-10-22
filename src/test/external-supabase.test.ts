import { describe, expect, it, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({ createClient: vi.fn(() => ({})) }));
vi.mock("@supabase/supabase-js", () => ({ createClient }));

import "@/lib/supabase";

describe("User-owned Supabase connection", () => {
  it("uses the requested instance instead of the Cloud environment", () => {
    expect(createClient).toHaveBeenCalledWith(
      "https://kunhpvffdzefirxohvtf.supabase.co",
      expect.any(String),
      expect.objectContaining({ auth: expect.objectContaining({ storageKey: "bibliotech-external-auth" }) }),
    );
    const key = createClient.mock.calls[0]?.[1] as string | undefined;
    expect(key).toBeDefined();
    const payload = JSON.parse(atob(key?.split(".")[1] ?? ""));
    expect(payload.ref).toBe("kunhpvffdzefirxohvtf");
    expect(payload.role).toBe("anon");
  });
});