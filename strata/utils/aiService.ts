import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || "");

export const generateTrip = async (data: any) => {
    try {
        const model = ai.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
      You are an expert travel planner. Create a realistic daily travel itinerary based on these preferences:
      
      - Destinations: ${data.destinations.join(', ')}
      - Start Date: ${data.start_date}
      - End Date: ${data.end_date}
      - Budget Level: ${data.budget_level}
      - Intensity Level: ${data.intensity_level}
      - Travel Style: ${data.travel_style}

      Generate appropriate spots, restaurants, and activities that match the "${data.travel_style}" style and "${data.budget_level}" budget.

      You MUST output ONLY a valid JSON object matching this exact schema:
      {
        "trip": ${JSON.stringify(data)},
        "locations": [
          {
            "location_id": "",
            "trip_id": "",
            "name": "<Name of the specific place, activity, or restaurant>",
            "scheduled_time": "YYYY-MM-DDTHH:MM:SSZ",
            "day": <integer representing the day of the trip, starting at 1>,
            "ticket_url": null
          }
        ]
      }
    `;

        const result = await model.generateContent(prompt);

        const responseText = result.response.text();
        const generatedItinerary = JSON.parse(responseText);

        return generatedItinerary;

    } catch (error) {
        console.error("Error generating trip:", error);
        return null;
    }
};