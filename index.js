
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

  return titleCase(pickFrom(possibilities));
}


const addFruit =  async (parent)=>{
  const name = getFruitName();
  const image = fruit_source + pickFrom(fruit);
  const container = createElementWithClassAndParent("div",parent,"fruit-container");



  let canvas = document.createElement("canvas");
  canvas.width = 50;
  canvas.height = 50;

   await kickoffImageRenderingToCanvas(image,canvas);
   container.append(canvas);


  const nameElement = createElementWithClassAndParent("div",container,"fruit-name");
  nameElement.innerText = name;
}





