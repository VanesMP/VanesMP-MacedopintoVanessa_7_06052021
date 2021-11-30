import { recipes } from './recipes.js';
import { Chips } from './chips.js';

//DOM
let dataListIngredient = document.getElementById('listElementIngredient');
let dataListAppareil = document.getElementById('listElementAppareil');
let dataListUstensil = document.getElementById('listElementUstensil');
const dropdownIngredient = document.querySelector('.arrowIngredients');
const dropdownAppareil = document.querySelector('.arrowAppareils');
const dropdownUstensil = document.querySelector('.arrowUstensiles');
const myRecipe = document.querySelector('.recipes');
let inputIngredients = document.querySelector('.ingredients');
let inputAppareils = document.querySelector('.appareil');
let inputUstenciles = document.querySelector('.ustensiles');
let inputMainSearch = document.getElementById('search');
const containerIngredients = document.querySelector('.findIngredients');
const containerAppareil = document.querySelector('.findAppareil');
const containerUstensils = document.querySelector('.findUstensiles');
const selectionChips = document.getElementById('choice');
const dropdownIngredientClick = document.querySelector('.arrowI');
const dropdownUstensilClick = document.querySelector('.arrowU');
const dropdownAppareilClick = document.querySelector('.arrowA');
const loupe = document.querySelector('.loupe')

//Variables globales
let divChips;
let arrayIngredientForDatalist = [];
let arrayAppareiltForDatalist = [];
let arrayUstensiltForDatalist = [];
let arrayChips = [];
let arrayIngredientForDatalistSansDoublons = [];
let arrayAppareiltForDatalistSansDoublons = [];
let arrayUstensiltForDatalistSansDoublons = [];
let selectionRecipe = [];
let ingredientInSelectionRecipe = [];
let appareilInSelectionRecipe = [];
let ustensilInSelectionRecipe = [];
let ingredientInSelectionRecipeNoDuplicate = [];
let appareilInSelectionRecipeNoDuplicate = [];
let ustensilInSelectionRecipeNoDuplicate = [];
let listDataIngredientInFirstsort = '';
let listDataAppareilInFirstsort = '';
let listDataUstensilInFirstsort = '';

//CONSTANTES
const INGREDIENT = 'INGREDIENT';
const USTENSIL = 'USTENSIL';
const APPAREIL = 'APPAREIL';

//PARTIE 1 : implementation des recettes
//Methode pourappeller la methode création du html
function appelCreateHtmlRecette(recipe) {
    for (let i = 0; i < recipe.length; i++) {
        createElementHtml(recipe[i])
    }
}
appelCreateHtmlRecette(recipes)

//création d un template pour la recette en html
function createElementHtml(recipe) {
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
        listIngredients.appendChild(myIngredient)
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
    firstPartTextRecipe.appendChild(nameRecipe)
    boxTime.appendChild(timeIcone)
    boxTime.appendChild(timeRecipe)
    boxTime.appendChild(minute)
    firstPartTextRecipe.appendChild(boxTime)
        //inserer la deuxieme partie de la 1 : 
    secondPartTextRecipe.appendChild(listIngredients)
    secondPartTextRecipe.appendChild(preparationRecipe)
    insideTextRecipe.appendChild(firstPartTextRecipe)
    insideTextRecipe.appendChild(secondPartTextRecipe)
    textRecipe.appendChild(insideTextRecipe)
        //inserer la partie image puis partie texte
    oneRecipe.appendChild(imageRecipe)
    oneRecipe.appendChild(textRecipe)
        //appendChild le plus grand
    myRecipe.appendChild(oneRecipe)
}

//---------------------- TRI DE NAVIGATION : LA BARRE DE RECHERCHE GENERALE --------------------------
//EventListener sur la loupe de la barre de menu principal pour faire le premier tri des recettes 
//correspondantes à l' entree de l' utilisateur
loupe.addEventListener('click', firstSortRecipeByMainSearch);

