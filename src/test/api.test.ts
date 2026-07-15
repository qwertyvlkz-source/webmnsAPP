import { beforeEach, describe, expect, it, vi } from "vitest";
import { api, ApiError } from "@/lib/api";

describe("api client", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("sends JSON and the saved bearer token", async () => {
    localStorage.setItem("auth_token", "test-token");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await api.post("/orders", { service_id: 7 });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/orders",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
        body: JSON.stringify({ service_id: 7 }),
      }),
    );
  });

  it("clears an expired session and emits logout on 401", async () => {
    localStorage.setItem("auth_token", "expired");
    localStorage.setItem("auth_user", JSON.stringify({ id: 1 }));
    const logoutListener = vi.fn();
    window.addEventListener("auth:logout", logoutListener);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    ));

    await expect(api.get("/orders")).rejects.toBeInstanceOf(ApiError);

    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(logoutListener).toHaveBeenCalledOnce();
    window.removeEventListener("auth:logout", logoutListener);
  });

  it("preserves the backend error message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Service not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    ));

    await expect(api.get("/services/999", { noAuth: true })).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Service not found",
    });
  });
});
