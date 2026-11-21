# Minimal HWP 5.0 text extractor for verify-sources: Korean government press releases are often .hwp attachments.
# Reads BodyText/Section* streams (raw deflate when compressed) and decodes HWPTAG_PARA_TEXT (tag 67) records as
# UTF-16LE, skipping inline control characters. Usage: python3 -I scripts/lib/hwp5text.py file.hwp
# Needs the pure-Python olefile package (pip install olefile).
import sys, zlib, struct
try:
    import olefile
except ImportError:
    sys.exit('olefile is required: pip install olefile')
def section_text(data):
    out, i = [], 0
    while i + 4 <= len(data):
        hdr = struct.unpack_from('<I', data, i)[0]; i += 4
        tag, size = hdr & 0x3FF, (hdr >> 20) & 0xFFF
        if size == 0xFFF: size = struct.unpack_from('<I', data, i)[0]; i += 4
        rec = data[i:i+size]; i += size
        if tag != 67: continue
        chars, j = [], 0
        while j + 2 <= len(rec):
            c = struct.unpack_from('<H', rec, j)[0]
            if c < 32:
                if c in (1,2,3,11,12,14,15,16,17,18,21,22,23): j += 16; continue  # extended/inline controls (8 wchars)
                if c in (4,5,6,7,8,9,19,20): j += 16; continue
                if c in (10,13): chars.append('\n')
                j += 2; continue
            chars.append(chr(c)); j += 2
        out.append(''.join(chars))
    return '\n'.join(out)
f = olefile.OleFileIO(sys.argv[1])
compressed = bool(struct.unpack_from('<I', f.openstream('FileHeader').read(), 36)[0] & 1)
secs = sorted([e for e in f.listdir() if e[0] == 'BodyText'], key=lambda e: int(e[1].replace('Section', '')))
for e in secs:
    raw = f.openstream(e).read()
    if compressed: raw = zlib.decompress(raw, -15)
    print(section_text(raw))
