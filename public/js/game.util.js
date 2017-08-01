/**
 * Created by dat on 20/09/2016.
 */

/**
 *
 * @param array
 * @returns {Array}
 */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}


Array.prototype.shuffle = function() {
    var copy = [],
        n = this.length,
        i;

    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math
            .floor(Math.random() * this.length);

        // If not already shuffled, move it to the new array.
        if (i in this) {
            copy
                .push(this[i]);
            delete this[i];
            n--;
        }
    }
    return copy;
};
/**
 *
 * @param id
 * @returns {Element}
 * @constructor
 */
var HTMLObject = function (id) {
    return document.getElementById(id);
};
/**
 *
 * @param _class
 * @returns {NodeList}
 * @constructor
 */
var HTMLObjects = function (_class) {
    return document.getElementsByClassName(_class);
};
/**
 *
 * @param HTMLObject
 */
var removeAllChildHTMLObject = function (HTMLObject) {
    while(HTMLObject.firstChild){
        HTMLObject.removeChild(HTMLObject.firstChild);
    }
};
