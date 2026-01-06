import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cn,
  formatCurrency,
  formatDate,
  formatDateShort,
  formatRelativeTime,
  truncate,
  generateRandomString,
  ACCEPTED_FILE_TYPES,
  getAcceptedFileTypesString,
  MAX_FILE_SIZE,
  isValidFileType,
  isValidFileSize,
  sleep,
} from "@/lib/utils";

describe("cn (className merger)", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should merge tailwind classes correctly", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
  });

  it("should handle arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should handle objects", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });
});

describe("formatCurrency", () => {
  it("should format EUR currency by default", () => {
    const result = formatCurrency(10.99);
    expect(result).toContain("10.99");
    expect(result).toMatch(/€|EUR/);
  });

  it("should format USD currency", () => {
    const result = formatCurrency(99.99, "USD");
    expect(result).toContain("99.99");
    expect(result).toMatch(/\$|USD/);
  });

  it("should format GBP currency", () => {
    const result = formatCurrency(50, "GBP");
    expect(result).toContain("50");
  });

  it("should handle zero amounts", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("should handle large amounts", () => {
    const result = formatCurrency(1000000);
    expect(result).toContain("1,000,000");
  });

  it("should handle decimal amounts", () => {
    const result = formatCurrency(19.99);
    expect(result).toContain("19.99");
  });
});

describe("formatDate", () => {
  it("should format Date object", () => {
    const date = new Date("2024-01-15");
    const result = formatDate(date);
    expect(result).toBe("January 15, 2024");
  });

  it("should format date string", () => {
    const result = formatDate("2024-06-20");
    expect(result).toBe("June 20, 2024");
  });

  it("should format ISO date string", () => {
    const result = formatDate("2024-12-25T10:30:00Z");
    expect(result).toContain("December");
    expect(result).toContain("2024");
  });
});

describe("formatDateShort", () => {
  it("should format date with short month", () => {
    const date = new Date("2024-01-15");
    const result = formatDateShort(date);
    expect(result).toBe("Jan 15, 2024");
  });

  it("should format date string with short month", () => {
    const result = formatDateShort("2024-06-20");
    expect(result).toBe("Jun 20, 2024");
  });
});

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "just now" for recent times', () => {
    const now = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(now);
    const recent = new Date("2024-01-15T11:59:30Z");
    expect(formatRelativeTime(recent)).toBe("just now");
  });

  it("should return minutes ago", () => {
    const now = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(now);
    const past = new Date("2024-01-15T11:45:00Z");
    expect(formatRelativeTime(past)).toBe("15m ago");
  });

  it("should return hours ago", () => {
    const now = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(now);
    const past = new Date("2024-01-15T09:00:00Z");
    expect(formatRelativeTime(past)).toBe("3h ago");
  });

  it("should return days ago", () => {
    const now = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(now);
    const past = new Date("2024-01-13T12:00:00Z");
    expect(formatRelativeTime(past)).toBe("2d ago");
  });

  it("should return formatted date for older times", () => {
    const now = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(now);
    const old = new Date("2024-01-01T12:00:00Z");
    const result = formatRelativeTime(old);
    expect(result).toBe("Jan 1, 2024");
  });
});

describe("truncate", () => {
  it("should not truncate short strings", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("should truncate long strings", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...");
  });

  it("should handle exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("should handle empty string", () => {
    expect(truncate("", 10)).toBe("");
  });

  it("should handle single character", () => {
    expect(truncate("A", 1)).toBe("A");
    expect(truncate("AB", 1)).toBe("A...");
  });
});

describe("generateRandomString", () => {
  it("should generate string of default length (32)", () => {
    const result = generateRandomString();
    expect(result).toHaveLength(32);
  });

  it("should generate string of specified length", () => {
    expect(generateRandomString(10)).toHaveLength(10);
    expect(generateRandomString(64)).toHaveLength(64);
  });

  it("should only contain alphanumeric characters", () => {
    const result = generateRandomString(100);
    expect(result).toMatch(/^[A-Za-z0-9]+$/);
  });

  it("should generate unique strings", () => {
    const str1 = generateRandomString();
    const str2 = generateRandomString();
    expect(str1).not.toBe(str2);
  });

  it("should handle zero length", () => {
    expect(generateRandomString(0)).toBe("");
  });
});