//EventListener sur la barre de nemu principal pour réafficher le placeholder d 'origine en cas 
//de correspondance infructueuses lors de la saisi utilisateur
inputMainSearch.addEventListener('click', () => {
    inputMainSearch.placeholder = 'Rechercher un ingrédient, appareil, ustensiles ou une recette';
});

//Methode pour rehercher les recettes correspondant à l entree utilisateur dans la barre de recherche
//dans le titre, les ingredients, la description
//afficher uniquement les recettes correspondantes
function firstSortRecipeByMainSearch() {
    let listRecipe = recipes;
    let userValueInMainSearch = inputMainSearch.value;
    //inputMainSearch.value = '';
    myRecipe.innerHTML = '';
    //si la saisie correspond au titre/ingredient/description retourne et affiche les recettes
    if (userValueInMainSearch.length >= 3) {
        selectionRecipe = listRecipe.filter((element) => {
            if (element.name.toLowerCase().includes(userValueInMainSearch.toLowerCase())) {
                console.log('consition name: ', element)
                return true
            }
            if (element.description.toLowerCase().includes(userValueInMainSearch.toLowerCase())) {
                console.log('consition description: ', element)
                return true
            }
            let selectionByIngredient = element.ingredients.filter((el) => {
                if (el.ingredient.toLowerCase().includes(userValueInMainSearch.toLowerCase())) {
                    console.log('consition ingredient: ', element)
                    return true
                }
            })
            if (selectionByIngredient.length > 0) {
                return true;
            }
            /* for (i = 0; i < element.ingredient.length; i++) {
                 if (element.ingredient[i].toLowerCase.includes(userValueInMainSearch.toLowerCase())) {
                     return true;
                 }
             }*/
        });
        appelCreateHtmlRecette(selectionRecipe);
        dataListIngredient.innerHTML = '';
        dataListAppareil.innerHTML = '';
        dataListUstensil.innerHTML = '';

        //recupere les ingredients, appareil et ustensiles de chaque recette de la selection des recettes
        selectionRecipe.forEach((data) => {
            //ingredients
            data.ingredients.forEach((ing) => {
                    listDataIngredientInFirstsort = ing.ingredient;
                    ingredientInSelectionRecipe.push(listDataIngredientInFirstsort)
                })
                //appareils
            listDataAppareilInFirstsort = data.appliance;
            appareilInSelectionRecipe.push(listDataAppareilInFirstsort);
            //ustensils
            data.ustensils.forEach((dat) => {
                listDataUstensilInFirstsort = dat;
                ustensilInSelectionRecipe.push(listDataUstensilInFirstsort)
            })
        });
        //trier par ordre alphabetique puis mettre tous les element dans un tableaux sans les doublons
        //ingredients
        ingredientInSelectionRecipe.sort()
        ingredientInSelectionRecipeNoDuplicate = Array.from(new Set(ingredientInSelectionRecipe));
        //appareil
        appareilInSelectionRecipe.sort()
        appareilInSelectionRecipeNoDuplicate = Array.from(new Set(appareilInSelectionRecipe));
        //ustensils
        ustensilInSelectionRecipe.sort()
        ustensilInSelectionRecipeNoDuplicate = Array.from(new Set(ustensilInSelectionRecipe));

        //placer chaque data dans sa dropdown d' origine
        //ingredients
        ingredientInSelectionRecipeNoDuplicate.forEach((liIngredient) => {
            let option = document.createElement('li')
            option.innerHTML = liIngredient
            option.classList.add('liIngredient')
            option.setAttribute('data-ingredient', liIngredient)
            dataListIngredient.appendChild(option)
            dataListIngredient.classList.add('listElementIngredData')
        });
        //appareil
        appareilInSelectionRecipeNoDuplicate.forEach((liAppareil) => {
            let option = document.createElement('li')
            option.innerHTML = liAppareil
            option.classList.add('liAppareil')
            option.setAttribute('data-appareil', liAppareil)
            dataListAppareil.appendChild(option)
        });
        //ustensils
        ustensilInSelectionRecipeNoDuplicate.forEach((liUstensil) => {
            let option = document.createElement('li')
            option.innerHTML = liUstensil
            option.classList.add('liUstensil')
            option.setAttribute('data-ustensil', liUstensil)
            dataListUstensil.appendChild(option)
                //dataListUstensil.classList.remove('listElementUst')
            dataListUstensil.classList.add('listElementUstensdData')
        });

        createListenerIngredientInDropdown()
        createListenerAppareilInDropdown()
        createListenerUstensilInDropdown()
            //console.log('selectionRecipe:', selectionRecipe)
    }

    if (selectionRecipe == '') {
        inputMainSearch.placeholder = `Aucune recette ne correspond à votre critère… vous pouvez chercher 
        «tarte aux pommes», «poisson» etc.`;
        console.log('selectionRecipe:', selectionRecipe)
    }
}
//Trier avec les recettes correspondantes a la saisi utilisateur de la barre de recherche
//Ne laisser dansles dropdown que les data(ingredient & appareil & ustensile) correspond a ceux des recettes


