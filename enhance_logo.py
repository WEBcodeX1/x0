#!/usr/bin/env python3
"""
x0 Logo Enhancement Script

This script creates enhanced versions of the x0 Framework logo with modern effects.
It can be used to regenerate or customize the enhanced logos.

Usage:
    python3 enhance_logo.py [--input INPUT] [--output OUTPUT] [--style STYLE]

Options:
    --input INPUT      Path to input logo (default: image/x0-logo-github.png)
    --output OUTPUT    Path to output logo (default: auto-generated based on style)
    --style STYLE      Enhancement style: 'enhanced' or 'pimped' (default: both)
    --help            Show this help message

Examples:
    # Create both enhanced versions
    python3 enhance_logo.py

    # Create only the pimped version
    python3 enhance_logo.py --style pimped

    # Create enhanced version with custom output
    python3 enhance_logo.py --style enhanced --output my-logo.png
"""

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np
import argparse
import sys
import os


def create_enhanced_logo(original_path, output_path):
    """Create enhanced logo with subtle effects."""
    print(f"Creating enhanced logo from {original_path}...")
    
    original = Image.open(original_path)
    width, height = original.size
    
    # Create base with extra padding
    padding = 40
    new_width = width + padding * 2
    new_height = height + padding * 2
    enhanced = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
    
    # Step 1: Subtle gradient background
    gradient = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(gradient)
    
    for y in range(new_height):
        for x in range(new_width):
            dx = (x - new_width / 2) / (new_width / 2)
            dy = (y - new_height / 2) / (new_height / 2)
            distance = min(1.0, (dx * dx + dy * dy) ** 0.5)
            alpha = int((1.0 - distance) * 30)
            color = (20, 40, 80, alpha)
            draw.point((x, y), fill=color)
    
    enhanced = Image.alpha_composite(enhanced, gradient)
    
    # Step 2: Multi-layer glow
    for i in range(5):
        glow = original.copy()
        enhancer = ImageEnhance.Brightness(glow)
        glow = enhancer.enhance(1.5)
        blur_radius = (i + 1) * 3
        glow = glow.filter(ImageFilter.GaussianBlur(blur_radius))
        
        temp = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
        temp.paste(glow, (padding, padding), glow)
        enhanced = Image.alpha_composite(enhanced, temp)
    
    # Step 3: Shadow
    shadow = original.copy()
    shadow_array = np.array(shadow)
    shadow_array[:, :, :3] = 0
    shadow_img = Image.fromarray(shadow_array)
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(5))
    
    shadow_temp = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
    shadow_temp.paste(shadow_img, (padding + 5, padding + 5), shadow_img)
    enhanced = Image.alpha_composite(enhanced, shadow_temp)
    
    # Step 4: Original logo on top
    temp = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
    temp.paste(original, (padding, padding), original)
    enhanced = Image.alpha_composite(enhanced, temp)
    
    # Step 5: Border
    border_width = 2
    draw = ImageDraw.Draw(enhanced)
    border_color = (100, 150, 255, 100)
    draw.rectangle(
        [(padding - border_width, padding - border_width),
         (new_width - padding + border_width, new_height - padding + border_width)],
        outline=border_color,
        width=border_width
    )
    
    # Step 6: Enhance contrast and sharpness
    enhancer = ImageEnhance.Contrast(enhanced)
    enhanced = enhancer.enhance(1.1)
    enhancer = ImageEnhance.Sharpness(enhanced)
    enhanced = enhancer.enhance(1.2)
    
    enhanced.save(output_path, 'PNG')
    print(f"✓ Enhanced logo saved: {output_path}")
    print(f"  Size: {enhanced.size}")
    return enhanced


