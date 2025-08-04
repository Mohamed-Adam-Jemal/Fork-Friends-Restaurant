// __tests__/compressImage.test.ts
import { compressImage } from "../compressImage";

function createDummyImageFile(name = "test.png", sizeInKB = 100): File {
  const sizeInBytes = sizeInKB * 1024;
  const blob = new Blob([new ArrayBuffer(sizeInBytes)], { type: "image/png" });
  return new File([blob], name, { type: "image/png" });
}

describe("compressImage", () => {
  it("should return a smaller file than the original", async () => {
    const originalFile = createDummyImageFile("large.png", 100); // 100 KB

    const compressedFile = await compressImage(originalFile);

    expect(compressedFile).toBeInstanceOf(File);
    expect(compressedFile.size).toBeLessThan(originalFile.size);
    expect(compressedFile.type).toBe("image/jpeg"); // compression usually converts to JPEG
  });

  it("should throw if the input is not a File", async () => {
    // @ts-expect-error: Intentional misuse
    await expect(compressImage(null)).rejects.toThrow();
  });
});
