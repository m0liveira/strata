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
  ${data.start_date ? `- Start Date: ${data.start_date}\n  - End Date: ${data.end_date}` : '- Dates: Not specified yet (TBD)'}
  - Budget Level: ${data.budget_level}
  - Intensity Level: ${data.intensity_level}
  - Travel Style: ${data.travel_style}

  Generate appropriate spots, restaurants, and activities that match the "${data.travel_style}" style and "${data.budget_level}" budget.

  ${!data.start_date ? 'CRITICAL: Since there are no specific dates, you MUST set "scheduled_time" strictly to null for ALL locations.' : ''}

  You MUST output ONLY a valid JSON object matching this exact schema:
  {
    "trip": ${JSON.stringify(data)},
    "locations": [
      {
        "location_id": "",
        "trip_id": "",
        "name": "<Name of the specific place, activity, or restaurant>",
        "scheduled_time": ${data.start_date ? '"YYYY-MM-DDTHH:MM:SSZ"' : 'null'},
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

export const generatePlanB = async (locations: any[], reason: string) => {
  if (!locations || locations.length === 0) return null;

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const dayNumber = locations[0]?.day || 1;
    const count = locations.length;
    const tripId = locations[0]?.trip_id || "";

    const prompt = `
      You are an expert travel planner. The user needs to completely change their plans for Day ${dayNumber} of their trip.
      
      - Reason for change: "${reason}"
      - Number of new locations needed: Exactly ${count}
      
      Here is the original plan that needs to be replaced:
      ${JSON.stringify(locations.map(l => ({ name: l.name, time: l.scheduled_time })))}

      Generate ${count} NEW appropriate spots, restaurants, or activities that solve the user's reason for changing the plan.
      Try to keep the new scheduled times relatively close to the original ones.

      You MUST output ONLY a valid JSON object matching this exact schema:
      {
        "locations": [
          {
            "name": "<Name of the NEW specific place, activity, or restaurant>",
            "scheduled_time": "YYYY-MM-DDTHH:MM:SSZ",
            "day": ${dayNumber},
            "ticket_url": null
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const generatedPlan = JSON.parse(responseText);

    generatedPlan.locations = generatedPlan.locations.map((loc: any, index: number) => {
      let safeDate = loc.scheduled_time;
      if (safeDate && !safeDate.includes("T")) {
        safeDate = new Date(safeDate.replace(" ", "T")).toISOString();
      } else if (safeDate) {
        safeDate = new Date(safeDate).toISOString();
      }

      return {
        ...loc,
        location_id: locations[index]?.location_id,
        trip_id: tripId,
        scheduled_time: safeDate || null,
      };
    });

    return generatedPlan;

  } catch (error) {
    console.error("Error generating Plan B:", error);
    return null;
  }
};