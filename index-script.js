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
const containerUstensils = document.querySelector('.findUstensiles');
const selectionChips = document.getElementById('choice');
const dropdownIngredientClick = document.querySelector('.arrowI');
const dropdownUstensilClick = document.querySelector('.arrowU');
const dropdownAppareilClick = document.querySelector('.arrowA');
const mainSearch = document.getElementById('navSearch');

//Variables globales
let divChips;
let arrayChips = [];
let selectionRecipe = [];
let ingredientInSelectionRecipe = [];
let appareilInSelectionRecipe = [];
let ustensilInSelectionRecipe = [];
let ingredientInSelectionRecipeNoDuplicate = [];
let appareilInSelectionRecipeNoDuplicate = [];
let ustensilInSelectionRecipeNoDuplicate = [];
let filteredRecipeByChips = [];
let newfilteredRecipeByChips = [];

//CONSTANTES
const INGREDIENT = 'INGREDIENT';
const USTENSIL = 'USTENSIL';
const APPAREIL = 'APPAREIL';

//Implementation des recettes
//Recuperartion des mots-clés pour les dropdown des recettes
function appelCreateHtmlRecette(recipes) {
    myRecipe.innerHTML = '';
    recipes.forEach((recipe) => {
        createElementHtml(recipe)
    })
}

function callCreateHtmlAndRecupDataDropdown(recipes) {
    appelCreateHtmlRecette(recipes);
    recupDataForDropdown(recipes);
}
callCreateHtmlAndRecupDataDropdown(recipes);

//fonction qui recuper une liste de recette filtré d' abord par la main bar puis filtré par les chips
function callFunctionForFilterRecipes() {
    showRecipeChips(filterRecipeChips(firstSortRecipeByMainSearch(recipes))); //test de suppression de la variable intermediaire
}

//---------------------- TRI DE NAVIGATION : LA BARRE DE RECHERCHE GENERALE --------------------------
//EventListener sur la barre de recherche principal pour faire le premier tri des recettes 
//correspondantes à l' entree de l' utilisateur
mainSearch.addEventListener('keyup', callFunctionForFilterRecipes);

//EventListener sur la barre de nemu principal pour réafficher le placeholder d 'origine en cas 
//de correspondance infructueuse lors de la saisi utilisateur
inputMainSearch.addEventListener('click', () => {
    inputMainSearch.placeholder = 'Rechercher un ingrédient, appareil, ustensiles ou une recette';
});

//Methode pour rehercher les recettes correspondant à l entree utilisateur dans la barre de recherche
//Correspondance dans le titre, les ingredients, la description
//Afficher uniquement les recettes correspondantes et les elements des dropdown associés
function firstSortRecipeByMainSearch(recipes) {
    let listRecipe = recipes;
    let userValueInMainSearch = inputMainSearch.value;
    myRecipe.innerHTML = '';
    //si la saisie correspond au titre/ingredient/description retourne et affiche les recettes
    if (userValueInMainSearch.length >= 3 && selectionRecipe !== '') {
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
        callCreateHtmlAndRecupDataDropdown(selectionRecipe);
    }
    if (selectionRecipe == '' && userValueInMainSearch.length > 3) {
        inputMainSearch.value = '';
        inputMainSearch.placeholder = `Aucune recette ne correspond à votre critère… vous pouvez chercher «tarte aux pommes», «poisson» etc.`;
        selectionRecipe = recipes;
    }
    if (selectionRecipe !== '' && arrayChips.length > 0) {
        inputMainSearch.placeholder = `Rechercher un ingrédient, appareil, ustensiles ou une recette`;
    }
    if (userValueInMainSearch.length === 0) {
        selectionRecipe = [];
        callCreateHtmlAndRecupDataDropdown(recipes);
    }
    return selectionRecipe
}

//---------------------- TRI DE NAVIGATION : LES 3 IMPUTS --------------------------
//1 -- recuperer dans la meme variable la liste complete des recette trié a chaque saisi dans un input
//Methodes pour récuperer la list des recettes filtrés aprés que l utilisateur est effectué une saisie et retourne ces recettes filtrées
//--  par ingrédients --
function filterByIngredient(recipe, valueIngredient) {
    let goodRecipeIngredient = recipe.filter((element) => {
        let goodReicpeByIngredient = element.ingredients.filter((el) => {
            if (el.ingredient.toLowerCase() === valueIngredient.toLowerCase()) {
                return true;
            }
        })
        if (goodReicpeByIngredient.length > 0) {
            return true;
        }
    })
    return goodRecipeIngredient;
}

