import { recipes } from './recipes.js';
import { createElementHtml } from './htmlTemplate.js';
import { Chips } from './chips.js';

//DOM
const myRecipe = document.querySelector('.recipes');
let dataListIngredient = document.getElementById('listElementIngredient');
let dataListAppareil = document.getElementById('listElementAppareil');
let dataListUstensil = document.getElementById('listElementUstensil');
const dropdownIngredient = document.querySelector('.arrowIngredients');
const dropdownAppareil = document.querySelector('.arrowAppareils');
const dropdownUstensil = document.querySelector('.arrowUstensiles');
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
const loupe = document.querySelector('.loupe');

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
let findIndex;

//CONSTANTES
const INGREDIENT = 'INGREDIENT';
const USTENSIL = 'USTENSIL';
const APPAREIL = 'APPAREIL';

//PARTIE 1 : implementation des recettes
//Methode pourappeller la methode création du html
function appelCreateHtmlRecette(recipes) {
    for (let i = 0; i < recipes.length; i++) {
        createElementHtml(recipes[i]);
    }
}
appelCreateHtmlRecette(recipes);

//---------------------- TRI DE NAVIGATION : LA BARRE DE RECHERCHE GENERALE --------------------------
//EventListener sur la loupe de la barre de menu principal pour faire le premier tri des recettes 
//correspondantes à l' entree de l' utilisateur
loupe.addEventListener('click', firstSortRecipeByMainSearch);

//EventListener sur la barre de nemu principal pour réafficher le placeholder d 'origine en cas 
//de correspondance infructueuses lors de la saisi utilisateur
inputMainSearch.addEventListener('click', () => {
    inputMainSearch.placeholder = 'Rechercher un ingrédient, appareil, ustensiles ou une recette';
})

//Methode pour rehercher les recettes correspondant à l entree utilisateur dans la barre de recherche
//dans le titre, les ingredients, la description
//afficher uniquement les recettes correspondantes
function firstSortRecipeByMainSearch() {
    let listRecipe = recipes;
    let userValueInMainSearch = inputMainSearch.value;
    myRecipe.innerHTML = '';
    //si la saisie correspond au titre/ingredient/description retourne et affiche les recettes
    if (userValueInMainSearch.length >= 3) {
        selectionRecipe = listRecipe.filter((element) => {
            if (element.name.toLowerCase().includes(userValueInMainSearch.toLowerCase())) {
                return true;
            }
            if (element.description.toLowerCase().includes(userValueInMainSearch.toLowerCase())) {
                return true;
            }
            let selectionByIngredient = element.ingredients.filter((el) => {
                if (el.ingredient.toLowerCase().includes(userValueInMainSearch.toLowerCase())) {
                    return true;
                }
            })
            if (selectionByIngredient.length > 0) {
                return true;
            }
        });
        appelCreateHtmlRecette(selectionRecipe);
        //Ne laisser dansles dropdown que les data(ingredient & appareil & ustensile) correspond a ceux des recettes
        recupDataForDropdown(selectionRecipe);
    }
    if (selectionRecipe == '') {
        inputMainSearch.value = '';
        inputMainSearch.placeholder = `Aucune recette ne correspond à votre critère… vous pouvez chercher «tarte aux pommes», «poisson» etc.`;
    }
}

//---------------------- TRI DE NAVIGATION : LES 3 IMPUTS --------------------------
//Gestionnaire d'evenement sur les input de navigation
//1:Tri par ingrédients
inputIngredients.addEventListener('change', recupValues);
//Methode pour trier par ingrédients aprés que l utilisateur est saisie retourne les recette filtrées
function filterByIngredient(recipe, valueIngredient) {
    let goodRecipeIngredient = recipe.filter((element) => {
        for (let i = 0; i < element.ingredients.length; i++) {
            if (element.ingredients[i].ingredient.toLowerCase().includes(valueIngredient.toLowerCase())) {
                return true;
            }
        }
    })
    return goodRecipeIngredient;
}

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
                return true;
            }
        }
    })
    return goodRecipeUstensil;
}

