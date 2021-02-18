export function fetchUser(id) {
  // console.log("fetch user...");

  return fetch(`https://swapi.dev/api/people/${id}/`)
    .then((response) => response.json())
    .then((data) => {
      const { name } = data;
      return name;
    });
}

export function fetchPosts(id) {
  // console.log("fetch posts...");
  return fetch(`https://swapi.dev/api/people/${id}/`)
    .then((response) => response.json())
    .then((data) => {
      const { starships } = data;
      return starships;
    });
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     console.log("fetched posts");
  //     resolve([
  //       {
  //         id: 0,
  //         text:
  //           "I get by with a little help from my friends"
  //       },
  //       {
  //         id: 1,
  //         text:
  //           "I'd like to be under the sea in an octupus's garden"
  //       },
  //       {
  //         id: 2,
  //         text:
  //           "You got that sand all over your feet"
  //       }
  //     ]);
  //   }, 2000);
  // });
}
