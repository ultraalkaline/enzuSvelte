export const ucCharacterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const lcCharacterSet = 'abcdefghijklmnopqrstuwxyz';

export function browserCanPlayH265(vidEl) {
  return vidEl.canPlayType('video/mp4; codecs=hvc1') === "probably";
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function mapRange(in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export function getRandomChar(lowerCase) {
  return lowerCase ? lcCharacterSet[Math.floor(Math.random() * lcCharacterSet.length)] : ucCharacterSet[Math.floor(Math.random() * ucCharacterSet.length)];
}

export function getRandomString(numChars) {
  let randomStr = '';
  for (let i = 0; i < numChars; i++)
  {
    randomStr += getRandomChar();
  }
  return randomStr;
}

export function importAll(r) {
  let files = {};
  r.keys().map(item => { files[item.replace('./', '')] = r(item); });
  return files;
}

export function importProjectMedia(project) {
  const projectId = project.id;

  let mediaFiles = {};

  switch (projectId) {
    case 'anu':
      mediaFiles = import.meta.glob('./img/projects/anu/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
    case 'inanna-n60':
      mediaFiles = import.meta.glob('./img/projects/inanna-n60/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
    case 'enzu':
      mediaFiles = import.meta.glob('./img/projects/enzu/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
    case 'arc90':
      mediaFiles = import.meta.glob('./img/projects/arc90/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
    case 'album-covers':
      mediaFiles = import.meta.glob('./img/projects/album-covers/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
    case 'logofolio':
      mediaFiles = import.meta.glob('./img/projects/logofolio/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
    case 'natural-habitat':
      mediaFiles = import.meta.glob('./img/projects/natural-habitat/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
    case 'tre':
      mediaFiles = import.meta.glob('./img/projects/tre/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
    default:
      mediaFiles = import.meta.glob('./img/projects/*.(mp4|webm|webp)', {query: "?url", eager: true});
      break;
  }

  let fileArr = [];

  Object.entries(mediaFiles).forEach(element => {
    if (!element[0].includes('anim.mp4') && !element[0].includes('anim.webm')) {
      fileArr.push(element[1]);
    }
  });

  fileArr.sort(function(a, b) {
    // Extract the numbers from file paths using regular expressions
    let numA, numB;

    const regex = /(\d+)\.\w+$/;

    try {
      numA = parseInt(a.default.match(regex)[1]);
      numB = parseInt(b.default.match(regex)[1]);
    } catch (error) {
    } 

    return numA - numB;
  });
  
  return fileArr;
}

export function removeClass(query, className) {
  document.querySelectorAll(query).forEach((element) => {
    if (element.classList.contains(className))
      element.classList.remove(className);
  });
}

export function addClass(query, className) {
  document.querySelectorAll(query).forEach((element) => {
    if (!element.classList.contains(className))
      element.classList.add(className);
  });
}

export function hasClass(query, className) {
  return Array.from(document.querySelectorAll(query)).some(({classList}) => classList.contains(className));
}

export function elHasClass(el, className) {
  return el.classList.contains(className);
}

export const elementIsInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export function shuffleCharacters(el, text) {
  const numIterations = text.length;
  const duration = 100; // Duration of each iteration in milliseconds
  const delay = 50; // Delay between iterations in milliseconds
  let i = 0;
  var interval = setInterval(() => {
    if (i < numIterations)
    {
      el.textContent = el.textContent.charAt(el.textContent.length - 1) + el.textContent.substring(0, el.textContent.length - 1);
      i++;
    }
    else
    {
      clearInterval(interval);
    }
  }, delay);
}

export function shuffleRandomChars(el, text, lowerCase, iterations = 2) {

    const duration = 25; // Duration of each iteration in milliseconds
    const delay = 12; // Delay between iterations in milliseconds

    const chars = text.split('');
    const originalText = [...chars]; // Make a copy of the original text

    const shuffleIntervals = [];

    el.textContent = getRandomString();

    for (let i = 0; i < chars.length; i++) {
      let numIterations = iterations;
      shuffleIntervals.push(
        setInterval(() => {
          if (numIterations > 0) {
            if (lowerCase)
              chars[i] = getRandomChar(true); // Shuffle the character (lowercase)
            else
              chars[i] = getRandomChar(false); // Shuffle the character (uppercase)
            el.textContent = chars.join(''); // Update the element's content with the new character
            numIterations--;
          } else {
            chars[i] = originalText[i]; // Restore the original character
            el.textContent = chars.join(''); // Update the element's content with the original character
            clearInterval(shuffleIntervals[i]); // Clear the interval for this character
          }
        }, duration + i * delay) // Add a delay between intervals for different characters
      );
    }
}

export function shuffleLoaderChars(text, lowerCase) {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader-text');
    const duration = 100; // Duration of each iteration in milliseconds
    const delay = 24; // Delay between iterations in milliseconds

    const chars = text.split('');
    const originalText = [...chars]; // Make a copy of the original text

    const shuffleIntervals = [];

    loader.textContent = getRandomString();

    for (let i = 0; i < chars.length; i++) {
      shuffleIntervals.push(
        setInterval(() => {
          if (document.readyState != 'complete') {
            if (lowerCase)
              chars[i] = getRandomChar(true); // Shuffle the character (lowercase)
            else
              chars[i] = getRandomChar(false); // Shuffle the character (uppercase)
              loader.textContent = chars.join(''); // Update the element's content with the new character
          } else {
            // TODO: Change this part to finally shuffle to the final character in a sequence until displaying the target text. 
            chars[i] = originalText[i]; // Restore the original character
            loader.textContent = chars.join(''); // Update the element's content with the original character
            clearInterval(shuffleIntervals[i]); // Clear the interval for this character
            resolve();
          }
        }, duration + i * delay) // Add a delay between intervals for different characters
      );
    }
  });
}