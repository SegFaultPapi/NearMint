# 📁 Guía de Estructura de Imágenes

## Organización de Carpetas

```
public/
├── images/
│   ├── cards/          # Imágenes de tarjetas de coleccionables
│   │   ├── card-1.jpg  # 180 × 240 px
│   │   ├── card-2.jpg  # 164 × 224 px
│   │   ├── card-3.jpg  # 196 × 272 px (destacada)
│   │   ├── card-4.jpg  # 148 × 208 px
│   │   └── card-5.jpg  # 164 × 224 px
│   │
│   ├── steps/          # Imágenes para "How It Works"
│   │   ├── step-1.jpg  # 600 × 400 px
│   │   ├── step-2.jpg  # 600 × 400 px
│   │   └── step-3.jpg  # 600 × 400 px (opcional)
│   │
│   └── logos/          # Logos y assets
│       ├── logo.png
│       └── icon.png
│
└── favicon.ico         # Ya existe
```

## Formatos Recomendados

### Para Tarjetas de Coleccionables
- **Formato**: WebP (mejor compresión) o JPG/PNG
- **Calidad**: Alta (80-90%)
- **Tamaño**: Proporciones 3:4 (vertical)

### Para Imágenes de Sección
- **Formato**: WebP o JPG
- **Calidad**: Media-Alta (75-85%)
- **Tamaño**: Proporciones 3:2 (horizontal)

## Cómo Referenciar en el Código

```tsx
// Tarjetas
<Image src="/images/cards/card-1.jpg" alt="Baseball card" width={180} height={240} />

// Pasos
<Image src="/images/steps/step-1.jpg" alt="Collectibles" width={600} height={400} />

// Logo
<Image src="/images/logos/logo.png" alt="NearMint" width={48} height={48} />
```

## Optimización

Next.js optimiza automáticamente las imágenes cuando usas el componente `<Image />`:
- ✅ Lazy loading
- ✅ Responsive images
- ✅ Conversión automática a WebP
- ✅ Blur placeholder

