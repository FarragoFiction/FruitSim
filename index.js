
const fruit_source = `http://farragofiction.com/DollSource/images/Fruit/Body/`;

let bounce_container;
let fruit = [];
window.onload = () => {

  initThemes();
  startFruitSelling();

}

const startFruitSelling = async () => {
  fruit = await getImages(fruit_source);
  pickFourFruit();
}

const pickFourFruit = () => {
  const container = document.querySelector(".sales-pitch");
  container.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    addFruit(container, i);
  }

}

const getFruitName = () => {
  let theme_keys = [pickFrom(Object.keys(all_themes)), pickFrom(Object.keys(all_themes))];

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


const addFruit = async (parent, id) => {
  const name = getFruitName();
  const image = fruit_source + pickFrom(fruit);
  const container = createElementWithClassAndParent("div", parent, "fruit-container");



  let canvas = document.createElement("canvas");
  canvas.width = 50;
  canvas.height = 50;

  await kickoffImageRenderingToCanvas(image, canvas);
  container.append(canvas);


  const nameElement = createElementWithClassAndParent("div", container, "fruit-name");
  nameElement.innerText = name;
  container.onclick = () => {
    bounceTime(canvas, id);
    pickFourFruit();
  }
}


//https://css-tricks.com/bounce-element-around-viewport-in-css/
const bounceTime = (canvas, id) => {
  let animation_frame_sheet = transformCanvasIntoAnimationWithTransform(canvas,[turnToPureStatic,turnToPartialStatic,turnToPureStatic]);
  //multiple things we wanna do. first is just bounce it around as is
  //then give it three frames of animation (same as LOGAC) that makes it staticky
  if (!bounce_container) {
    bounce_container = document.querySelector("#bounce-container");
  }
  /*
  <div class="el-wrap x">
    <div class="el y"></div>
  </div>
  */
 //ternary is so i can debug it without it zipping about
   const xAnimations = false? ["x-turtle"]: ["x","x-fast","x-zip","x-turtle"];
   const yAnimations = false? ["y-turtle"]:["y","y-fast","y-zip","y-turtle"];
  const elWrap = createElementWithClassAndParent("div", bounce_container, `el-wrap ${pickFrom(xAnimations)}`);
  elWrap.style.left = `${getRandomNumberBetween(0,100)}vw`;
  elWrap.style.top = `${getRandomNumberBetween(0,100)}vh`;
  const el = createElementWithClassAndParent("div", elWrap, `el ${pickFrom(yAnimations)}`);
  el.style.width = "50px";
  el.style.height = "50px";

  const graphic = createElementWithClassAndParent("div", el, `animated_bg`);
  graphic.style.backgroundImage = `url(${animation_frame_sheet.toDataURL()})`;


//JR NOTE: to debug
  //bounce_container.append(animation_frame_sheet);

}





