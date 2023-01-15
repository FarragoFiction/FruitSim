
//async, give it an image source and it'll handle loading it and rendering it to the target canvas
const kickoffImageRenderingToCanvas = (source, canvas) => {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.addEventListener('load', function () {
    renderImageToCanvasAndRandomizeColors(img, canvas);
  }, false);
  img.src = source;
}

//given an already loaded image, render it to the target canvas.
const renderImageToCanvas = (img, canvas) => {
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
}

const renderImageToCanvasAndRandomizeColors = (img, canvas) => {
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
  randomizeColors(canvas);

}

//doesn't care about palettes. just for every color it finds shoves it in a hash map and refers to it later
const randomizeColors = (canvas) => {
  //key is color in original image, value is color in new image (both in rgb)
  let remembered_colors = {}
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return;
  }
  console.log("JR NOTE: color???")
  var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var d = output.data;
  for (var i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 0) {
      let red = d[i];
      let green = d[i + 1];
      let blue = d[i + 2];
      if (!remembered_colors[`${red},${green},${blue}`]) {
        remembered_colors[`${red},${green},${blue}`] = { red: getRandomNumberBetween(0, 255), green: getRandomNumberBetween(0, 255), blue: getRandomNumberBetween(0, 255) }
      }
      d[i] = remembered_colors[`${red},${green},${blue}`].red;
      d[i + 1] = remembered_colors[`${red},${green},${blue}`].green;
      d[i + 2] = remembered_colors[`${red},${green},${blue}`].blue;
    }

  }
  ctx.putImageData(output, 0, 0);
}

//doesn't care about palettes. just for every color it finds shoves it in a hash map and refers to it later
const turnToStatic = (canvas) => {
  //key is color in original image, value is color in new image
  let remembered_colors = {}
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return;
  }
  console.log("JR NOTE: color???")
  var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var d = output.data;
  let offset = 0;
  for (var i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 0) {
      d[i] = getRandomNumberBetween(0, 255)
      d[i + 1] = getRandomNumberBetween(0, 255);
      d[i + 2] = getRandomNumberBetween(0, 255);
    }


  }
  ctx.putImageData(output, 0, 0);
}

const makeVirtualCanvas = (canvas, height, width) => {
  const virtual_canvas = document.createElement("canvas");
  virtual_canvas.height = height;
  virtual_canvas.width = width;
  return virtual_canvas;
}

const makeVirtualCopyOfCanvas = (canvas) => {
  const virtualcopy = makeVirtualCanvas(canvas, canvas.height, canvas.width);
  const context = virtualcopy.getContext("2d");
  context.drawImage(canvas, 0, 0);
  return virtualcopy;
}

const getStability = () => {
  if (placesBeen.length < 10) {
    return 100;
  }
  return placesBeen.length < 25 ? 125 - (placesBeen.length * 5) : 0;
}

const understandImage = (canvas) => {
  let virtual_canvas = makeVirtualCopyOfCanvas(canvas);
  edge_detection(virtual_canvas);
  const most_frequent_color = threshold(virtual_canvas, 100);
  //threshold(canvas,100);

  //message("Most Frequent color is "+most_frequent_color);
  handleClickEvents(canvas, virtual_canvas, most_frequent_color);
  handleMouseMoveEvents(canvas, virtual_canvas, most_frequent_color);
  clearGlitch();
  if (placesBeen.length > 10) {
    glitchCascade(canvas, getStability());
  }

}

//can do so many if you want
const glitchCascade = (canvas, odds) => {
  // console.log("JR NOTE: odds are",odds/100)
  applyGlitch(canvas);
  if (Math.random() > odds / 100) {
    glitchCascade(canvas, odds + Math.random() * (100 / glitchesFound));
  }
}



const isThisPixelRelevant = (x, y, virtual_canvas, most_frequent_color) => {
  var ctx = virtual_canvas.getContext('2d');

  var data = ctx.getImageData(x, y, 1, 1);


  if (data.data[0] === most_frequent_color) {
    return false;
  } else {
    return true;
  }
}

const handleMouseMoveEvents = (canvas, virtual_canvas, most_frequent_color) => {
  canvas.onmousemove = (e) => {
    var ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const transformedCursorPosition = { x: e.clientX - rect.x, y: e.clientY - rect.y }
    const { x, y } = transformedCursorPosition;

    //ctx.fillRect(x, y, 5, 5); //this lets me debug where it thinks the pointer is
    if (isThisPixelRelevant(x, y, virtual_canvas, most_frequent_color)) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "auto";
    }
  }
}

//why YES that means even if you share a link sometimes it goes somewhere you don't expect.
const newPictureButInitial = (canvas) => {

  const ods = Math.random();//true random because otherwise it tends to cluster
  if (ods < 0.95) {
    newHallway(canvas);
  } else {
    newRoom(canvas);
  }
  getQuipFor(canvas, chosen_image, currently_room);

}

const newPicture = (canvas, quadrant) => {
  clearNonGlitchMusic();
  const new_seed = Math.abs(all_images.indexOf(chosen_image) * 1000) * quadrant * 100 + quadrant;
  rand = new SeededRandom(new_seed);
  updateURLParams("seed=" + rand.initial_seed);

  const ods = Math.random();
  if (ods < 0.55) {
    newHallway(canvas);
  } else {
    newRoom(canvas);
  }

  let metaQuips = [];
  metaQuips = metaQuips.concat(getReferrerDetailsQuips());
  metaQuips = metaQuips.concat(getReferrerQuips());
  let tmp = rand.pickFrom(metaQuips);
  let chosen_meta = tmp ? "<br><Br>" + tmp + "<br><Br>" : "";


  message(`Stability: ${getStability()}%. ${glitchesFound > 0 ? glitchesFound + "." : ""} <br><br>` + getQuipFor(canvas, chosen_image, currently_room) + chosen_meta)

}




const threshold = function (canvas, threshold) {
  let num_black = 0;
  let num_white = 0;
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return;
  }
  var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var d = output.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
    if (v === 0) {
      num_black++;
    } else {
      num_white++;
    }
    d[i] = d[i + 1] = d[i + 2] = v
  }
  ctx.putImageData(output, 0, 0);
  return num_black > num_white ? 0 : 255;
};

const edge_detection = function (canvas) {
  kernel(canvas, [-1, -1, -1, -1, 9, -1, -1, -1, -1]);
}

const kernel = function (canvas, weights) {
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return;
  }
  var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side / 2);
  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var dst = output.data;
  // go through the destination image pixels
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y * w + x) * 4;
      // calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix
      var r = 0, g = 0, b = 0, a = 0;
      for (var cy = 0; cy < side; cy++) {
        for (var cx = 0; cx < side; cx++) {
          var scy = sy + cy - halfSide;
          var scx = sx + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcOff = (scy * sw + scx) * 4;
            var wt = weights[cy * side + cx];
            r += src[srcOff] * wt;
            g += src[srcOff + 1] * wt;
            b += src[srcOff + 2] * wt;
            a += src[srcOff + 3] * wt;
          }
        }
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a;
    }
  }
  ctx.putImageData(output, 0, 0);
}