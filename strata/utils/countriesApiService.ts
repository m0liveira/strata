export interface Country {
    iso3: string;
    country: string;
    flag: string;
    cities: string[];
}

export const countryData: { countries: Country[] } = {
    countries: []
};

const API_URL = 'https://countriesnow.space/api/v0.1';

const getCountriesAndCities = async () => {
    try {
        const response = await fetch(`${API_URL}/countries`, {
            method: "GET",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get user data");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

const getCountriesFlags = async () => {
    try {
        const response = await fetch(`${API_URL}/countries/flag/images`, {
            method: "GET",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get user data");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getFullCountriesData = async () => {
    try {
        const [countriesRes, flagsRes] = await Promise.all([
            getCountriesAndCities(),
            getCountriesFlags()
        ]);

        const countries = countriesRes.data;
        const flags = flagsRes.data;

        const flagsMap = new Map(flags.map((item: any) => [item.iso3, item.flag]));

        return countries.map((c: any) => ({
            iso3: c.iso3,
            country: c.country,
            flag: flagsMap.get(c.iso3) || "",
            cities: c.cities
        }));

    } catch (error) {
        console.error("Failed to get full countries data:", error);
        throw error;
    }
};

const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const searchLocation = (query: string) => {
    const search = normalize(query);
    if (search.length < 2) return [];

    const results: any[] = [];

    for (const item of countryData.countries) {
        const normCountry = normalize(item.country);

        if (normCountry.includes(search)) {
            results.push({
                type: 'country',
                name: item.country,
                flag: item.flag,
                iso3: item.iso3,
                normName: normCountry
            });
        }

        const matchingCities = item.cities.filter(city => normalize(city).includes(search));

        matchingCities.forEach(city => {
            const normCity = normalize(city);
            if (normCity !== normCountry) {
                results.push({
                    type: 'city',
                    name: city,
                    country: item.country,
                    flag: item.flag,
                    normName: normCity
                });
            }
        });

        if (results.length > 20) break;
    }

    return results
        .sort((a, b) => {
            const aStarts = a.normName.startsWith(search);
            const bStarts = b.normName.startsWith(search);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            if (a.type === 'country' && b.type === 'city') return -1;
            if (a.type === 'city' && b.type === 'country') return 1;

            return a.name.localeCompare(b.name);
        })
        .slice(0, 4);
};