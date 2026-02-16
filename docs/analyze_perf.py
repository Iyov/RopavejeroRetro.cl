#!/usr/bin/env python3
"""
Script para analizar performance del sitio
Ubicación: docs/analyze_perf.py
Ejecutar desde raíz: python docs/analyze_perf.py
"""
import re
import os

def analyze_css():
    """Analizar CSS para optimizaciones"""
    with open('../css/index.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    with open('../index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Tamaño actual
    css_size = len(css_content) / 1024
    css_min_size = os.path.getsize('../css/index.min.css') / 1024
    
    print("📊 CSS ANALYSIS")
    print(f"  Original: {css_size:.1f} KB")
    print(f"  Minified: {css_min_size:.1f} KB")
    print(f"  Savings: {((css_size - css_min_size) / css_size * 100):.1f}%")
    print()

def analyze_javascript():
    """Analizar JavaScript"""
    files = {
        '../js/index.js': '../js/index.min.js',
        '../js/instagram_posts.js': '../js/instagram_posts.min.js',
        '../js/app.js': '../js/app.min.js'
    }
    
    print("📊 JAVASCRIPT ANALYSIS")
    total_orig = 0
    total_min = 0
    
    for orig, minified in files.items():
        if os.path.exists(orig):
            orig_size = os.path.getsize(orig) / 1024
            min_size = os.path.getsize(minified) / 1024
            savings = ((orig_size - min_size) / orig_size * 100) if orig_size > 0 else 0
            print(f"  {orig}")
            print(f"    Original: {orig_size:.1f} KB → Minified: {min_size:.1f} KB ({savings:.1f}% savings)")
            total_orig += orig_size
            total_min += min_size
    
    print(f"  Total: {total_orig:.1f} KB → {total_min:.1f} KB ({((total_orig - total_min) / total_orig * 100):.1f}% savings)")
    print()

def analyze_images():
    """Analizar imágenes"""
    print("📊 IMAGE OPTIMIZATION")
    
    webp_files = {}
    for root, dirs, files in os.walk('../img'):
        for file in files:
            if file.endswith('.webp'):
                path = os.path.join(root, file)
                size_kb = os.path.getsize(path) / 1024
                webp_files[file] = size_kb
    
    if webp_files:
        total_webp = sum(webp_files.values())
        print(f"  WebP images: {len(webp_files)} files, {total_webp:.1f} KB total")
        print(f"  Hero responsivo: hero-400.webp, hero-800.webp, hero-1200.webp, hero-1920.webp")
        print(f"  Posts Instagram: 36 variantes WebP (Post01-Post12 en 400/800/1200)")
    print()

def recommendations():
    """Recomendaciones de optimización"""
    print("💡 OPTIMIZATION RECOMMENDATIONS")
    print()
    print("1. REMAINING OPPORTUNITIES:")
    print("   ✓ CSS Purge: Auditar clases no usadas (0-15% savings potential)")
    print("   ✓ AVIF format: Más pequeño que WebP (~20% smaller)")
    print("   ✓ Preconnect Google Sheets: Inicio de conexión antes de fetch")
    print("   ✓ Lazy-load 3er party scripts: Defer analytics, cloudflare")
    print("   ✓ Resource Hints: dns-prefetch, prefetch, preconnect")
    print()
    print("2. CORE WEB VITALS TUNING:")
    print("   • LCP (Largest Contentful Paint): ✅ GOOD - Preload + local images")
    print("   • CLS (Cumulative Layout Shift): CHECK - No hero height set?")
    print("   • INP (Interaction to Next Paint): ⚠️ CHECK - Modal rendering performance")
    print()
    print("3. QUICK WINS:")
    print("   • Preconnect to docs.google.com (for Google Sheets API)")
    print("   • Add width/height to hero <img> to prevent CLS")
    print("   • Service Worker: Activate 'update on reload' button")
    print()

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 ROPAVEJERO RETRO - PERFORMANCE ANALYSIS")
    print("=" * 60)
    print()
    
    analyze_css()
    analyze_javascript()
    analyze_images()
    recommendations()
    
    print("=" * 60)
    print("Next: Deploy and run Lighthouse for full Web Vitals audit")
    print("=" * 60)
