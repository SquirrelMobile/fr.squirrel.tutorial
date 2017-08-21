// args : arguments du widget
var args = arguments[0] || {};
// tabPage : contient le tableau de pages
var tabPage = [];
// indicatorsObj : contient le tableau d'indicateur de pages
var indicatorsObj = null;
var exit = false;
// valeur par défaut des indicateurs de pages dans l'état 'select' et 'unselect'
var defaultIndicatorSelect = {image :  "/images/fr.squirrel.tutorial/active.png", width : 7 , height: 7 };
var defaultIndicatorUnselect = {image :"/images/fr.squirrel.tutorial/inactive.png", width : 7 , height: 7};



/**
 * setPages - création du tutorial avec x pages grâce à l'argument obj qui est un tableau
 *
 * @param  {type} obj tableau d'objets avec, pour chaque objet, 4 propriétés possibles :
 * - imageProperties : "photo de la page en background"
 * - title : "titre de la page"
 * - subtitle : "description de la page"
 * - logo : "logo de la page"
 */
$.setPages = function(obj){
  // on nettoie la scrollableView
  $.scrollableView.removeAllChildren();

    // Si le parametre contient un tableau > 0
  if (obj.length > 0) {
    _.each(obj,function(page){
      var view = Widget.createController("page",page.page).getView();

      // On ajoute la page sur la scrollableView
      $.scrollableView.addView(view);

      // S'il ya une propriété 'logo'
      if (page.logo) {
        // On ajoute les paramètres du logo à la page
        $.logo.applyProperties(page.logo);
      }
    });

    tabPage = obj;
    //On ouvre la window du tutorial
    $.content.open();

    // si les propriété "indicatorSelect" et "indicatorUnselect" sont présent alors on ajoute les paramétres de l'indicators grâce à la fonction setIndicators
    if (args.indicatorSelect && args.indicatorUnselect) {
      setIndicators(args);
    } //sinon on mets les valeurs par défaut
    else {
      setIndicators({indicatorSelect : defaultIndicatorSelect , indicatorUnselect : defaultIndicatorUnselect});
    }
    // on affiche la page courante c-a-d la page 0
    changePage({currentPage : 0,currentPageAsFloat : 0});
  }

};



/**
 * setIndicators - Construit chaque indicateur de page
 *
 * @param  {type} obj doit contenir les propriétés "indicatorSelect" et "indicatorUnselect"
 */
function setIndicators(obj){
  indicatorsObj = obj;
  // on nettoie la vue indicators
  $.indicators.removeAllChildren();
  var i = 0;
  // on construit chaque indicateur de page dans la boucle
  _.each(tabPage,function(page){
    var objDefault = {
        id : "indic"+i,
        left : i === 0 ? 0 : 10,
        width : 7,
        height : 7
      };
      if (i === 0 ) {
        // valeur du premier élément
        var img = $.UI.create("ImageView",_.extend(objDefault,_.omit(obj.indicatorSelect,["id","left"])));
        // on ajoute les indicateurs de page à la vue parent
        $.indicators.add(img);
      }
      else {
        // valeur des autres éléments
        var img2 = $.UI.create("ImageView",_.extend(objDefault,_.omit(obj.indicatorUnselect,["id","left"])));
        // on ajoute les indicateurs de page à la vue parent
        $.indicators.add(img2);
      }
      i++;
  });

}


/**
 * close - ferme le tutorial
 *
 */
$.close = function(){
  $.content.close();
};


/**
 * changePage - Evénement du scroll horizontal de la scrollableView
 *
 * @param  {type} e valeur du scroll event de la scrollableView
 */
function changePage(e){
  var id = "indic"+ e.currentPage;
  // on reconstruit chaque indicateurs
  _.each($.indicators.getChildren(),function(indic){
    // Si indicateur de la page courante
    if (indic.id === "indic"+ e.currentPage) {
      if (indicatorsObj) {
        // on applique les données indicatorSelect
        indic.applyProperties(indicatorsObj.indicatorSelect);
      }
    }
    else {
      if (indicatorsObj) {
        // on applique les données indicatorUnselect
        indic.applyProperties(indicatorsObj.indicatorUnselect);
      }
    }
  });

  var lastPage = tabPage.length-1;
  // si la page courante est la derniere page
  if (e.currentPage == lastPage) {
    // on change le titre du bouton et on applique un la propriete exit égale à true
    $.skip.title = args.titleBtnEnd ? args.titleBtnEnd : "close";
    exit = true;
  }
  else {
    // on change le titre du bouton et on applique un la propriete exit égale à false
    $.skip.title = args.titleBtnStart ? args.titleBtnStart : "next";
    exit = false;

  }

  // Algorithme pour le fonctionnement de l'opacité par rapport au scroll
  var valeur = 0.5-(e.currentPageAsFloat-e.currentPage);

  if (valeur > 0 && valeur < 0.5) { // << Entre le debut du scroll et la moitié du scroll
    $.title1.opacity = valeur*2;
    $.subtitle1.opacity = valeur*2;
  }
  else {
    $.title1.opacity = (0.5+(e.currentPageAsFloat-e.currentPage))*2;
    $.subtitle1.opacity = (0.5+(e.currentPageAsFloat-e.currentPage))*2;
  }


  if (tabPage[e.currentPage]) {

    // si propriéte "logo" est présente on change la valeur du logo et on montre le logo
    if (tabPage[e.currentPage].logo) {
      $.logo.show();
      $.logo.applyProperties(tabPage[e.currentPage].logo);
    }
    else {
      // sinon on cache le logo
      $.logo.hide();
    }

    // si propriété "title" est présente on change la valeur de la vue "title1"
    if (tabPage[e.currentPage].title) {
      $.title1.applyProperties(tabPage[e.currentPage].title);
    }
    else {
      // sinon on enleve les données du texte de la vue title1
      $.title1.text = "";
    }

    // si propriété "subtitle" est présente on change la valeur de la vue "subtitle1"
    if (tabPage[e.currentPage].subtitle) {
      $.subtitle1.applyProperties(tabPage[e.currentPage].subtitle);
    }
    else {
      // sinon on enleve les données du texte de la vue subtitle1
      $.subtitle1.text = "";
    }
  }
}



/**
 * handleClickSkip - fonction pour l'évenement du clic sur le bouton suivant
 *
 * @param  {type} e valeur du click event
 */
function handleClickSkip(e){
  // si la propriété exit égale à true
  if (exit === true) {

    if (args.success) {
      //on active le callback
        args.success();
    }
    else {
      //on quitte le tutorial
      $.content.close();
    }
  }
  else {
    // scroller page suivante
    $.scrollableView.moveNext();
  }
}
