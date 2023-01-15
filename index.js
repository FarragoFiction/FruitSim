
const fruit_source = `http://farragofiction.com/DollSource/images/Fruit/Body/`;

let fruit = [];
window.onload = () => {

  initThemes();
  startFruitSelling();
  
}

const startFruitSelling = async ()=>{
  fruit = await getImages(fruit_source);
  pickFourFruit();
}

const pickFourFruit = ()=>{
  const container = document.querySelector(".sales-pitch");
  for(let i=0; i<4; i++){
    addFruit(container);
  }

}

const getFruitName = () => {
  let theme_keys = [pickFrom(Object.keys(all_themes)),pickFrom(Object.keys(all_themes))];

  let name = pickFrom(fruit_words);

  const possibilities = [
    `${pickARandomThemeFromListAndGrabKey(theme_keys, ADJ, true)} ${name}`,
    `${pickARandomThemeFromListAndGrabKey(theme_keys, COMPLIMENT, true)} ${name}`,
    `${pickARandomThemeFromListAndGrabKey(theme_keys, PERSON, true)}'s ${name}`,
    `${pickARandomThemeFromListAndGrabKey(theme_keys, ADJ, true)} ${name}`,
    `${pickARandomThemeFromListAndGrabKey(theme_keys, LOCATION, true)}'s ${name}`
  ];

  return pickFrom(possibilities);
}


const addFruit = (parent)=>{
  const name = getFruitName();
  const image = pickFrom(fruit);
  const container = createElementWithClassAndParent("div",parent,"fruit-container");

  const imageElement = createElementWithClassAndParent("img",container,"fruit-img");
  imageElement.src = fruit_source+image;
  console.log("JR NOTE: tried to make the fruit", imageElement.src);
  const nameElement = createElementWithClassAndParent("div",container,"fruit-name");
  nameElement.innerText = name;
}





