
const fruit_source = `http://farragofiction.com/DollSource/images/Fruit/Body/`;

let fruit = [];
window.onload = () => {

  initThemes();
  startFruitSelling();
  
}

startFruitSelling = async ()=>{
  fruit = await getImages(fruit_source);
}



