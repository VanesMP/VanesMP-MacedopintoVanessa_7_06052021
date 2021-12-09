//DOM
const myRecipe = document.querySelector('.recipes');

//création d un template pour la recette en html

export function createElementHtml(recipe) {
    let listIngredients = document.createElement('ul');
    listIngredients.classList.add('listIngredients');
    for (let i = 0; i < recipe.ingredients.length; i++) {
        let myIngredient = document.createElement('li');
        myIngredient.classList.add('myIngredient');
        if (recipe.ingredients[i].quantity === undefined && recipe.ingredients[i].unit === undefined) {
            myIngredient.innerHTML = recipe.ingredients[i].ingredient;
        } else if (recipe.ingredients[i].quantity !== ' ' && recipe.ingredients[i].unit === undefined) {
            myIngredient.innerHTML = recipe.ingredients[i].ingredient + ': ' + recipe.ingredients[i].quantity;
        } else if (recipe.ingredients[i].quantity !== ' ' || recipe.ingredients[i].unit !== ' ') {
            myIngredient.innerHTML = recipe.ingredients[i].ingredient + ': ' + recipe.ingredients[i].quantity + ' ' + recipe.ingredients[i].unit;
        }
        listIngredients.appendChild(myIngredient);
    }
    //le conteneur de tous les elements necessaires pour la recette
    const oneRecipe = document.createElement('div');
    oneRecipe.classList.add('oneRecipe');
    oneRecipe.setAttribute('id', recipe.id);
    //Emplacement de la photo de la recette
    const imageRecipe = document.createElement('div');
    imageRecipe.classList.add('imageRecipe');
    //Partie du bas de la recette, les textes
    const textRecipe = document.createElement('div'); //1: le conteneur de tous les textes first et second
    textRecipe.classList.add('textRecipe');
    const insideTextRecipe = document.createElement('div');
    insideTextRecipe.classList.add('insideTextRecipe');
    //first partie : h1: name et elements time
    const firstPartTextRecipe = document.createElement('div');
    firstPartTextRecipe.classList.add('firstPartTextRecipe');
    const nameRecipe = document.createElement('h1'); //h1 = nom de la recette
    nameRecipe.classList.add('nameRecipe');
    nameRecipe.innerHTML = recipe.name;
    //conteneur des elements de time : icone + durée
    const boxTime = document.createElement('div');
    boxTime.classList.add('boxTime');
    const timeIcone = document.createElement('div'); //icone horloge
    timeIcone.classList.add('timeIcone');
    const timeRecipe = document.createElement('div');
    timeRecipe.classList.add('timeRecipe'); //durée de la recette + min
    timeRecipe.innerHTML = recipe.time;
    const minute = document.createElement('p');
    minute.classList.add('timeRecipe');
    minute.innerHTML = "min";
    //second partie: liste des ingrédients + préparation de la recette
    const secondPartTextRecipe = document.createElement('div');
    secondPartTextRecipe.classList.add('secondPartTextRecipe');
    //le texte de préparation de la recette
    const preparationRecipe = document.createElement('div');
    preparationRecipe.classList.add('preparationRecipe');
    preparationRecipe.innerHTML = recipe.description;
    //Methode appendChild
    //inserer la premiere partie de la 1 : nom + durée
    firstPartTextRecipe.appendChild(nameRecipe);
    boxTime.appendChild(timeIcone);
    boxTime.appendChild(timeRecipe);
    boxTime.appendChild(minute);
    firstPartTextRecipe.appendChild(boxTime);
    //inserer la deuxieme partie de la 1 : 
    secondPartTextRecipe.appendChild(listIngredients);
    secondPartTextRecipe.appendChild(preparationRecipe);
    insideTextRecipe.appendChild(firstPartTextRecipe);
    insideTextRecipe.appendChild(secondPartTextRecipe);
    textRecipe.appendChild(insideTextRecipe);
    //inserer la partie image puis partie texte
    oneRecipe.appendChild(imageRecipe);
    oneRecipe.appendChild(textRecipe);
    //appendChild le plus grand
    myRecipe.appendChild(oneRecipe);
}