//-- par appareils --
function filterByAppareil(recipe, valueAppareil) {
    let goodRecipeAppareil = recipe.filter(element => {
        if (element.appliance.toLowerCase() === valueAppareil.toLowerCase()) {
            return true;
        }
    })
    return goodRecipeAppareil;
}

//-- par ustensiles --
function filterByUstensile(recipe, valueUstensil) {
    let goodRecipeUstensil = recipe.filter((element) => {
        let goodReicpeByUstensil = element.ustensils.filter((ustensil) => {
            if (ustensil.toLowerCase() === valueUstensil.toLowerCase()) {
                return true;
            }
        })
        if (goodReicpeByUstensil.length > 0) {
            return true;
        }
    })
    return goodRecipeUstensil;
}

//2 -- Méthode pour récuperer tous les mots-clés associés à chaque intitulé des 3 dropdown et les y placer 
function recupDataForDropdown(pRecipes) {
    dataListAppareil.innerHTML = '';
    dataListUstensil.innerHTML = '';
    dataListIngredient.innerHTML = '';
    ingredientInSelectionRecipe = [];
    appareilInSelectionRecipe = [];
    ustensilInSelectionRecipe = [];
    pRecipes.forEach((data) => {
        //ingredients
        data.ingredients.forEach((ing) => {
                ingredientInSelectionRecipe.push(ing.ingredient);
                ingredientInSelectionRecipe.sort();
                ingredientInSelectionRecipeNoDuplicate = Array.from(new Set(ingredientInSelectionRecipe));
            })
            //appareils
        appareilInSelectionRecipe.push(data.appliance);
        appareilInSelectionRecipe.sort();
        appareilInSelectionRecipeNoDuplicate = Array.from(new Set(appareilInSelectionRecipe));
        //ustensils
        data.ustensils.forEach((dat) => {
            ustensilInSelectionRecipe.push(dat);
            ustensilInSelectionRecipe.sort();
            ustensilInSelectionRecipeNoDuplicate = Array.from(new Set(ustensilInSelectionRecipe));
        })
    });
    //placer chaque data dans sa dropdown d' origine
    //ingredients
    ingredientInSelectionRecipeNoDuplicate.forEach((liIngredient) => {
        let option = document.createElement('li');
        option.innerHTML = liIngredient;
        option.classList.add('liIngredient');
        option.setAttribute('data-ingredient', liIngredient);
        dataListIngredient.appendChild(option);
        dataListIngredient.classList.add('listElementIngredData');
    });
    if (ingredientInSelectionRecipeNoDuplicate.length > 70) {
        dataListIngredient.classList.remove('listElementIngredData');
    }
    //appareil
    appareilInSelectionRecipeNoDuplicate.forEach((liAppareil) => {
        let option = document.createElement('li');
        option.innerHTML = liAppareil;
        option.classList.add('liAppareil');
        option.setAttribute('data-appareil', liAppareil);
        dataListAppareil.appendChild(option);
    });
    //ustensils
    ustensilInSelectionRecipeNoDuplicate.forEach((liUstensil) => {
        let option = document.createElement('li');
        option.innerHTML = liUstensil;
        option.classList.add('liUstensil');
        option.setAttribute('data-ustensil', liUstensil);
        dataListUstensil.appendChild(option);
        dataListUstensil.classList.add('listElementUstensdData');
    });
    if (ustensilInSelectionRecipeNoDuplicate.length > 16) {
        dataListUstensil.classList.remove('listElementUstensdData');
    }
    //placer sur chaque éléments/data un eventListener pour effctuer un tri des recettes selon la sélection
    createListenerIngredientInDropdown();
    createListenerAppareilInDropdown();
    createListenerUstensilInDropdown();
}
//Les fleches des dropdown affiche au click la list des elements/mots-clés qu elle contient
//L'element arrow ouvrir et ferme (si l utilisateur ne veux pas saisir un ingredient) la dropdown avec un gestionnaire d' evenement 'click'
//-- Arrow Ingredient --
dropdownIngredientClick.addEventListener('click', function() {
        if (this.className == 'arrowI') {
            this.classList.remove('arrowI');
            openingDropdownIngredient();
        } else {
            this.classList.add('arrowI');
            closingDropdownIngredient();
        }
    })
    //methode d' ouverture
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
//-- Arrow appareil --
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
    //-- Arrow ustensils --
