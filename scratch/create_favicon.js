const fs = require('fs');
const path = require('path');

// Minimal valid 16x16 1-bit ICO file header + DIB header + pixel data
const createMinimalIco = () => {
  // 16x16 transparent ICO buffer (744 bytes)
  const buf = Buffer.alloc(744);

  // ICONDIR Header
  buf.writeUInt16LE(0, 0); // Reserved
  buf.writeUInt16LE(1, 2); // Type 1 (ICO)
  buf.writeUInt16LE(1, 4); // 1 Image

  // ICONDIRENTRY
  buf.writeUInt8(16, 6);   // Width
  buf.writeUInt8(16, 7);   // Height
  buf.writeUInt8(0, 8);    // Color count (0 = >=256)
  buf.writeUInt8(0, 9);    // Reserved
  buf.writeUInt16LE(1, 10); // Color planes
  buf.writeUInt16LE(32, 12); // Bits per pixel
  buf.writeUInt32LE(726, 14); // Image size in bytes
  buf.writeUInt32LE(22, 18); // Offset of BMP data

  // BITMAPINFOHEADER
  buf.writeUInt32LE(40, 22); // Header size
  buf.writeInt32LE(16, 26);  // Width
  buf.writeInt32LE(32, 30);  // Height (double for XOR+AND mask)
  buf.writeUInt16LE(1, 34);  // Planes
  buf.writeUInt16LE(32, 36); // Bits per pixel

  // Fill pixels with Champagne Gold RGBA (197, 160, 89, 255) -> BGRA format (89, 160, 197, 255)
  let offset = 62;
  for (let i = 0; i < 16 * 16; i++) {
    buf[offset] = 89;    // Blue
    buf[offset + 1] = 160; // Green
    buf[offset + 2] = 197; // Red
    buf[offset + 3] = 255; // Alpha
    offset += 4;
  }

  return buf;
};

const favPath = path.join(__dirname, '../public/favicon.ico');
fs.writeFileSync(favPath, createMinimalIco());
console.log('Created favicon.ico at:', favPath);
