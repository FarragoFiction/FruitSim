
const fruit_source = `http://farragofiction.com/DollSource/images/Fruit/Body/`;

let bounce_container;
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
  container.onclick = ()=>{
    bounceTime(canvas)
  }
}


//https://css-tricks.com/bounce-element-around-viewport-in-css/
const bounceTime = (canvas)=>{
  //multiple things we wanna do. first is just bounce it around as is
  //then give it three frames of animation (same as LOGAC) that makes it staticky
  if(!bounce_container){
    bounce_container = document.querySelector("#bounce-container");
    /*
    <div class="el-wrap x">
      <div class="el y"></div>
    </div>
    */
    const elWrap = createElementWithClassAndParent("div",bounce_container,"el-wrap x");

    const el = createElementWithClassAndParent("img",elWrap,"el y");
    el.style.width = "50px";
    el.style.height = "50px";
    el.style.border = "1px solid white";
    el.style.backgroundImage = `url(${canvas.toDataURL()})`;


  }

}





