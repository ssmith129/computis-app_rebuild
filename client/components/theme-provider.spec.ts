import { describe, it, expect } from "vitest";
import { resolveTheme } from "./theme-provider";

describe("resolveTheme", () => {
  it("returns the explicit choice for light/dark regardless of OS", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the OS preference when set to system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});