//---------------------- TRI DE NAVIGATION : LES 3 IMPUTS --------------------------
//Gestionnaire d'evenement sur les input de navigation
//1:Tri par ingrédients
inputIngredients.addEventListener('change', recupValues);
//Methode pour trier par ingrédients aprés que l utilisateur est saisie retourne les recette filtrées
function filterByIngredient(recipe, valueIngredient) {
    let goodRecipeIngredient = recipe.filter((element) => {
        for (let i = 0; i < element.ingredients.length; i++) {
            if (element.ingredients[i].ingredient.toLowerCase().includes(valueIngredient.toLowerCase())) {
                return true
            }
        }
    })
    console.log('goodRecipeIngredient:', goodRecipeIngredient)
    return goodRecipeIngredient;
};

//2:Tri par appareils
inputAppareils.addEventListener('change', recupValues);
//Methode qui va recuperer la liste des recettes filtré par appareil et appel la methoe pour créer le html 
function filterByAppareil(recipe, valueAppareil) {
    let goodRecipeAppareil = recipe.filter(element => {
        if (element.appliance.toLowerCase().includes(valueAppareil.toLowerCase())) {
            return true;
        }
    })
    return goodRecipeAppareil;
}

//3:Tri par ustensiles
inputUstenciles.addEventListener('change', recupValues);
//Methode qui va recuperer la liste des recettes filtré par ustensiles et appel la methoe pour créer le html 
function filterByUstensile(recipe, valueUstensil) {
    let goodRecipeUstensil = recipe.filter((element) => {
        for (let i = 0; i < element.ustensils.length; i++) {
            if (element.ustensils[i].toLowerCase().includes(valueUstensil.toLowerCase())) {
                return true
            }
        }
    })
    return goodRecipeUstensil
}
//---------- Deuxieme algo de tri faire fonctionner les input tous ensemble
//recuperer dans la meme variable la liste complete des recette trié a chaque saisi dans un input
function recupValues() {
    let filteredRecipe = recipes;
    if (inputIngredients.value !== null) {
        filteredRecipe = filterByIngredient(filteredRecipe, inputIngredients.value)
    }
    if (inputAppareils.value !== null) {
        filteredRecipe = filterByAppareil(filteredRecipe, inputAppareils.value)
    }
    if (inputUstenciles.value !== null) {
        filteredRecipe = filterByUstensile(filteredRecipe, inputUstenciles.value)
    }
}