//---------- Deuxieme algo de tri faire fonctionner les input tous ensemble
//recuperer dans la meme variable la liste complete des recette trié a chaque saisi dans un input
function recupValues() {
    let filteredRecipe = recipes;
    if (inputIngredients.value !== null) {
        filteredRecipe = filterByIngredient(filteredRecipe, inputIngredients.value);
    }
    if (inputAppareils.value !== null) {
        filteredRecipe = filterByAppareil(filteredRecipe, inputAppareils.value);
    }
    if (inputUstenciles.value !== null) {
        filteredRecipe = filterByUstensile(filteredRecipe, inputUstenciles.value);
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
    for (let i = 0; i < recipes.length; i++) {
        for (let j = 0; j < recipes[i].ingredients.length; j++) {
            arrayIngredientForDatalist.push(recipes[i].ingredients[j].ingredient);
        }
    }
    arrayIngredientForDatalist.sort();
    arrayIngredientForDatalistSansDoublons = Array.from(new Set(arrayIngredientForDatalist));
    for (let i = 0; i < arrayIngredientForDatalistSansDoublons.length; i++) {
        let option = document.createElement('li');
        option.innerHTML = arrayIngredientForDatalistSansDoublons[i];
        option.classList.add('liIngredient');
        option.setAttribute('data-ingredient', arrayIngredientForDatalistSansDoublons[i]);
        dataListIngredient.classList.remove('listElementIngredData');
        dataListIngredient.appendChild(option);
    }
    createListenerIngredientInDropdown();
}
addListIngredientDataInDropdown(recipes);

//2.1.2:l'element arrow ouvrir et ferme (si l utilisateur ne veux pas saisir un ingredient) la dropdown avec un gestionnaire d' evenement 'click'
dropdownIngredientClick.addEventListener('click', function() {
    if (this.className == 'arrowI') {
        this.classList.remove('arrowI');
        openingDropdownIngredient();
    } else {
        this.classList.add('arrowI');
        closingDropdownIngredient();
    }
})

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
            dropdownIngredientClick.classList.add('arrowI');
            closingDropdownIngredient();
            let myChips = new Chips(INGREDIENT, liIngredient[i].dataset.ingredient);
            arrayChips.push(myChips);
            createHtmlChips(myChips);
            inputIngredients.value = '';
        })
    }
}

//------- Searchable dropdown: APPAREIL ---------------------------
//2.2.1:liste des ingredients sans doublons a mettre dans la dropdown
function addListAppareilDataInDropdown() {
    dataListAppareil.innerHTML = '';

    for (let i = 0; i < recipes.length; i++) {
        arrayAppareiltForDatalist.push(recipes[i].appliance);
    }
    arrayAppareiltForDatalist.sort();
    arrayAppareiltForDatalistSansDoublons = Array.from(new Set(arrayAppareiltForDatalist));
    for (let i = 0; i < arrayAppareiltForDatalistSansDoublons.length; i++) {
        let option = document.createElement('li');
        option.innerHTML = arrayAppareiltForDatalistSansDoublons[i];
        option.classList.add('liAppareil');
        option.setAttribute('data-appareil', arrayAppareiltForDatalistSansDoublons[i]);
        dataListAppareil.appendChild(option);
    }
    createListenerAppareilInDropdown();
}

addListAppareilDataInDropdown();

//2.2.2:l'element arrow ouvrir et ferme (si l utilisateur ne veux pas saisir un ingredient) la dropdown avec un gestionnaire d' evenement 'click'
dropdownAppareilClick.addEventListener('click', function() {
    if (this.className == 'arrowA') {
        this.classList.remove('arrowA');
        dataListAppareil.style.display = 'block';
        dropdownAppareil.classList.add('arrowClick');
    } else {
        this.classList.add('arrowA');
        dataListAppareil.style.display = 'none';
        dropdownAppareil.classList.remove('arrowClick');
    }
})

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
        })
    }
}

//------- Searchable dropdown: USTENSILES ---------------------------
//2.3.1:liste des ustensiles sans doublons a mettre dans la dropdown
function addListUstencilDataInDropdown() {
    dataListUstensil.innerHTML = '';

    for (let i = 0; i < recipes.length; i++) {
        for (let j = 0; j < recipes[i].ustensils.length; j++) {
            arrayUstensiltForDatalist.push(recipes[i].ustensils[j]);
        }
    }
    arrayUstensiltForDatalist.sort();
    arrayUstensiltForDatalistSansDoublons = Array.from(new Set(arrayUstensiltForDatalist));
    for (let i = 0; i < arrayUstensiltForDatalistSansDoublons.length; i++) {
        let option = document.createElement('li');
        option.innerHTML = arrayUstensiltForDatalistSansDoublons[i];
        option.classList.add('liUstensil');
        option.setAttribute('data-ustensil', arrayUstensiltForDatalistSansDoublons[i]);
        dataListUstensil.appendChild(option);
    }
    createListenerUstensilInDropdown();
}

addListUstencilDataInDropdown();

