# Vetneds 🐾

Tienda online de productos para mascotas - Comida, ropa y servicios de calidad.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ 
- pnpm (o npm)
- Cuenta de Supabase

### Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/percyby2000/Vetneds.git
cd Vetneds
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

**⚠️ IMPORTANTE:** Nunca compartas estas claves públicamente.

4. **Configura la base de datos**

Ve a tu proyecto en Supabase Dashboard y ejecuta el SQL que está en:
```
scripts/01-create-pet-store-schema.sql
```

5. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Deploy en Vercel

1. Importa el proyecto desde GitHub en Vercel
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático

## 🔒 Seguridad

- ✅ Los archivos `.env*` están protegidos en `.gitignore`
- ✅ Nunca subas credenciales al repositorio
- ✅ Usa variables de entorno en producción

## 🛠️ Tecnologías

- **Framework:** Next.js 16
- **UI:** React + TailwindCSS
- **Base de datos:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Deploy:** Vercel

## 📝 Licencia

MIT