//---------------------- TRI DE NAVIGATION : LES ELEMENTS DANS LA DROPDOWN --------------------------
//----------------------- PARTIE 2: trier des recettes ------------------------------
//1:Remplir la liste deroulée html des dropdown avec un tableau des elements associés
//2:Gestionnaire d evenement pour chaque element pour afficher une liste de recette selon l element selectionné dans la liste
//------- Searchable dropdown: INGREDIENT ---------------------------
//2.1.1 liste des ingredients sans doublons a mettre dans la dropdown
function addListIngredientDataInDropdown() {
    dataListIngredient.innerHTML = '';

    recipes.forEach((element) => {
        for (let i = 0; i < element.ingredients.length; i++) {
            arrayIngredientForDatalist.push(element.ingredients[i].ingredient);
        }
    })
    arrayIngredientForDatalist.sort();
    arrayIngredientForDatalistSansDoublons = Array.from(new Set(arrayIngredientForDatalist));
    arrayIngredientForDatalistSansDoublons.forEach((element) => {
        let option = document.createElement('li')
        option.innerHTML = element
        option.classList.add('liIngredient')
        option.setAttribute('data-ingredient', element)
        dataListIngredient.classList.remove('listElementIngredData')
        dataListIngredient.appendChild(option)
    })
    createListenerIngredientInDropdown();
};

addListIngredientDataInDropdown(recipes)

//2.1.2:l'element arrow ouvrir et ferme (si l utilisateur ne veux pas saisir un ingredient) la dropdown avec un gestionnaire d' evenement 'click'
dropdownIngredientClick.addEventListener('click', function() {
    if (this.className == 'arrowI') {
        this.classList.remove('arrowI')
        openingDropdownIngredient()
    } else {
        this.classList.add('arrowI')
        closingDropdownIngredient()
    }
});
//methode d ouverture
function openingDropdownIngredient() {
    dataListIngredient.style.display = 'block';
    containerIngredients.style.width = "100%";
    dropdownIngredient.classList.add('arrowClick');
}
//methode de fermeture
function closingDropdownIngredient() {
    dataListIngredient.style.display = 'none';
    containerIngredients.style.width = "170px";
    dropdownIngredient.classList.remove('arrowClick');
}

//2.1.3: l element sélectionné tri la liste des recettes pour affiché les recettes qui contiennent l' ingrédients selectionné 
function createListenerIngredientInDropdown() {
    let liIngredient = document.querySelectorAll('.liIngredient');
    for (let i = 0; i < liIngredient.length; i++) {
        liIngredient[i].addEventListener('click', function() {
            dropdownIngredientClick.classList.add('arrowI')
            closingDropdownIngredient();
            let myChips = new Chips(INGREDIENT, liIngredient[i].dataset.ingredient);
            arrayChips.push(myChips);
            createHtmlChips(myChips);
            inputIngredients.value = '';
            filterByIngredient(recipes, liIngredient[i].dataset.ingredient)
                //addListIngredientDataInDropdown()
        })
    }
}

//------- Searchable dropdown: APPAREIL ---------------------------
//2.2.1:liste des ingredients sans doublons a mettre dans la dropdown
function addListAppareilDataInDropdown() {
    dataListAppareil.innerHTML = '';

    recipes.forEach((recipe) => {
        arrayAppareiltForDatalist.push(recipe.appliance);
    })
    arrayAppareiltForDatalist.sort();
    arrayAppareiltForDatalistSansDoublons = Array.from(new Set(arrayAppareiltForDatalist));
    arrayAppareiltForDatalistSansDoublons.forEach((element) => {
        let option = document.createElement('li')
        option.innerHTML = element
        option.classList.add('liAppareil')
        option.setAttribute('data-appareil', element)
        dataListAppareil.appendChild(option)
    })
    createListenerAppareilInDropdown()
}

addListAppareilDataInDropdown();

