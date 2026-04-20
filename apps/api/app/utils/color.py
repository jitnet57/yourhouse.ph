"""Color utilities: hex parsing, WCAG contrast ratio."""
from __future__ import annotations


def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    """Parse '#RRGGBB' or '#RRGGBBAA' → (R, G, B)."""
    h = hex_str.lstrip("#")
    if len(h) not in (6, 8):
        raise ValueError(f"Invalid hex color: {hex_str}")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _luminance(rgb: tuple[int, int, int]) -> float:
    """Relative luminance per WCAG 2.1."""
    def ch(c: int) -> float:
        s = c / 255.0
        return s / 12.92 if s <= 0.03928 else ((s + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def contrast_ratio(
    fg: tuple[int, int, int],
    bg: tuple[int, int, int],
    alpha: float = 1.0,
) -> float:
    """WCAG contrast ratio. If alpha < 1, blend bg over white."""
    if alpha < 1.0:
        bg = tuple(int(c * alpha + 255 * (1 - alpha)) for c in bg)  # type: ignore
    l1, l2 = _luminance(fg), _luminance(bg)
    lighter, darker = max(l1, l2), min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
