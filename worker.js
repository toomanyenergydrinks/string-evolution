const TARGET_STR = "this string was produced by evolution";
const RANDOM_STR_MAX_LEN = 50;
const MUTATION_RATE = 40;
const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const MUTATION_STEPS = 2
const PENALTY_FACTOR = 100
const INITIAL_GENERATION_SIZE = 100;
const GENERATIONS = 1000;
const ALLOWED_TO_BREED = 40;
const ALLOWED_SURVIVORS = 40;
let counter = 0;
let best_candidates = []
let best_candidates_children = []
let candidates = []

let new_g = [];

let running = 1;


function random_string(len) {

  z = new Array(len)
             .fill(0)
             .map((_) => ALPHABET.charAt(get_random_int(0,ALPHABET.length)))
             .join("")

  return z;
  }

function create_generation(size) {

  g = new Array(size)
               .fill(0)
               .map((_) => random_string(Math.round(get_random_int(5,RANDOM_STR_MAX_LEN)) ))

  return g
}
 
function fitness(str) {

  let smallest = Math.min.apply(null,[str.length, TARGET_STR.length]);
  let score = 0;
  score += Math.abs(str.length - TARGET_STR.length) * 100;

  for(let x=0;x<smallest;x++) {
    score += Math.abs(str.charCodeAt(x) - TARGET_STR.charCodeAt(x));
  }

  return score;

}

function mutate(str) {

  return str
         .split("")
         .map((letter) => 
           (Math.round(Math.random()*MUTATION_RATE) == 2) ? String.fromCharCode(letter.charCodeAt(0)+Math.round(((Math.random()*MUTATION_STEPS)-(MUTATION_STEPS/2)))) : letter)
         .join("");

}


function get_random_int(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
}

function breed(str1, str2) {

  let cp_1 = get_random_int(0, str1.length-1);
  let cp_2 = get_random_int(cp_1, str1.length-1);

  let cp_3 = get_random_int(0, str2.length-1);
  let cp_4 = get_random_int(cp_3, str2.length-1);

  return (str1.slice(0, cp_1) + str2.slice(cp_3, cp_4) + str1.slice(cp_2, str2.length)).toString();

}

function create_children(best_candidates) {

  best_candidates_children = []
  for(let y=0;y<ALLOWED_TO_BREED;y++) {
    for(let i=0;i<(ALLOWED_TO_BREED-y);i++) {
      best_candidates_children.push(breed(best_candidates[y],best_candidates[get_random_int(0,i)]));
    }
  }
  return best_candidates_children;

}

  candidates = create_generation(INITIAL_GENERATION_SIZE)

  while(running != 0) {

    best_candidates_children = []

    new_g = candidates
              .map((c) => [c, fitness(c)])
              .sort((a,b) => a[1] - b[1]);

    best_candidates = new_g
                        .map((c) => c[0])
                        .slice(0,ALLOWED_SURVIVORS);

    best_candidates.concat(create_children(best_candidates))

    candidates = best_candidates.concat(create_generation(20)).concat(best_candidates_children);
    candidates = candidates.map((x) => mutate(x));

    postMessage(new_g[0][0]);

    if (new_g[0][1] == 0) {
      running = 0;
    }

  }