//2.2.2:l'element arrow ouvrir et ferme (si l utilisateur ne veux pas saisir un ingredient) la dropdown avec un gestionnaire d' evenement 'click'
dropdownAppareilClick.addEventListener('click', function() {
    if (this.className == 'arrowA') {
        this.classList.remove('arrowA')
        dataListAppareil.style.display = 'block';
        dropdownAppareil.classList.add('arrowClick');
    } else {
        this.classList.add('arrowA')
        dataListAppareil.style.display = 'none';
        dropdownAppareil.classList.remove('arrowClick');
    }
});

//2.2.3: Methode qui recupere l element sélectionné, tri la liste des recettes pour affiché les recettes, et cré le chips 
function createListenerAppareilInDropdown() {
    let liAppareil = document.querySelectorAll('.liAppareil');
    for (let i = 0; i < liAppareil.length; i++) {
        liAppareil[i].addEventListener('click', function() {
            dataListAppareil.style.display = 'none';
            dropdownAppareil.classList.remove('arrowClick');
            let myChips = new Chips(APPAREIL, liAppareil[i].dataset.appareil);
            arrayChips.push(myChips);
            createHtmlChips(myChips);
            inputAppareils.value = '';
            filterByAppareil(recipes, liAppareil[i].dataset.appareil);
            addListAppareilDataInDropdown()
        })
    }
};

//------- Searchable dropdown: USTENSILES ---------------------------
//2.3.1:liste des ustensiles sans doublons a mettre dans la dropdown
function addListUstencilDataInDropdown() {
    dataListUstensil.innerHTML = '';

    recipes.forEach((element) => {
        for (let i = 0; i < element.ustensils.length; i++) {
            arrayUstensiltForDatalist.push(element.ustensils[i]);
        }
    })
    arrayUstensiltForDatalist.sort();
    arrayUstensiltForDatalistSansDoublons = Array.from(new Set(arrayUstensiltForDatalist));
    arrayUstensiltForDatalistSansDoublons.forEach((element) => {
        let option = document.createElement('li')
        option.innerHTML = element
        option.classList.add('liUstensil')
        option.setAttribute('data-ustensil', element)
        dataListUstensil.appendChild(option)
    })
    createListenerUstensilInDropdown();
};

addListUstencilDataInDropdown();

//2.3.2:l'element arrow ouvrir et ferme (si l utilisateur ne veux pas saisir un ustensile) la dropdown avec un gestionnaire d' evenement 'click'
dropdownUstensilClick.addEventListener('click', function() {
    if (this.className == 'arrowU') {
        this.classList.remove('arrowU')
        dataListUstensil.style.display = 'block';
        containerUstensils.style.width = "100%";
        dropdownUstensil.classList.add('arrowClick');
        dataListUstensil.classList.remove('listElementUstensdData')
    } else {
        this.classList.add('arrowU')
        dataListUstensil.style.display = 'none';
        containerUstensils.style.width = '170px';
        dropdownUstensil.classList.remove('arrowClick');
    }
});
//2.3.3: Methode qui recupere l element sélectionné, tri la liste des recettes pour affiché les recettes, et cré le chips 
function createListenerUstensilInDropdown() {
    let liUstensil = document.querySelectorAll('.liUstensil');
    for (let i = 0; i < liUstensil.length; i++) {
        liUstensil[i].addEventListener('click', function() {
            dataListUstensil.style.display = 'none';
            dropdownUstensil.classList.remove('arrowClick');
            let myChips = new Chips(USTENSIL, liUstensil[i].dataset.ustensil);
            arrayChips.push(myChips);
            createHtmlChips(myChips);
            containerUstensils.style.width = "170px";
            inputUstenciles.value = '';
            filterByUstensile(recipes, liUstensil[i].dataset.ustensil);
            addListUstencilDataInDropdown();
        })
    }
}
//Méthode pour créer les chips en html
function createHtmlChips(chips) {
    divChips = document.createElement('div')
    divChips.classList.add('boxChips')
    divChips.setAttribute('data-selectionIngredient', chips.myValue);
    divChips.innerHTML = chips.createHtml();
    selectionChips.classList.remove('displayNone');
    selectionChips.classList.add('displayFlex');
    selectionChips.appendChild(divChips)
    closeChipsByListener(divChips, chips);
    sortRecipeChips();
}

