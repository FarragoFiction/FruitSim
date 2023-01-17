
const fruit_source = `http://farragofiction.com/DollSource/images/Fruit/Body/`;

let bounce_container;
let fruit = [];
window.onload = () => {

  window.onclick = () => {
    const audio = document.querySelector("#audio");
    if (!audio.playing) {
      audio.play();
    }
  }
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
    quip(id);
    bounceTime(canvas, id);
    pickFourFruit();
  }
}

let first_index = 0;
let second_index = 0;
let third_index = 0;
let fourth_index = 0;

let responsibility_to_wake_up = 0;

const quip = (id) => {
  if (id === 0) {
    renderQuip(convo1[first_index % convo1.length]);
    first_index++;
  } else if (id === 1) {
    renderQuip(convo2[second_index % convo2.length]);
    second_index++;
  } else if (id === 2) {
    renderQuip(convo3[third_index % convo3.length]);
    third_index++;
  } else {
    renderQuip(convo4[fourth_index % convo4.length]);
    fourth_index++;
  }

  if (first_index == convo1.length) {
    console.log("JR NOTE: first done")
    responsibility_to_wake_up++;
  }

  if (second_index == convo2.length) {
    console.log("JR NOTE: second done")

    responsibility_to_wake_up++;
  }

  if (third_index == convo3.length) {
    console.log("JR NOTE: third done")

    responsibility_to_wake_up++;
  }

  if (fourth_index == convo4.length) {
    console.log("JR NOTE: fourth done")
    responsibility_to_wake_up++;
  }

  if (responsibility_to_wake_up >= 4) {
    optionToWakeUp();
  }


}

const renderQuip = (text) => {
  const ele = document.querySelector(".quip-content");
  ele.innerText = text;

}


/*
Brains are weird and mushy pattern matching systems. 

Are we identical to an artificial neural net? No, of course not. 

But I think there are more similarities there than some people are comfortable with. 

I feel like anything explainable ends up being “just” something. 

It’s JUST pattern matching, its JUST symbol repetition. 

And we want our own minds to be MORE than “just” something. There has to be some ineffable quality that could never possibly be explained or reduced. 

But I think that’s looking at everything exactly the wrong way. What’s it called, the “god of the gaps” in theology, right? If the thing you value is only allowed to exist in the spaces you don’t yet understand, then understanding itself becomes a THREAT.  Something that diminishes the value.

And man, I don’t want to consider understanding a threat. I want to celebrate it. I want to say “isn’t it so cool and good that artificial neural nets are helping us understand ourselves more?”. 

I want to be excited that we’re seeing more and more what lies behind our own curtain. 
*/
const optionToWakeUp = () => {
  const button_container = document.querySelector("#button-container");

  const xAnimations = false ? ["x-turtle"] : ["x", "x-fast", "x-zip", "x-turtle"];
  const yAnimations = false ? ["y-turtle"] : ["y", "y-fast", "y-zip", "y-turtle"];
  const elWrap = createElementWithClassAndParent("div", button_container, `el-wrap ${pickFrom(xAnimations)}`);
  elWrap.style.left = `${getRandomNumberBetween(0, 100)}vw`;
  elWrap.style.top = `${getRandomNumberBetween(0, 100)}vh`;
  const el = createElementWithClassAndParent("button", elWrap, `el ${pickFrom(yAnimations)}`);
  el.style.width = "50px";
  el.style.height = "50px";
  el.innerText = "Wake Up";

  el.style.cursor = "pointer";
  el.style.position = "relative";
  el.style.zIndex = "100";
  el.style.pointerEvents = "all"
  el.onclick = () => {
    unTrickster();
  }

}


//https://css-tricks.com/bounce-element-around-viewport-in-css/
const bounceTime = (canvas, id) => {
  let animation_frame_sheet = transformCanvasIntoAnimationWithTransform(canvas, [turnToPureStatic, turnToPartialStatic, turnToPureStatic]);
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
  const xAnimations = false ? ["x-turtle"] : ["x", "x-fast", "x-zip", "x-turtle"];
  const yAnimations = false ? ["y-turtle"] : ["y", "y-fast", "y-zip", "y-turtle"];
  const elWrap = createElementWithClassAndParent("div", bounce_container, `el-wrap ${pickFrom(xAnimations)}`);
  elWrap.style.left = `${getRandomNumberBetween(0, 100)}vw`;
  elWrap.style.top = `${getRandomNumberBetween(0, 100)}vh`;
  const el = createElementWithClassAndParent("div", elWrap, `el ${pickFrom(yAnimations)}`);
  el.style.width = "50px";
  el.style.height = "50px";

  const graphic = createElementWithClassAndParent("div", el, `animated_bg`);
  graphic.style.backgroundImage = `url(${animation_frame_sheet.toDataURL()})`;


  //JR NOTE: to debug
  //bounce_container.append(animation_frame_sheet);

}


const unTrickster = () => {
  const body = document.querySelector("body");
  body.innerHTML = "";
  body.style.background = "white";
  //note just copy this from the template so i get linting for my html
  body.innerHTML = `
  <div class="chat-container">
    <div class="chat-header">
      <p>The Closer will fulfill your Customer Support needs.</p>
    </div>
    <div class="chat-body">
      <div class="customer-service-hell">
        <div class="chat-line">
          <div class="chat-icon">TC</div>
          <div class="chat-text">Testing</div>
        </div>

        <div class="chat-line">
          <div class="chat-icon">TC</div>
          <div class="chat-text">Testing</div>
        </div>

        <div class="chat-line">
          <div class="chat-icon">TC</div>
          <div class="chat-text">Testing</div>
        </div>
      </div>
    </div>

  </div>
  `;
}




