const target_str = "hello, genetic world! this string was evolved!";

function random_string(len) {

  str = "";
  r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for(x=0;x<len;x++) {
    str += r.charAt(Math.floor(Math.random()*r.length));
  }
  return str;

}

function create_generation(size) {

  let candidates = [];
  for (let x=0;x<size;x++) {
    candidates[x] = random_string(Math.random()*50);
  }
  return candidates;

}

function fitness(str) {

  let smallest = Math.min.apply(null,[str.length, target_str.length]);
  let score = 0;
  score += Math.abs(str.length - target_str.length) * 100;

  for(let x=0;x<smallest;x++) {
    score += Math.abs(str.charCodeAt(x) - target_str.charCodeAt(x));
  }

  return score;

}

function mutate(str) {

  return str.split("").map(function(letter) {
    if (Math.round(Math.random()*20) == 2) {
      return String.fromCharCode(letter.charCodeAt(0)+Math.round(((Math.random()*2)-1)));
    } else {
      return letter;
    }
  }).join("");

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function breed(str1, str2) {

  cp_1 = getRandomInt(0, str1.length-1);
  cp_2 = getRandomInt(cp_1, str1.length-1);

  cp_3 = getRandomInt(0, str2.length-1);
  cp_4 = getRandomInt(cp_3, str2.length-1);

  s = (str1.slice(0, cp_1) + str2.slice(cp_3, cp_4) + str1.slice(cp_2, str2.length)).toString();
  return s;

}

function update_page() {
  
}


  var counter = 0;
  const initial_generation_size = 200;
  const generations = 1000;
  const breeding_number = 40;
  const allowed_survivors = 40;
  const generation_skip = 10;

  var generation_history = [];
  var g = create_generation(initial_generation_size);
  var new_g = [];

  var running = 1;

  var x = 0;

//  for(let x = 0;x<generations;x++) {
  while(running != 0) {
 
    new_g = g.map(function(c) { return [c, fitness(c)]; }).sort((a,b) => a[1] - b[1]);

    console.log(new_g[0][1]);

    var top = new_g.map((c) => c[0]).slice(0,allowed_survivors);

    var top_kids = []

    for(let y=0;y<breeding_number;y++) {
      for(let i=0;i<(breeding_number-y);i++) {
        top_kids.push(breed(top[y],top[getRandomInt(0,i)]));
      }
    }

    g = top

    g = g.concat(create_generation(100)).concat(top_kids).concat(top).map((x) => mutate(x));

    generation_history = generation_history.concat(new_g[0][0]);
    postMessage(new_g[0][0]);

    if (new_g[0][1] == 0) {
      running = 0;
    }

  }