//Methode pour fermer les chips
function closeChipsByListener(node, myChips) {
    let closeChip = node.querySelector('.closeChips');
    closeChip.addEventListener('click', function() {
        node.style.display = 'none';
        closeArrayChips(myChips)
    })
}

//Trier les recette(complete) avec chaque chips selectionné ou retirer
//et a chaque ajout ou supp recommencer
//Recuperer le tableau global qui contient tous les chips de tous les types 
//et avec la croix close les supprimer du tableau
let findIndex;

function closeArrayChips(myChips) {
    for (let i = 0; i < arrayChips.length; i++) {
        if (arrayChips[i].myValue === myChips.myValue) {
            findIndex = i;
            arrayChips.splice(findIndex, 1);
            sortRecipeChips()
        }
    }
}

function sortRecipeChips() {
    myRecipe.innerHTML = '';
    let filteredRecipeByChips = recipes;
    for (let i = 0; i < arrayChips.length; i++) {
        if (arrayChips[i].type === 'INGREDIENT') {
            filteredRecipeByChips = filterByIngredient(filteredRecipeByChips, arrayChips[i].myValue)
        }
        if (arrayChips[i].type === 'APPAREIL') {
            filteredRecipeByChips = filterByAppareil(filteredRecipeByChips, arrayChips[i].myValue)
        }
        if (arrayChips[i].type === 'USTENSIL') {
            filteredRecipeByChips = filterByUstensile(filteredRecipeByChips, arrayChips[i].myValue)
        }
    }
    appelCreateHtmlRecette(filteredRecipeByChips);
    console.log('filteredRecipeByChips:', filteredRecipeByChips)
}

//---------------------- TRI AVEC SAISIE >= 3 CARACTERES DANS LES INPUTS -----------------------------
//1:Methode pour afficher les elements de la liste d'ingredients qui correspondent aux 3 lettres saisie par l utilisateur dans l input
//Mehode pour afficher les propositions apres la saisi de 3 caracteres 

function showSuggestionIngredientInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        console.log('data:', data)
        return data = `<li class='liIngredient' data-ingredient='${data}'>${data}</li>`
    });
    dataListIngredient.innerHTML = listData;
    dataListIngredient.classList.add('listElementIngredData')
}

//EventListener qui permet d 'afficher les choix possible lorsque l utilisateur a saisit 3 lettres(evite d'appuyer sur entrée)
inputIngredients.addEventListener("keyup", sortByValueIngredient);

function sortByValueIngredient(e) {
    let userValueIngredient = e.target.value;
    let listIngredientForDataUser = arrayIngredientForDatalistSansDoublons;
    let emptyArrayForInputIngredient = [];
    containerIngredients.style.width = '170px';
    if (userValueIngredient.length >= 3) {
        emptyArrayForInputIngredient = listIngredientForDataUser.filter((data) => {
            return data.toLowerCase().includes(userValueIngredient.toLowerCase());
        });
        console.log(emptyArrayForInputIngredient)
        showSuggestionIngredientInDropdown(emptyArrayForInputIngredient)
        createListenerIngredientInDropdown();
        openingDropdownIngredient();
    } else if (userValueIngredient.length < 3) {
        dataListIngredient.innerHTML = ' ';
        dropdownIngredient.classList.remove('arrowClick');
        dataListIngredient.classList.remove('listElementIngredData');
    }
    //condition si une saisie de 3 caracteres ne correspond a aucun ingrédient
    if (userValueIngredient.length >= 3 && emptyArrayForInputIngredient == '') {
        dataListIngredient.innerHTML = '';
        inputIngredients.value = '';
        closingDropdownIngredient()
        alert("Cet ingrédient n'est pas présent dans nos recettes, essayez à nouveau!")
    }
};

