export const testVarExp = fetch(`https://swapi.dev/api/people/${id}/`)
  .then((response) => response.json())
  .then((data) => {
    const { starships } = data;
    return starships;
});

export async function testFuncExp(id) {

  await fetch(`https://swapi.dev/api/people/${id}/`)
    .then((response) => response.json())
    .then((data) => {
      const { name } = data;
      return name;
    });
  return;
}

export const testArrowExp = (id) => {

  return fetch(`https://swapi.dev/api/people/${id}/`)
    .then((response) => response.json())
    .then((data) => {
      const { starships } = data;
      return starships;
    });
}