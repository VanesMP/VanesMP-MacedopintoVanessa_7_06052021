export function Chips(type, myValue) {
    this.type = type;
    this.myValue = myValue;

    this.createHtml = function() {
        if (this.type === 'INGREDIENT') {
            return `<div class="chips chipsIngredient"><p class="textChip">${this.myValue}</p><button class="closeChips closeChipsIng"></button></div>`;
        } else if (this.type === 'APPAREIL') {
            return `<div class="chips chipsAppareil"><p class="textChip">${this.myValue}</p><div class="closeChips closeChipsApp"></div></div>`;
        } else if (this.type === 'USTENSIL') {
            return `<div class="chips chipsUstensile"><p class="textChip">${this.myValue}</p><div class="closeChips closeChipsUst"></div></div>`;
        }
    }
}