import { readFile, writeFile } from 'fs/promises';

const FILE_PATH = './data/cities.json';

export async function getCities() {
    try {
        let cities = await readFile(FILE_PATH, 'utf-8');
        return JSON.parse(cities);
    } catch (error) {
        console.error('Error reading cities file:', error);
        return [];
    }
}

export async function saveCities(cities) {
    try {
        await writeFile(FILE_PATH, JSON.stringify(cities, null, 2));
    } catch (error) {
        console.error('Error saving cities file:', error);
    }
}

export async function findCityByName(name) {
    let cities = await getCities();
    return cities.find(city => city.name.toLowerCase() === name.toLowerCase());
}

export async function addCity(name, country) {
    let cities = await getCities();
    if (await findCityByName(name)) return false;
    let newCity = { name, country };
    cities.push(newCity);
    await saveCities(cities);
    return newCity;
}

export async function deleteCity(name) {
    let cities = await getCities();
    let updatedCities = cities.filter(city => city.name.toLowerCase() !== name.toLowerCase());
    if (cities.length === updatedCities.length) return false;
    await saveCities(updatedCities);
    return true;
}
