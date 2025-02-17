import { getCities, addCity } from './services/cities/cities.model.js';;


export async function getAllCities(req, res) {
    try {
        let cities = await getCities();
        if (!cities) return res.status(404).json({ error: 'No cities found' });
        res.status(200).json(cities);
    } catch (error) {
        console.error('Error retrieving cities:', error);
        res.status(500).json({ error: 'Error retrieving cities. Please try again later.' });
    }
}

export async function createCity(req, res) {
    let { name, country } = req.body;
    try {
        let newCity = await addCity(name, country);
        if (!newCity) return res.status(400).json({ error: 'City already exists or invalid data' });
        res.status(201).json({ message: 'City added successfully', city: newCity });
    } catch (error) {
        console.error('Error adding city:', error);
        res.status(500).json({ error: 'Error adding city. Please try again later.' });
    }
}