//2:Methode pour afficher les elements de la liste d'appareil qui correspondent aux 3 lettres saisie par l utilisateur dans l input
//EventListener qui permet d 'afficher les choix possible lorsque l utilisateur a saisit 3 lettres(evite d'appuyer sur entrée)
inputAppareils.addEventListener('keyup', sortByValueAppareil);

function showSuggestionAppareilInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        console.log('data:', data)
        return data = `<li class='liAppareil' data-appareil='${data}'>${data}</li>`
    });
    dataListAppareil.innerHTML = listData;
}

function sortByValueAppareil(e) {
    let userValueAppareil = e.target.value;
    let listAppareilForValueUser = arrayAppareiltForDatalistSansDoublons;
    let emptyArrayForInputAppareil = [];
    if (userValueAppareil.length >= 3) {
        emptyArrayForInputAppareil = listAppareilForValueUser.filter((data) => {
            return data.toLowerCase().includes(userValueAppareil.toLowerCase());
        });
        showSuggestionAppareilInDropdown(emptyArrayForInputAppareil)
        createListenerAppareilInDropdown()
        dataListAppareil.style.display = 'block';
        dropdownAppareil.classList.add('arrowClick');
    } else if (userValueAppareil.length < 3) {
        dataListAppareil.innerHTML = ' ';
        dropdownAppareil.classList.remove('arrowClick');
    }
    //condition si une saisie ne correspond a aucun appareil
    if (userValueAppareil.length >= 3 && emptyArrayForInputAppareil == '') {
        createListenerAppareilInDropdown()
        inputAppareils.value = '';
        dropdownAppareil.classList.remove('arrowClick');
        alert("Cet appareil n'est pas présent dans nos recettes, essayez à nouveau!")
    }
}

//3:Methode pour afficher les elements de la liste d' ustencil'qui correspondent aux 3 lettres saisie par l utilisateur dans l input
//EventListener qui permet d 'afficher les choix possible lorsque l utilisateur a saisit 3 lettres(evite d'appuyer sur entrée)
inputUstenciles.addEventListener('keyup', sortByValueUstencil);

function showSuggestionUstencilInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        console.log('data:', data)
        return data = `<li class='liUstensil' data-ustensil='${data}'>${data}</li>`
    });
    dataListUstensil.innerHTML = listData;
    dataListUstensil.classList.add('listElementUstensdData')
}

function sortByValueUstencil(e) {
    let userValueUstencil = e.target.value;
    let listUstencilForValueUser = arrayUstensiltForDatalistSansDoublons;
    let emptyArrayForInputUstencil = [];
    if (userValueUstencil.length >= 3) {
        containerUstensils.style.width = '100%'
        emptyArrayForInputUstencil = listUstencilForValueUser.filter((data) => {
            return data.toLowerCase().includes(userValueUstencil.toLowerCase());
        });
        console.log('emptyArrayForInputUstencil:', emptyArrayForInputUstencil)
        if (emptyArrayForInputUstencil != '') {
            //console.log('winner')
            showSuggestionUstencilInDropdown(emptyArrayForInputUstencil);
            createListenerUstensilInDropdown()
            dataListUstensil.style.display = 'block';
            dropdownUstensil.classList.add('arrowClick');
        } else {
            //console.log('lose')
            inputUstenciles.value = '';
            dropdownUstensil.classList.remove('arrowClick');
            alert("Cet ustensile n'est pas présent dans nos recettes, essayez à nouveau!")
        }
    } else if (userValueUstencil.length < 3) {
        dataListUstensil.innerHTML = ' ';
        containerUstensils.style.width = '170px'
        dropdownUstensil.classList.remove('arrowClick');
        dataListUstensil.classList.remove('listElementUstensdData')
    }
}