describe("ACCEPTED_FILE_TYPES", () => {
  it("should include PDF", () => {
    expect(ACCEPTED_FILE_TYPES["application/pdf"]).toEqual([".pdf"]);
  });

  it("should include Word documents", () => {
    expect(ACCEPTED_FILE_TYPES["application/msword"]).toEqual([".doc"]);
    expect(
      ACCEPTED_FILE_TYPES[
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ]
    ).toEqual([".docx"]);
  });

  it("should include text files", () => {
    expect(ACCEPTED_FILE_TYPES["text/plain"]).toEqual([".txt"]);
    expect(ACCEPTED_FILE_TYPES["text/csv"]).toEqual([".csv"]);
  });
});

describe("getAcceptedFileTypesString", () => {
  it("should return comma-separated extensions", () => {
    const result = getAcceptedFileTypesString();
    expect(result).toContain(".pdf");
    expect(result).toContain(".doc");
    expect(result).toContain(".docx");
    expect(result).toContain(".txt");
    expect(result).toContain(".csv");
  });
});

describe("MAX_FILE_SIZE", () => {
  it("should be 50MB", () => {
    expect(MAX_FILE_SIZE).toBe(50 * 1024 * 1024);
  });
});

describe("isValidFileType", () => {
  it("should accept PDF files", () => {
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    expect(isValidFileType(file)).toBe(true);
  });

  it("should accept DOC files", () => {
    const file = new File(["test"], "test.doc", { type: "application/msword" });
    expect(isValidFileType(file)).toBe(true);
  });

  it("should accept DOCX files", () => {
    const file = new File(["test"], "test.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    expect(isValidFileType(file)).toBe(true);
  });

  it("should accept TXT files", () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    expect(isValidFileType(file)).toBe(true);
  });

  it("should accept CSV files", () => {
    const file = new File(["test"], "test.csv", { type: "text/csv" });
    expect(isValidFileType(file)).toBe(true);
  });

  it("should reject image files", () => {
    const file = new File(["test"], "test.png", { type: "image/png" });
    expect(isValidFileType(file)).toBe(false);
  });

  it("should reject video files", () => {
    const file = new File(["test"], "test.mp4", { type: "video/mp4" });
    expect(isValidFileType(file)).toBe(false);
  });

  it("should reject executable files", () => {
    const file = new File(["test"], "test.exe", {
      type: "application/x-msdownload",
    });
    expect(isValidFileType(file)).toBe(false);
  });
});

describe("isValidFileSize", () => {
  it("should accept small files", () => {
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    expect(isValidFileSize(file)).toBe(true);
  });

  it("should accept files at the limit", () => {
    const content = new Uint8Array(MAX_FILE_SIZE);
    const file = new File([content], "test.pdf", { type: "application/pdf" });
    expect(isValidFileSize(file)).toBe(true);
  });

  it("should reject files over the limit", () => {
    const content = new Uint8Array(MAX_FILE_SIZE + 1);
    const file = new File([content], "test.pdf", { type: "application/pdf" });
    expect(isValidFileSize(file)).toBe(false);
  });
});

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should resolve after specified time", async () => {
    const promise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
  });

  it("should not resolve before time", async () => {
    let resolved = false;
    sleep(1000).then(() => {
      resolved = true;
    });
    vi.advanceTimersByTime(500);
    expect(resolved).toBe(false);
    vi.advanceTimersByTime(500);
    await Promise.resolve(); // flush promises
    expect(resolved).toBe(true);
  });

  it("should handle zero milliseconds", async () => {
    const promise = sleep(0);
    vi.advanceTimersByTime(0);
    await expect(promise).resolves.toBeUndefined();
  });
});
