const express = require('express');
const router = express.Router();
const axios = require('axios');

const getCatBreedImage = async (breedId, data) => {
  const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);

  return {
    ...data,
    breedImage: response.data[0].url
  };
};

const getUniqueCountries = (array) => {
  const tempArr = [];
  const data = {};
  const result = [];

  for (const item of array) {
    if (
      !tempArr.includes(item.countryName)
    ) {
      tempArr.push(item.countryName);

      data[item.countryName] = {
        countryName: item.countryName,
        countryFlag: item.countryFlag,
        breeds: []
      };
    }

    data[item.countryName].breeds.push({
      name: item.breedName,
      image: item.breedImage
    });
  }

  const keys = Object.getOwnPropertyNames(data);

  for (const k of keys) {
    result.push(data[k]);
  }

  return result;
};

router.get('/:region', async (req, res) => {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const region = req.params.region;

  const options = {
    region,
    regions,
    countries: [],
    error: ''
  };

  try {
    const catBreeds = await axios.get(`https://api.thecatapi.com/v1/breeds`);
    const countries = await axios.get(`https://restcountries.eu/rest/v2/region/${region}`);
    const stack = [];

    for (const r of countries.data) {
      const code = r.alpha2Code;
      const breeds = catBreeds.data.filter(b => b.country_code === code);

      for (const b of breeds) {
        stack.push({
          breed: b,
          countryName: r.name,
          countryFlag: r.flag
        });
      }
    }

    const callStack = stack.map(item => {
      return getCatBreedImage(item.breed.id, {
        breedName: item.breed.name,
        countryName: item.countryName,
        countryFlag: item.countryFlag
      });
    });

    options.countries = getUniqueCountries(await Promise.all(callStack));
  } catch (e) {
    options.error = 'some error';
  } finally {
    res.render('region', options);
  }
});

module.exports = router;