def create_pimped_logo(original_path, output_path):
    """Create ultra-pimped logo with vibrant effects."""
    print(f"Creating ultra-pimped logo from {original_path}...")
    
    original = Image.open(original_path)
    width, height = original.size
    enhanced = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    
    # Step 1: Vibrant gradient background
    gradient = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(gradient)
    
    for y in range(height):
        ratio = y / height
        r = int(20 + ratio * 180)
        g = int(40 + (1 - ratio) * 100)
        b = int(100 + ratio * 120)
        alpha = int(40 + ratio * 20)
        draw.line([(0, y), (width, y)], fill=(r, g, b, alpha))
    
    enhanced = Image.alpha_composite(enhanced, gradient)
    
    # Step 2: Multi-colored glow layers
    glow_colors = [
        (0, 150, 255, 80),
        (150, 0, 255, 60),
        (255, 100, 200, 50),
    ]
    
    for i, color in enumerate(glow_colors):
        glow = original.copy()
        glow_array = np.array(glow)
        
        mask = glow_array[:, :, 3] > 0
        glow_array[:, :, 0][mask] = color[0]
        glow_array[:, :, 1][mask] = color[1]
        glow_array[:, :, 2][mask] = color[2]
        glow_array[:, :, 3][mask] = np.minimum(glow_array[:, :, 3][mask], color[3])
        
        glow_img = Image.fromarray(glow_array)
        glow_img = glow_img.filter(ImageFilter.GaussianBlur(10 + i * 5))
        enhanced = Image.alpha_composite(enhanced, glow_img)
    
    # Step 3: Multiple shadow layers
    for offset in [(6, 6), (4, 4), (2, 2)]:
        shadow = original.copy()
        shadow_array = np.array(shadow)
        mask = shadow_array[:, :, 3] > 0
        shadow_array[:, :, 0][mask] = 10
        shadow_array[:, :, 1][mask] = 20
        shadow_array[:, :, 2][mask] = 40
        shadow_array[:, :, 3][mask] = shadow_array[:, :, 3][mask] // (offset[0] + 1)
        
        shadow_img = Image.fromarray(shadow_array)
        shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(offset[0]))
        
        temp = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        temp.paste(shadow_img, offset, shadow_img)
        enhanced = Image.alpha_composite(enhanced, temp)
    
    # Step 4: Boosted original
    boosted = original.copy()
    enhancer = ImageEnhance.Color(boosted)
    boosted = enhancer.enhance(1.3)
    enhancer = ImageEnhance.Contrast(boosted)
    boosted = enhancer.enhance(1.2)
    enhanced = Image.alpha_composite(enhanced, boosted)
    
    # Step 5: Highlight effect
    highlight = original.copy()
    highlight_array = np.array(highlight)
    
    for y in range(height // 3):
        alpha_factor = (1.0 - y / (height / 3)) * 0.3
        mask = highlight_array[y, :, 3] > 0
        highlight_array[y, :, 0][mask] = 255
        highlight_array[y, :, 1][mask] = 255
        highlight_array[y, :, 2][mask] = 255
        highlight_array[y, :, 3][mask] = np.minimum(
            (highlight_array[y, :, 3][mask] * alpha_factor).astype(np.uint8),
            100
        )
    
    for y in range(height // 3, height):
        highlight_array[y, :, 3] = 0
    
    highlight_img = Image.fromarray(highlight_array)
    highlight_img = highlight_img.filter(ImageFilter.GaussianBlur(3))
    enhanced = Image.alpha_composite(enhanced, highlight_img)
    
    # Step 6: Final sharpness
    enhancer = ImageEnhance.Sharpness(enhanced)
    enhanced = enhancer.enhance(1.3)
    
    enhanced.save(output_path, 'PNG')
    print(f"✓ Ultra-pimped logo saved: {output_path}")
    print(f"  Size: {enhanced.size}")
    return enhanced


def main():
    parser = argparse.ArgumentParser(
        description='Enhance x0 Framework logo with modern effects',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        '--input',
        default='image/x0-logo-github.png',
        help='Path to input logo (default: image/x0-logo-github.png)'
    )
    parser.add_argument(
        '--output',
        default=None,
        help='Path to output logo (default: auto-generated based on style)'
    )
    parser.add_argument(
        '--style',
        choices=['enhanced', 'pimped', 'both'],
        default='both',
        help='Enhancement style (default: both)'
    )
    
    args = parser.parse_args()
    
    # Check if input file exists
    if not os.path.exists(args.input):
        print(f"Error: Input file '{args.input}' not found", file=sys.stderr)
        sys.exit(1)
    
    # Check dependencies
    try:
        import numpy
    except ImportError:
        print("Error: numpy is required. Install with: pip install numpy", file=sys.stderr)
        sys.exit(1)
    
    print("=" * 60)
    print("x0 Framework Logo Enhancement Script")
    print("=" * 60)
    print()
    
    # Create enhanced version
    if args.style in ['enhanced', 'both']:
        output = args.output or 'image/x0-logo-github-enhanced.png'
        create_enhanced_logo(args.input, output)
        print()
    
    # Create pimped version
    if args.style in ['pimped', 'both']:
        output = args.output or 'image/x0-logo-github-pimped.png'
        create_pimped_logo(args.input, output)
        print()
    
    print("=" * 60)
    print("✓ Logo enhancement complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