dropdownUstensilClick.addEventListener('click', function() {
    if (this.className == 'arrowU') {
        this.classList.remove('arrowU')
        dataListUstensil.style.display = 'block';
        containerUstensils.style.width = "100%";
        dropdownUstensil.classList.add('arrowClick');
    } else {
        this.classList.add('arrowU')
        dataListUstensil.style.display = 'none';
        containerUstensils.style.width = '170px';
        dropdownUstensil.classList.remove('arrowClick');
    }
});

//3 -- Méthode pour placer des gestionnaires d'évenements sur chaque mots-clés contenus dans les 3 dropdown
//Ajout de la méthode de création en html des elements chips lors du clics sur un ou plusieurs des éléments
//-- Listener ingrédient --
function createListenerIngredientInDropdown() {
    let liIngredient = document.querySelectorAll('.liIngredient');
    liIngredient.forEach((liIng) => {
        liIng.addEventListener('click', function() {
            dropdownIngredientClick.classList.add('arrowI');
            closingDropdownIngredient();
            let myChips = new Chips(INGREDIENT, liIng.dataset.ingredient);
            arrayChips.push(myChips);
            createHtmlChips(myChips);
            inputIngredients.value = '';
        })
    })
}
//-- Listener appareil -- 
function createListenerAppareilInDropdown() {
    let liAppareil = document.querySelectorAll('.liAppareil');
    liAppareil.forEach((liApp) => {
        liApp.addEventListener('click', function() {
            dataListAppareil.style.display = 'none';
            dropdownAppareil.classList.remove('arrowClick');
            let myChips = new Chips(APPAREIL, liApp.dataset.appareil);
            arrayChips.push(myChips);
            createHtmlChips(myChips);
            inputAppareils.value = '';
        })
    })
}
//-- Listener ustensil --
function createListenerUstensilInDropdown() {
    let liUstensil = document.querySelectorAll('.liUstensil');
    liUstensil.forEach((liUst) => {
        liUst.addEventListener('click', function() {
            dataListUstensil.style.display = 'none';
            dropdownUstensil.classList.remove('arrowClick');
            let myChips = new Chips(USTENSIL, liUst.dataset.ustensil);
            arrayChips.push(myChips);
            createHtmlChips(myChips);
            containerUstensils.style.width = "170px";
            inputUstenciles.value = '';
        })
    })
}

//4 -- Création des éléments chips/tag qui se placera à la selection par l' utilisateur en dessous de la barre de recherche principale
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
    callFunctionForFilterRecipes();
}
//Methode de fermeture des chips au clics sur l' element X
function closeChipsByListener(node, myChips) {
    let closeChip = node.querySelector('.closeChips');
    closeChip.addEventListener('click', function() {
        node.style.display = 'none';
        closeArrayChips(myChips);
    })
}

//Trier les recettes(completes ou actualisées) avec chaque chips selectionné ou supprimer
//Recuperer le tableau global qui contient tous les chips de tous les types 
function closeArrayChips(myChips) {
    arrayChips.forEach((chips) => {
        if (chips.myValue === myChips.myValue) {
            let indexOf = arrayChips.indexOf(myChips);
            arrayChips.splice(indexOf, 1);
            callFunctionForFilterRecipes();
        }
    })
    if (arrayChips == '') {
        inputMainSearch.value = '';
        inputMainSearch.placeholder = '';
        inputMainSearch.placeholder = 'Rechercher un ingrédient, appareil, ustensiles ou une recette';
        selectionRecipe = [];
        callCreateHtmlAndRecupDataDropdown(recipes);
    }
}

//Methode pour trier les recettes selon la valeur du chips selectionné
function filterRecipeChips(customRecipes) {
    //si parametre est vide utiliser les recettes completes sinon utiliser le parametre
    if (customRecipes == '') {
        filteredRecipeByChips = recipes;
    } else {
        filteredRecipeByChips = customRecipes
    }
    //filteredRecipeByChips = customRecipes ? customRecipes : recipes; //si parametre pas null => l'utiliser ; sinon prendre toute les recettes
    arrayChips.forEach((theChips) => {
        if (theChips.type === 'INGREDIENT') {
            filteredRecipeByChips = filterByIngredient(filteredRecipeByChips, theChips.myValue);
        }
        if (theChips.type === 'APPAREIL') {
            filteredRecipeByChips = filterByAppareil(filteredRecipeByChips, theChips.myValue);
        }
        if (theChips.type === 'USTENSIL') {
            filteredRecipeByChips = filterByUstensile(filteredRecipeByChips, theChips.myValue);
        }
    });
    return filteredRecipeByChips
}

