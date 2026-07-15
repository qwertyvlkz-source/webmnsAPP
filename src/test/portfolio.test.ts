import { describe, expect, it } from "vitest";
import { pickLocale, resolveImageUrl } from "@/lib/portfolio";

describe("portfolio helpers", () => {
  it("selects the active locale and falls back predictably", () => {
    expect(pickLocale({ uk: "Проєкт", en: "Project" }, "uk")).toBe("Проєкт");
    expect(pickLocale({ en: "Project" }, "de")).toBe("Project");
    expect(pickLocale("Plain title", "pl")).toBe("Plain title");
  });

  it("normalizes relative image URLs", () => {
    expect(resolveImageUrl("/uploads/project.png")).toBe("https://webmns.com/uploads/project.png");
    expect(resolveImageUrl("https://cdn.example.com/project.png")).toBe("https://cdn.example.com/project.png");
    expect(resolveImageUrl(null)).toBeNull();
  });
});
