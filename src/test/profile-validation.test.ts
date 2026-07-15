import { describe, expect, it } from "vitest";
import { getLoginValidationKey, getRegistrationValidationKey } from "@/lib/profile-validation";

describe("profile form validation", () => {
  it("validates login fields before calling the API", () => {
    expect(getLoginValidationKey("", "")).toBe("profile.login.emailRequired");
    expect(getLoginValidationKey("client@example.com", "")).toBe("profile.login.passwordRequired");
    expect(getLoginValidationKey("client@example.com", "secret")).toBeNull();
  });

  it("validates registration fields in a useful order", () => {
    expect(getRegistrationValidationKey("", "client@example.com", "password", "password")).toBe("profile.login.nameRequired");
    expect(getRegistrationValidationKey("Client", "bad-email", "password", "password")).toBe("profile.login.emailRequired");
    expect(getRegistrationValidationKey("Client", "client@example.com", "short", "short")).toBe("settings.passwordMin");
    expect(getRegistrationValidationKey("Client", "client@example.com", "password", "different")).toBe("settings.passwordMismatch");
    expect(getRegistrationValidationKey("Client", "client@example.com", "password", "password")).toBeNull();
  });
});