//2.3.2:l'element arrow ouvrir et ferme (si l utilisateur ne veux pas saisir un ustensile) la dropdown avec un gestionnaire d' evenement 'click'
dropdownUstensilClick.addEventListener('click', function() {
    if (this.className == 'arrowU') {
        this.classList.remove('arrowU');
        dataListUstensil.style.display = 'block';
        containerUstensils.style.width = "100%";
        dropdownUstensil.classList.add('arrowClick');
        dataListUstensil.classList.remove('listElementUstensdData')
    } else {
        this.classList.add('arrowU');
        dataListUstensil.style.display = 'none';
        containerUstensils.style.width = '170px';
        dropdownUstensil.classList.remove('arrowClick');
    }
})

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
        })
    }
}

//Méthode pour créer les chips en html
function createHtmlChips(chips) {
    divChips = document.createElement('div');
    divChips.classList.add('boxChips');
    divChips.setAttribute('data-selectionIngredient', chips.myValue);
    divChips.innerHTML = chips.createHtml();
    selectionChips.classList.remove('displayNone');
    selectionChips.classList.add('displayFlex');
    selectionChips.appendChild(divChips);
    closeChipsByListener(divChips, chips);
    sortRecipeChips(recipes);
}

//Methode pour fermer les chips
function closeChipsByListener(node, myChips) {
    let closeChip = node.querySelector('.closeChips');
    closeChip.addEventListener('click', function() {
        node.style.display = 'none';
        closeArrayChips(myChips);
    })
}

//Trier les recette(complete) avec chaque chips selectionné ou retirer
//et a chaque ajout ou supp recommencer
//Recuperer le tableau global qui contient tous les chips de tous les types 
//et avec la croix close les supprimer du tableau
function closeArrayChips(myChips) {
    for (let i = 0; i < arrayChips.length; i++) {
        if (arrayChips[i].myValue === myChips.myValue) {
            findIndex = i;
            arrayChips.splice(findIndex, 1);
            sortRecipeChips(recipes);
        }
    }
}

function sortRecipeChips(recipes) {
    myRecipe.innerHTML = '';
    let filteredRecipeByChips = recipes;
    for (let i = 0; i < arrayChips.length; i++) {
        if (arrayChips[i].type === 'INGREDIENT') {
            filteredRecipeByChips = filterByIngredient(filteredRecipeByChips, arrayChips[i].myValue);
        }
        if (arrayChips[i].type === 'APPAREIL') {
            filteredRecipeByChips = filterByAppareil(filteredRecipeByChips, arrayChips[i].myValue);
        }
        if (arrayChips[i].type === 'USTENSIL') {
            filteredRecipeByChips = filterByUstensile(filteredRecipeByChips, arrayChips[i].myValue);
        }
    };
    appelCreateHtmlRecette(filteredRecipeByChips);
    //Methode pour recuperer les data de chaque dropdown avec les recettes actualisés
    recupDataForDropdown(filteredRecipeByChips);
    if (filteredRecipeByChips.length >= 50) {
        inputMainSearch.value = '';
    }
}

//---------------------- TRI AVEC SAISIE >= 3 CARACTERES DANS LES INPUTS -----------------------------
//1:Methode pour afficher les elements de la liste d'ingredients qui correspondent aux 3 lettres saisie par l utilisateur dans l input
//Mehode pour afficher les propositions apres la saisi de 3 caracteres 

function showSuggestionIngredientInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        data = `<li class='liIngredient' data-ingredient='${data}'>${data}</li>`;
        return data;
    });
    dataListIngredient.innerHTML = listData;
    dataListIngredient.classList.add('listElementIngredData');
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
        showSuggestionIngredientInDropdown(emptyArrayForInputIngredient);
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
        closingDropdownIngredient();
        alert("Cet ingrédient n'est pas présent dans nos recettes, essayez à nouveau!");
    }
}

//2:Methode pour afficher les elements de la liste d'appareil qui correspondent aux 3 lettres saisie par l utilisateur dans l input
//EventListener qui permet d 'afficher les choix possible lorsque l utilisateur a saisit 3 lettres(evite d'appuyer sur entrée)
inputAppareils.addEventListener('keyup', sortByValueAppareil);

function showSuggestionAppareilInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        data = `<li class='liAppareil' data-appareil='${data}'>${data}</li>`;
        return data;
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
        showSuggestionAppareilInDropdown(emptyArrayForInputAppareil);
        createListenerAppareilInDropdown();
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
        alert("Cet appareil n'est pas présent dans nos recettes, essayez à nouveau!");
    }
}

//3:Methode pour afficher les elements de la liste d' ustencil'qui correspondent aux 3 lettres saisie par l utilisateur dans l input
//EventListener qui permet d 'afficher les choix possible lorsque l utilisateur a saisit 3 lettres(evite d'appuyer sur entrée)
inputUstenciles.addEventListener('keyup', sortByValueUstencil);

function showSuggestionUstencilInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        data = `<li class='liUstensil' data-ustensil='${data}'>${data}</li>`;
        return data;
    });
    dataListUstensil.innerHTML = listData;
    dataListUstensil.classList.add('listElementUstensdData');
}

function sortByValueUstencil(e) {
    let userValueUstencil = e.target.value;
    let listUstencilForValueUser = arrayUstensiltForDatalistSansDoublons;
    let emptyArrayForInputUstencil = [];
    if (userValueUstencil.length >= 3) {
        containerUstensils.style.width = '100%';
        emptyArrayForInputUstencil = listUstencilForValueUser.filter((data) => {
            return data.toLowerCase().includes(userValueUstencil.toLowerCase());
        });
        if (emptyArrayForInputUstencil != '') {
            showSuggestionUstencilInDropdown(emptyArrayForInputUstencil);
            createListenerUstensilInDropdown();
            dataListUstensil.style.display = 'block';
            dropdownUstensil.classList.add('arrowClick');
        } else {
            //console.log('lose')
            inputUstenciles.value = '';
            dropdownUstensil.classList.remove('arrowClick');
            alert("Cet ustensile n'est pas présent dans nos recettes, essayez à nouveau!");
        }
    } else if (userValueUstencil.length < 3) {
        dataListUstensil.innerHTML = ' ';
        containerUstensils.style.width = '170px';
        dropdownUstensil.classList.remove('arrowClick');
        dataListUstensil.classList.remove('listElementUstensdData');
    }
}

//Methode pour recupere les ingredients/appareil/ustensiles pour les placer 
//dans les dropdown associés elon les recettes qui actualisées
function recupDataForDropdown(theRecipes) {
    dataListAppareil.innerHTML = '';
    dataListUstensil.innerHTML = '';
    dataListIngredient.innerHTML = '';
    ingredientInSelectionRecipe = [];
    appareilInSelectionRecipe = [];
    ustensilInSelectionRecipe = [];
    for (let i = 0; i < theRecipes.length; i++) {
        //ingredients
        for (let j = 0; j < theRecipes[i].ingredients.length; j++) {
            ingredientInSelectionRecipe.push(theRecipes[i].ingredients[j].ingredient);
            ingredientInSelectionRecipe.sort();
        }
        //appareils
        appareilInSelectionRecipe.push(theRecipes[i].appliance);
        appareilInSelectionRecipe.sort();
        //ustensils
        for (let h = 0; h < theRecipes[i].ustensils.length; h++) {
            ustensilInSelectionRecipe.push(theRecipes[i].ustensils[h]);
            ustensilInSelectionRecipe.sort();
        }
    };
    //trier par ordre alphabetique puis mettre tous les element dans un tableaux sans les doublons
    //ingredients
    ingredientInSelectionRecipeNoDuplicate = Array.from(new Set(ingredientInSelectionRecipe));
    //appareil
    appareilInSelectionRecipeNoDuplicate = Array.from(new Set(appareilInSelectionRecipe));
    //ustensils
    ustensilInSelectionRecipeNoDuplicate = Array.from(new Set(ustensilInSelectionRecipe));
    //placer chaque data dans sa dropdown d' origine
    //ingredients
    for (let i = 0; i < ingredientInSelectionRecipeNoDuplicate.length; i++) {
        let option = document.createElement('li');
        option.innerHTML = ingredientInSelectionRecipeNoDuplicate[i];
        option.classList.add('liIngredient');
        option.setAttribute('data-ingredient', ingredientInSelectionRecipeNoDuplicate[i]);
        dataListIngredient.appendChild(option);
        dataListIngredient.classList.add('listElementIngredData');
    };
    if (ingredientInSelectionRecipeNoDuplicate.length > 70) {
        dataListIngredient.classList.remove('listElementIngredData');
    }
    //appareil
    for (let i = 0; i < appareilInSelectionRecipeNoDuplicate.length; i++) {
        let option = document.createElement('li');
        option.innerHTML = appareilInSelectionRecipeNoDuplicate[i];
        option.classList.add('liAppareil');
        option.setAttribute('data-appareil', appareilInSelectionRecipeNoDuplicate[i]);
        dataListAppareil.appendChild(option);
    };
    //ustensils
    for (let i = 0; i < ustensilInSelectionRecipeNoDuplicate.length; i++) {
        let option = document.createElement('li');
        option.innerHTML = ustensilInSelectionRecipeNoDuplicate[i];
        option.classList.add('liUstensil');
        option.setAttribute('data-ustensil', ustensilInSelectionRecipeNoDuplicate[i]);
        dataListUstensil.appendChild(option);
        dataListUstensil.classList.add('listElementUstensdData');
    }

    createListenerIngredientInDropdown();
    createListenerAppareilInDropdown();
    createListenerUstensilInDropdown();
}