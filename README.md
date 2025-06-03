# 🌿 Analizador de plantas con IA

Esta aplicación permite identificar y analizar plantas a partir de una foto utilizando Inteligencia Artificial. El usuario puede subir una imagen de una planta, y el sistema devuelve información detallada sobre ella: nombre, descripción, dificultad de cuidado, frecuencia de riego, necesidades de luz y temperatura ideal. Una vez identificada, la planta se guarda en una base de datos y puede consultarse o eliminarse posteriormente.

---

## Tecnologías utilizadas

- **Next.js** – Framework de React que incluye Server Components para no tener que realizar un backend dedicado.
- **OpenAI API** – Se utiliza para procesar la imagen y generar la información sobre la planta.
- **MongoDB** – Base de datos para almacenar las plantas analizadas.
- **Tailwind CSS** – Framework de estilos para construir una interfaz limpia y responsive.

---

## Funcionalidades principales

- **Subida de imagen**: El usuario puede subir una foto de una planta desde su dispositivo.
- **Análisis con IA**: La imagen se envía a la API de OpenAI, que analiza y devuelve:
- Nombre común y científico (si está disponible).
- Descripción general.
- Dificultad de cuidado.
- Frecuencia de riego.
- Necesidades de temperatura.
- Necesidades de luz.
- **Almacenamiento en base de datos**: Las plantas analizadas se guardan automáticamente en MongoDB.
- **Visualización individual**: Cada planta puede consultarse en detalle a través de un modal.
- **Eliminación de plantas**: Permite eliminar entradas de la base de datos.
- **Límite de llamadas a la API**: Para evitar un uso excesivo o indebido, se ha configurado un límite de peticiones hacia la API de OpenAI.

## Cómo funciona la IA

- Esta app convierte la imagen subida en un input semántico utilizando la API de OpenAI. Se le solicita que identifique la planta en base a la foto y devuelva una respuesta estructurada que luego es formateada y presentada al usuario

## Objetivo del proyecto

- Este proyecto tiene como objetivo demostrar la capacidad de integrar inteligencia artificial en un flujo de trabajo real con tecnologías modernas. Es una prueba de concepto práctica para mostrar habilidades en:

- Desarrollo fullstack con Next.js.
- Uso de APIs de IA (OpenAI).
- Gestión de base de datos con MongoDB.
- Creación de UI modernas con Tailwind CSS.

## URL de la app

[https://ai-plants.vercel.app/](https://ai-plants.vercel.app/)
