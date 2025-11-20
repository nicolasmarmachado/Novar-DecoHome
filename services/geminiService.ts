import { GoogleGenAI, Type } from "@google/genai";

const fileToGenerativePart = (base64: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64,
            mimeType,
        },
    };
};

export async function generateProductDetails(
    imageBase64: string,
    mimeType: string
): Promise<{ name: string; description: string }> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const imagePart = fileToGenerativePart(imageBase64, mimeType);

        const prompt = `Basado en la imagen proporcionada de un artículo de decoración para el hogar, genera un título de producto atractivo y una descripción corta y elegante. El título debe ser conciso y llamativo. La descripción debe resaltar el estilo, el material y la ubicación ideal del artículo en un hogar.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: 'Un título de producto corto y atractivo.',
                        },
                        description: {
                            type: Type.STRING,
                            description: 'Una descripción de producto convincente (2-3 frases).',
                        },
                    },
                    required: ['name', 'description'],
                },
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (parsedResponse.name && parsedResponse.description) {
            return parsedResponse;
        } else {
            throw new Error("Estructura de respuesta inválida de la IA");
        }
    } catch (error) {
        console.error("Error al generar detalles del producto:", error);
        throw new Error("No se pudieron generar los detalles con la IA. Por favor, inténtalo de nuevo.");
    }
}