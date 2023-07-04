import log from "@ajar/marker";
import Promise from "bluebird";
import fetch from "node-fetch";

function getCountryPopulation(country) {
  return new Promise((resolve, reject) => {
    const url = `https://countriesnow.space/api/v0.1/countries/population`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.populationCounts)
          resolve(json.data.populationCounts.at(-1).value);
        else reject(new Error(`My Error: no data for ${country}`)); //app logic error message
      })
      .catch((err) => reject(err)); // network error - server is down for example...
    // .catch(reject)  // same same, only shorter...
  });
}

//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
function manual() {
  getCountryPopulation("France")
    .then((population) => {
      log.magenta("population", `of France is ${population}`);
      return getCountryPopulation("Germany");
    })
    .then((population) =>
      log.magenta("population", `of Germany is ${population}`)
    )
    .catch((err) => console.log("Error in manual: ", err.message));
}

// manual()

//------------------------------
//   Sequential processing
//------------------------------
const countries = [
  "France",
  "Russia",
  "Germany",
  "United Kingdom",
  "Portugal",
  "Spain",
  "Netherlands",
  "Sweden",
  "Greece",
  "Czechia",
  "Romania",
  "Israel",
];

function sequence() {
  Promise.each(countries, (country) => {
    return getCountryPopulation(country)
      .then((population) => {
        log.magenta(`the population of ${country} is ${population}`);
      })
      .catch(() => {
        log.red(`failed to get the population of ${country}`);
      });
  })
    .then((originalArray) => {
      console.log(`All tasks are done now... ${originalArray}`);
    })
    .catch((err) => {
      console.error("Catched", err.message);
    });
}
// sequence();

//--------------------------------------------------------
//  Parallel processing
//--------------------------------------------------------
function parallel() {
  Promise.map(countries, (country) => {
    return getCountryPopulation(country)
      .then((population) => {
        log.magenta(`The population of ${country} is ${population}`);

        return country;
      })
      .catch(() => {
        log.red(`Failed to get the population of ${country}`);
      });
  })
    .then((resultArray) => {
      console.log(
        `All tasks are done now... ${resultArray.filter((item) => !!item)}`
      );
    })
    .catch((err) => console.error(err.message));
}
// parallel();