//Methode pour afficher les recettes et les elements actualisés dans les dropdown apres le tri
function showRecipeChips(customRecipes) {
    //si parametre est vide utiliser les recettes completes sinon utiliser le parametre 
    if (customRecipes == '') {
        newfilteredRecipeByChips = recipes;
    } else {
        newfilteredRecipeByChips = customRecipes
    }
    myRecipe.innerHTML = '';
    appelCreateHtmlRecette(newfilteredRecipeByChips);
    //Methode pour recuperer les data de chaque dropdown avec les recettes actualisés
    recupDataForDropdown(newfilteredRecipeByChips);
}

//---------------------- TRI AVEC SAISIE >= 3 CARACTERES DANS LES INPUTS -----------------------------
//1-- Gestionnaire d'évenement sur les inputs des 3 dropdown
inputIngredients.addEventListener("keyup", sortByValueIngredient);
inputAppareils.addEventListener('keyup', sortByValueAppareil);
inputUstenciles.addEventListener('keyup', sortByValueUstencil);

//2 --Mehode qui apres la saisi de 3 caracteres va actualiser les recettes et les elements dans les dropdown
//-- ingredient --
function sortByValueIngredient(inputIngredients) {
    let userValueIngredient = inputIngredients.target.value;
    //filter la liste des recettes compléte si main search est vide ou infrcutueuse
    let filteredRecipe = [];
    if (inputMainSearch.value == '') {
        filteredRecipe = filterRecipeChips(recipes);
        console.log(filteredRecipe)
    } else {
        filteredRecipe = filterRecipeChips(filteredRecipeByChips);
        console.log(filteredRecipe)
    }
    let ingredientAvailable = [];
    filteredRecipe.map(recipe => recipe.ingredients)
        .forEach(ingredients => {
            ingredients.forEach(ingredientObject => ingredientAvailable.push(ingredientObject.ingredient))

        });
    let listIngredientForDataUser = Array.from(new Set(ingredientAvailable));
    listIngredientForDataUser.sort();
    let IngredientValue = [];
    containerIngredients.style.width = '170px';
    if (userValueIngredient.length >= 3 || userValueIngredient.length < 1) {
        IngredientValue = listIngredientForDataUser.filter((data) => {
            return data.toLowerCase().includes(userValueIngredient.toLowerCase());
        });
        showSuggestionIngredientInDropdown(IngredientValue);
        createListenerIngredientInDropdown();
        openingDropdownIngredient();
        dataListIngredient.classList.remove('listElementIngredData');
    }
    if (userValueIngredient.length < 3) {
        dataListIngredient.style.display = 'none';
        containerIngredients.style.width = '170px'
        dropdownIngredient.classList.remove('arrowClick');
    }
    if (IngredientValue.length < 21) {
        dataListIngredient.classList.add('listElementIngredData');
    }
    //condition si une saisie de 3 caracteres ne correspond a aucun ingrédient
    if (userValueIngredient.length >= 3 && IngredientValue == '') {
        dataListIngredient.innerHTML = '';
        recupDataForDropdown(filteredRecipe)
        closingDropdownIngredient();
        alert("Cet ingrédient n'est pas présent dans nos recettes, essayez à nouveau!");
        inputIngredients.target.value = '';
    }
    return filteredRecipe;
}
//-- appareil --
function sortByValueAppareil(inputAppareils) {
    let userValueAppareil = inputAppareils.target.value;
    let filteredRecipe = [];
    if (inputMainSearch.value == '') {
        filteredRecipe = filterRecipeChips(recipes);
    } else {
        filteredRecipe = filterRecipeChips(filteredRecipeByChips);
    }
    let appareilAvailable = [];
    filteredRecipe.map(recipe => recipe.appliance)
        .forEach(appliance => {
            appareilAvailable.push(appliance)
        });
    let listAppareilForValueUser = Array.from(new Set(appareilAvailable));
    listAppareilForValueUser.sort();
    let appareilValue = [];
    if (userValueAppareil.length >= 3 || userValueAppareil.length < 1) {
        appareilValue = listAppareilForValueUser.filter((data) => {
            return data.toLowerCase().includes(userValueAppareil.toLowerCase());
        });
        showSuggestionAppareilInDropdown(appareilValue);
        createListenerAppareilInDropdown();
        dataListAppareil.style.display = 'block';
        dropdownAppareil.classList.add('arrowClick');
    }
    if (userValueAppareil.length < 3) {
        dataListAppareil.style.display = 'none';
        dropdownAppareil.classList.remove('arrowClick');
    }
    //condition si une saisie ne correspond a aucun appareil
    if (userValueAppareil.length >= 3 && appareilValue == '') {
        dataListAppareil.innerHTML = '';
        recupDataForDropdown(filteredRecipe)
        dataListAppareil.style.display = 'none';
        dropdownAppareil.classList.remove('arrowClick');
        alert("Cet appareil n'est pas présent dans nos recettes, essayez à nouveau!");
        inputAppareils.target.value = '';
    }
    return filteredRecipe;
}
//-- ustensils --
function sortByValueUstencil(inputUstenciles) {
    let userValueUstencil = inputUstenciles.target.value;
    let filteredRecipe = [];
    if (inputMainSearch.value == '') {
        filteredRecipe = filterRecipeChips(recipes);
    } else {
        filteredRecipe = filterRecipeChips(filteredRecipeByChips);
    }
    let ustencilesAvailable = [];
    filteredRecipe.map(recipe => recipe.ustensils)
        .forEach(ustensils => {
            ustensils.forEach(ustensilsObject => ustencilesAvailable.push(ustensilsObject))

        });
    let listUstensilsForDataUser = Array.from(new Set(ustencilesAvailable));
    listUstensilsForDataUser.sort();
    let ustensilValue = [];
    containerUstensils.style.width = '100%';
    if (userValueUstencil.length >= 3 || userValueUstencil.length < 1) {
        ustensilValue = listUstensilsForDataUser.filter((data) => {
            return data.toLowerCase().includes(userValueUstencil.toLowerCase());
        });
        showSuggestionUstencilInDropdown(ustensilValue);
        createListenerUstensilInDropdown();
        dataListUstensil.style.display = 'block';
        dropdownUstensil.classList.add('arrowClick');
        dataListUstensil.classList.remove('listElementUstensdData');
    }
    if (userValueUstencil.length < 3) {
        dataListUstensil.style.display = 'none'
        containerUstensils.style.width = '170px';
        dropdownUstensil.classList.remove('arrowClick');
    }
    if (ustensilValue.length < 16) {
        dataListUstensil.classList.add('listElementUstensdData');
    }
    //condition si une saisie ne correspond a aucun appareil
    if (userValueUstencil.length >= 3 && ustensilValue == '') {
        dataListUstensil.innerHTML = ' ';
        recupDataForDropdown(filteredRecipe);
        dataListUstensil.style.display = '';
        containerUstensils.style.width = '170px';
        dropdownUstensil.classList.remove('arrowClick');
        alert("Cet ustensile n'est pas présent dans nos recettes, essayez à nouveau!");
        inputUstenciles.target.value = '';
    }
    return filteredRecipe;
}

//3 --Methode pour afficher les elements de la liste d'ingredients qui correspondent aux 3 lettres saisie par l utilisateur dans l input
//-- ingredient --
function showSuggestionIngredientInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        data = `<li class='liIngredient' data-ingredient='${data}'>${data}</li>`;
        return data;
    });
    let sansVirguleListData = listData.join(" ");
    dataListIngredient.innerHTML = sansVirguleListData;
}
//-- appareil --
function showSuggestionAppareilInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        data = `<li class='liAppareil' data-appareil='${data}'>${data}</li>`;
        return data;
    });
    let sansVirguleListData = listData.join(" ");
    dataListAppareil.innerHTML = sansVirguleListData;
}
//-- ustensils --
function showSuggestionUstencilInDropdown(list) {
    let listData = list;
    listData = list.map((data) => {
        data = `<li class='liUstensil' data-ustensil='${data}'>${data}</li>`;
        return data;
    });
    let sansVirguleListData = listData.join(" ");
    dataListUstensil.innerHTML = sansVirguleListData;
}