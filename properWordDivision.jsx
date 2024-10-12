//DESCRIPTION: Falsche Worttrennungen finden 

/*     
	+ InDesign Version: CS5.5 und 6
	+ Autor: Roland Dreger
	+ Datum: 17. Juli 2013 

	+ Die Markierung nach Klick auf den Button erfolgt mit bedingtem Text. 
	(InDesign > Fenster > Schrift und Tabellen > Bedingter Text)

	+ Manueller Zeilenumbruch bei der Eingabe der Wörter funktioniert mit den Versionen CS4, CS5 und CS5.5 nicht.
	(Text vorher in einem Texteditor aufbereiten!)
*/

//@targetengine "properSeparation";


var _global = {};

__defLocalizeStrings();


if (app.scriptPreferences.version >= 6) {
  app.doScript(main, ScriptLanguage.JAVASCRIPT , [], UndoModes.ENTIRE_SCRIPT, localize(_global.findWrongDivision));
}else{
  alert(localize(_global.wrongVersion), "Error", true);
  _global = null;
}




function main () {
  app.scriptPreferences.enableRedraw = true;  
  
  if (app.documents.length > 0) {
    var _doc = app.activeDocument;
    var _counter = 0;
    var _selectionCounter = 0; 
    var _alertCounter = 0;
    var _highlightColor = [255,150,0]; // Farbe der Hervorhebung in [R,G,B] 
    var _highlightMethod = ConditionIndicatorMethod.USE_HIGHLIGHT; // "USE_UNDERLINE" fuer Hervorhebung durch Unterstreichung
    
    getInput();
    
  } else {  
    alert (localize(_global.noDocOpened), "Error", true);
    _global = null;
  }


  // Dialog fuer die Eingabe der gesuchten Woerter
  function getInput() {
    
    var _ui = Window.find ("palette", localize(_global.divisionCorrect));  
    if (_ui !== null) {
      _ui.close();
    }    
    
    var _inputUI = Window.find ("palette", localize(_global.findWrongDivision));   
    if (_inputUI === null) {
    
      var _inputUI = new Window ("palette", localize(_global.findWrongDivision));
      with (_inputUI) {
        alignChildren = ["fill", "fill"];
        
        var _headlineGroup = add("group");
        with (_headlineGroup) {
          orientation = "row";
          spacing = 40;
          margins = [0,10,0,0];
          var _headline = add ("statictext");
          with (_headline) {
            text = localize(_global.whatWords);
            alignment = "bottom";
            graphics.font = "dialog:14";
          } // END _headline
          
          var _dicIconGroup = add("group");
          with (_dicIconGroup) {
            margins = [0,0,0,0];
            spacing = 4;
            try {
              var _docIcon = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\t\x00\x00\x00\x0B\b\x06\x00\x00\x00\u00ADY\u00A7\x1B\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00HIDATx\u00DAbtrr\u00FA\u00CF@\x00\u00B0\u0080\u00885k\u00D6\u00E0T\x10\x12\x12\u00C2\u00C0\u00C4@\x04`A\u00D6\u0081\x0E`6\u00B0\u00A0\x0B\u00D0\u00D6$&d\u0093\u00B0\u0099\u0086\u00D7$d\r,\u0084\u00BC\u00BFw\u00EF^FF|!\x0ER\x00\u00A2\x01\x02\f\x00\u00BE'\x1A\x1D\u00C1\u00B7 `\x00\x00\x00\x00IEND\u00AEB`\u0082";
              var _docDic = add ("iconbutton", undefined, _docIcon);
              with (_docDic) {
                size = [13,15];
                alignment = "bottom";
                helpTip = localize(_global.hyphenationExceptions);
              } // end _docDic 
            } catch (e) {
              var _docDic = add ("button", undefined, "D");
              with (_docDic) {
                size = [23,23];
                alignment = "bottom";
                graphics.font = "dialog:11";
                helpTip = localize(_global.hyphenationExceptions);
              } // end _docDic
            } // end try _docDic
            try {
              var _dicIcon = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x0B\b\x06\x00\x00\x00v\u00E2\r9\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\x7FIDATx\u00DAbtrr\u00FA\u00CF\u0080\n\x18\u0081\x18\u009B\x18\b\x04\x00\u00B1=\x10\x17\u00C2$X\x18\u0088\x03\x0B\u0080\u00D8\x1F\u0088\x05\u00A0\u00FC\u0085@|\x01\u00C4`B\u00B2\u0081\x11\u008B\u00AD01\x01$\u00CD \u0090\x00c\u00C0\f\u00F8\u008F\u00C5\u00D9\u00C8b\x1B\u00D0\u00E4\u00FC\u00D1\r \x04@\x06|D\u00E2+\x00\u00B1\x01)\x06|\u00C0\u00E2\u008A\x04R\f\u00C0\u00E9\rR\r\u00C0\u00F0\x06)\x06`sE\x02\u00A5\x06\x18\u00B0\u0090a\u00C0E >\x00M\\\x17\x00\x02\f\x00>\u00F3\x18Q\u008D\u0099\u009C2\x00\x00\x00\x00IEND\u00AEB`\u0082";
              var _userDic = add ("iconbutton", undefined, _dicIcon);
              with (_userDic) {
                size = [20,15];
                alignment = "bottom";
                helpTip = localize(_global.wordsFromDictionary);
              } // end _userDic 
            } catch (e) {
              var _userDic = add ("button", undefined, "W");
              with (_userDic) {
                size = [23,23];
                alignment = "bottom";
                graphics.font = "dialog:11";
                helpTip = localize(_global.wordsFromDictionary);
              } // end _userDic
            } // end try _userDic 
          } // END _dicIconGroup
        } // END _headlineGroup  
        
        var _inputText = add ("edittext", undefined, "", {multiline: true, scrolling: true, wantReturn: true});
        with (_inputText) {
          minimumSize.height = 150;
          active = true;  
        } // END _inputText
      
        var _optionGroup = add("group");
        with (_optionGroup) {
          margins = [0,0,0,0];
          orientation = "row";
          alignment = "left";
          var _wholeWords = add("checkbox", undefined, localize(_global.wholeWord));
          with (_wholeWords) {
            alignment = "left";
            value = false;
            graphics.font = "dialog:9";
            helpTip = localize(_global.wholeWord_HT);
          } // END _wholeWords
          var _caseSensitive = add("checkbox", undefined, localize(_global.caseSensitive));
          with (_caseSensitive) {
            value = false;
            graphics.font = "dialog:9";
            helpTip = localize(_global.caseSensitive_HT);
          } // END _caseSensitive
        } // END _optionGroup    
    
        var _examplePanel = add ("panel");
        with (_examplePanel) {
          text = localize(_global.example);
          alignChildren = "left";
          spacing = 4;
          margins = [15,20,15,15];
          var _example1 = add ("statictext");
          with (_example1) {
            text = localize(_global.firstExample);
            graphics.font = "dialog:11";
          } // END _example1
          var _example2 = add ("statictext");
          with (_example2) {
            text = localize(_global.secoundExample);
            graphics.font = "dialog:11";
          } // END _example2
        } // END _examplePanel
        
        var _buttonGroup = add("group");
        with (_buttonGroup) {
          margins = [0,10,0,0];
          alignment = "right";
          var _cancelInput = add ("button", undefined, localize(_global.cancel));
          var _start = add ("button", undefined, localize(_global.go), {name: "ok"});
        } // END _buttonGroup
      } // END _inputUI
    
      
      // Callbacks +++++++++++++++++++++++++++
      
      _userDic.onClick = function() {
        var _selectedUserDicID = _selectUserDicDialog ();           
        var _selectedUserDicAddedWordsArray = app.userDictionaries[_selectedUserDicID].addedWords; 
        var _selectedUserDicAddedWords = _selectedUserDicAddedWordsArray.join (",");
        _selectedUserDicAddedWords = _selectedUserDicAddedWords.replace(/,/g,"\n");
        _inputText.text = _selectedUserDicAddedWords;
      }
      
      _docDic.onClick = function() {
        var _selectedDocDicID = _selectUserDicDialog ();
        var _selectedDocDicAddedWordsArray = app.activeDocument.hyphenationExceptions[_selectedDocDicID].addedExceptions; 
        var _selectedDocDicAddedWords = _selectedDocDicAddedWordsArray.join (",");
        _selectedDocDicAddedWords = _selectedDocDicAddedWords.replace(/,/g,"\n");
        _inputText.text = _selectedDocDicAddedWords;
      }
      
      _cancelInput.onClick = function() { 
        _inputUI.close(2);
        _global = null;
      }   
      
      _start.onClick = function () { 
        _counter = 0;
        _selectionCounter = 0; 
        _alertCounter = 0;
        var _words = [];
        var _inputTextAndOptions = [];
        var _caseSensitivOption = _caseSensitive.value;
        var _wholeWordOption = _wholeWords.value;
        _inputTextAndOptions = [_inputText.text,_caseSensitivOption,_wholeWordOption];  
        var _pass = false;
        if (_inputTextAndOptions[0] != null && _inputTextAndOptions[0] != "") {     
          _pass = true;
          _words = getWords(_inputTextAndOptions[0]);
          searchWordSeparations (_words,_inputTextAndOptions[1],_inputTextAndOptions[2]);  
        }      
        _inputUI.close(1);
        if (!_pass) _global = null; // Kein Wort im Eingabefeld -> globale Variabel wird auf null gesetzt
      }
      // END Callbacks +++++++++++++++++++++++
    } // END if _inputUI === null
    
    _inputUI.show ()
    
    return  
  } 


  // Dialog zur Auswahl des Benutzerwoerterbuches
  function _selectUserDicDialog () {
  
    var _addedWords = [];
    var _userDicsNames = app.userDictionaries.everyItem().name;
    var _userDics = new Array();  
       
    for (i=0;i<app.userDictionaries.length;i++) {           
      _userDics[app.userDictionaries[i].name] = i;   
    }      
    
    if (app.activeDocument.stories[0].isValid) {
      var _curLanguage = app.activeDocument.stories[0].paragraphs[0].appliedLanguage.name; 
      var _curLanguageID = _userDics[_curLanguage];
      
    } else {
        _curLanguageID = 0;
    } 
    var _selectUserDicWindow = new Window ("dialog", localize(_global.userDictionary));
    with (_selectUserDicWindow) {
      
      var _group = add("group");     
      with (_group) {
        var _selectUserDicDropdown = add ("dropdownlist", undefined, _userDicsNames);
        with (_selectUserDicDropdown) {
          selection = _curLanguageID;
        } // END _selectUserDicDropdown
      
        var _go = add ("button", undefined,"Ok");
      } // END _group
    } // END  _selectUserDicWindow 
    
    _selectUserDicWindow.show ();
    
    var _selectedUserDicID = _userDics[_selectUserDicDropdown.selection.text];
    
    return _selectedUserDicID;
  }


  // Dialog fuer die Anzeige der falschen Trennungen
  function _showDialog (_wrongSeparateWords) {
    
    __defLocalizeStrings();
    
    try {
      var _maxWidth = $.screens[0].right;
      var _x = (_maxWidth/2)-220;
      var _maxHeight = $.screens[0].bottom;
      var _y = (_maxHeight/3)-50;
    } catch (e) {
      var _x = 100;
      var _y = 100;
    }
     
    var _ui = new Window ("palette", localize(_global.divisionCorrect));
    with (_ui) { 
      location = [_x,_y];
      alignChildren = "left";
      orientation = "row";
      margins = [20,20,20,20];
      spacing = 100;
      var _cancel = add ("button", undefined, localize(_global.cancel), {name: "cancel"});
      var _rightGroup = add ("group");
      with (_rightGroup) {
        var _highlight = add ("button", undefined, localize(_global.highlight));
        with (_highlight) {
          graphics.font = "dialog:11";
        }
        var _ok = add ("button", undefined, localize(_global.goon));
      } // END _rightGroup     
    } // END _ui

    // Callbacks ++++++++++++++++++++++++++
    _ok.onClick = function () {
      if (_wrongSeparateWords.length > 1 && _selectionCounter <= _wrongSeparateWords.length) {
        try { 
          showIt(_wrongSeparateWords[_selectionCounter]); 
        } catch (e) { 
          alert (localize(_global.overset), "Error", true); 
        } // showIt: Fehler bei Übersatztext
      }
      _selectionCounter += 1;
      if (_selectionCounter > _wrongSeparateWords.length) { 
        alert (localize(_global.lastResult)); 
        _ui.close(2);
        _global = null;
      }      
    }

    _highlight.onClick = function () {
      
      _doc = app.activeDocument;  
        
      if (app.selection.length > 0 && app.selection[0].hasOwnProperty("baseline")) {
        _doc.layoutWindows[0].screenMode = ScreenModeOptions.previewOff;
        if (!_doc.conditions.itemByName("::Wrong_Word_Division::").isValid)
          _doc.conditions.add ({name: "::Wrong_Word_Division::", indicatorColor: _highlightColor, indicatorMethod: _highlightMethod});   
                
        var _highlightWrongSeparation = _doc.conditions.itemByName ("::Wrong_Word_Division::");   
        app.selection[0].applyConditions([_highlightWrongSeparation]); 
        app.select(NothingEnum.NOTHING);
      }
    }

    _cancel.onClick = function() { 
      _ui.close(3);
      _global = null;
    }
    // END Callbacks ++++++++++++++++++++++
    
  if (_ui.show () == 3)
    return true
  else 
    return false 
  }


  // Fortschrittsbalken
  function progressBar (_progressWindow,stop) {
    with (_progressWindow) {
      alignChildren = ["fill","fill"];
      margins = [10,10,10,5];
      var _wordsPanel = add("panel");
      with (_wordsPanel) {
        alignChildren = "left";
        var _words = add ("statictext");
        with (_words) {
          characters = 50;  
          graphics.font = "dialog:11";
        } // END _words
      }
      var _progressBar = add ("progressbar", undefined, 1, stop);
      with (_progressBar) {
        preferredSize = [340,10];
      } // END _progressPar
    } // END _progressWindow
    _progressWindow.show ();
    return _progressBar;
  }


  // Eingabe filtern und weitergeben
  function getWords(_input) {  
    _input = _input.replace(/ +/g,"");
    _input = _input.replace(/\n+/g,"\n");
    _input = _input.replace(/~+/g,"~");
    _input = _input.split("\n");   
    for (i=0;i<_input.length;i++) {
      if (_input[i]=="")
        _input.splice (i,1);
    }     
    return _input
  }


  // Suche nach den falschen Worttrennungen
  function searchWordSeparations (_words,_caseSensitivOption,_wholeWordOption) {
    
    var _doc = app.activeDocument;
    var _wrongSeparateWords = []; 
    var _correct; 
    var _discretHyphenCor; // Korrekturwert bei Vorhandensein von bedingten Trennstrichen
    
    var _progressWindow = new Window ("palette", localize(_global.justAMoment));
    var _progress = progressBar (_progressWindow, _words.length);
    
    for (w=0;w<_words.length;w++) {  
      _progress.value = w+1;
      var _wordAndSepPos = sepPosOfWord (_words[w]);
      _progressWindow.children[0].children[0].text = _wordAndSepPos[0]; 
      var _foundWords = searchForTheWord (_wordAndSepPos[0],_caseSensitivOption,_wholeWordOption, _doc);
      //if (_foundWords.length == 0) alert("Keine Einträge gefunden!"); 
      for (i=0;i<_foundWords.length;i++) { 
        try {    
          if(_foundWords[i].lines.length>1) { 
            _discretHyphenCor = 0; // Zuruecksetzen des Korrekturwertes fuer jedes neue Wort
            for (j=0;j<_foundWords[i].length-1;j++) {            
              if (_foundWords[i].characters[j].contents == SpecialCharacters.DISCRETIONARY_HYPHEN ||
                  _foundWords[i].characters[j].contents == SpecialCharacters.ZERO_WIDTH_NONJOINER ||
                  _foundWords[i].characters[j].contents == SpecialCharacters.ZERO_WIDTH_JOINER ||
                  _foundWords[i].characters[j].contents == SpecialCharacters.INDENT_HERE_TAB || 
                  _foundWords[i].characters[j].contents == SpecialCharacters.END_NESTED_STYLE ||
                  _foundWords[i].characters[j].contents == SpecialCharacters.DISCRETIONARY_LINE_BREAK ||
                  _foundWords[i].characters[j].contents == "\uFEFF") {
                _discretHyphenCor += 1; // Sonderzeichen mitzaehlen
              }
              if(_foundWords[i].characters[j].lines[0] != _foundWords[i].characters[j+1].lines[0]) {       
                _correct = false; 
                for (c=0;c<_wordAndSepPos[1].length;c++) {  
                  if ((_wordAndSepPos[1][c]-1)==(j-_discretHyphenCor)) { 
                    _correct = true;   
                  }
                }
                if (!_correct) {
                  _wrongSeparateWords.push(_foundWords[i]);
                  _counter += 1;
                }
              }
            }       
          }
        } catch (e) { 
          _alertCounter += 1;
        }    
      }  
    }
  
    _progress.parent.close();
    
    if (_counter != 0) {
      try { 
        showIt(_wrongSeparateWords[_selectionCounter]); 
      } catch (e) { 
        _alertCounter += 1; 
      } // showIt: Fehler bei Übersatztext
    
      if (_alertCounter > 0) 
        alert(localize(_global.overset));
      
      _selectionCounter += 1;
      _showDialog (_wrongSeparateWords);
    } else {
      if (_alertCounter > 0) 
        alert(localize(_global.noWrongDivisionBut));
      else
        alert(localize(_global.noWrongDivisionHint));
    }  
  }

  // Korrekte Trennstellen im Wort ermitteln
  function sepPosOfWord (_word) {
     
    var _corSepPos;
    var _allCorSepPos = [];
    var _wordAndAllCorSepPos = [];  
      do {
        _corSepPos = _word.indexOf("~");    
        _allCorSepPos.push(_corSepPos);   
        _word = _word.replace("~","");     
      } while (_word.indexOf("~")!=-1)       
    return _wordAndAllCorSepPos = [_word,_allCorSepPos];
  }

  // Nach den eingegebenen Woertern im Dokument suchen
  function searchForTheWord (_find,_caseSensitivOption,_wholeWordOption, _place) {
    
    with (app) {   
      with (findChangeTextOptions) {   
        //User-Einstellungen speichern
        var _userCaseSenitive = caseSensitive; 
        var _userWholeWord = wholeWord; 
        var _userIncludeFootnotes = includeFootnotes;
        var _userIncludeHiddenLayers = includeHiddenLayers;
        var _userIncludeLockedLayersForFind = includeLockedLayersForFind;
        var _userIncludeLockedStoriesForFind = includeLockedStoriesForFind;
        var _userIncludeMasterPages = includeMasterPages;
        //Einstellungen setzen
        caseSensitive = _caseSensitivOption;
        wholeWord = _wholeWordOption;
        includeFootnotes = true;
        includeHiddenLayers = true;
        includeLockedLayersForFind = true;
        includeLockedStoriesForFind = true;
        includeMasterPages = false;     
      }  
    
      findTextPreferences = NothingEnum.nothing;
      changeTextPreferences = NothingEnum.nothing;
      
      with (findTextPreferences) {
        findWhat = _find;
      }
      
      _results = _place.findText(true); 
      
      findTextPreferences = NothingEnum.nothing;
      changeTextPreferences = NothingEnum.nothing;
      
      with (findChangeTextOptions) {     
        //User-Einstellungen wieder herstellen
        caseSensitive = _userCaseSenitive; 
        wholeWord = _userWholeWord;     
        includeFootnotes = _userIncludeFootnotes;
        includeHiddenLayers = _userIncludeHiddenLayers;
        includeLockedLayersForFind = _userIncludeLockedLayersForFind;
        includeLockedStoriesForFind = _userIncludeLockedStoriesForFind;
        includeMasterPages = _userIncludeMasterPages;    
      } 
    }
    return _results;
  }


  // function showIt von Gregor Fellenz: www.indd-skript.de
  // showIt() zeigt das übergebene Objekt an
  function showIt (_object) {
    if (_object != null && app.documents.length > 0 && app.layoutWindows.length > 0 ) {
      app.activeWindow.activeSpread = getSpreadByObject (_object);
      app.select(_object);
      var myZoom = app.activeWindow.zoomPercentage; 
      app.activeWindow.zoom(ZoomOptions.showPasteboard); 
      app.activeWindow.zoomPercentage = myZoom;
      return true;
    }
    else {
      return false;
    }
  }


  // function getSpreadByObject von Gregor Fellenz: www.indd-skript.de
  // Liefert den Druckbogen, auf dem sich das Objekt befindet
  function  getSpreadByObject (_object) {
    if (_object != null) {
      _object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in  CS5!
      if (_object.hasOwnProperty("baseline")) {
        _object = _object.parentTextFrames[0];
      }
      while (_object != null) {
        var whatIsIt = _object.constructor;
        switch (whatIsIt) {
          case Spread : return _object;
          case Character : _object = _object.parentTextFrames[0]; break;
          case Footnote :; // drop through
          case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
          case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
          case XMLElement : if (_object.insertionPoints[0] != null) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
          case Application : return null;
          default: _object = _object.parent;
        }
        if (_object == null) return null;
      }
      return _object;
        } 
    else {
      return null;
    }
  }
}


// Deutsch-Englische Dialogtexte und Fehlermeldungen
function __defLocalizeStrings() {
  
  _global.findWrongDivision = { en:"Find wrong word divisions", 
                                de:"Falsche Worttrennungen finden" }
  
  _global.wrongVersion = { en:"Unfortunately, this script is only suited for version CS4 or above!\r(Tested in Version  CS5.5 und 6)", 
                           de:"Das Skript ist leider erst ab Version CS4 lauffähig!\r(Getestet in Version CS5.5 und 6)" }
  
  _global.noDocOpened = { en:"No document opened!\rTo run the script at least one document must be open.", 
                          de:"Kein Dokument geöffnet!\rZur Ausführung des Skripts muss mindestens ein offenes Dokument vorhanden sein."}
  
  _global.alertMessage = { en:"Sorry, an error has occured:", 
                           de:"Leider ist ein Fehler aufgetreten:" }
  
  _global.divisionCorrect = { en:"Is this division correct?", 
                              de:"Ist diese Trennung korrekt?" }

  _global.whatWords = { en:"What words would you like to search for?", 
                        de:"Nach welchen Wörtern möchten Sie suchen?" }
   
  _global.hyphenationExceptions = { en:"Load document hyphenation exceptions", 
                                    de:"Dokumentspezifische Ausnahmen für Silbentrennung laden" }
                            
  _global.wordsFromDictionary = { en:"Load words from user dictionary", 
                                  de:"Wörter aus Benutzerwörterbuch laden" }                          
  
  _global.wholeWord = { en:"Whole word", 
                        de:"Ganzes Wort" }
  
  _global.wholeWord_HT = { en:"Exclude words they are part of another word", 
                           de:"Worte, die Teil eines anderen Wortes sind, ausschließen" }

  _global.caseSensitive = { en:"Case sensitive", 
                            de:"Groß-/Kleinschreibung beachten" }

  _global.caseSensitive_HT = { en:"Regard the capitalization of pasted words", 
                               de:"Groß-/Kleinschreibung der eingegebene Wörter berücksichtigen" }

  _global.example = { en:"Example:", 
                      de:"Beispiel:" }

  _global.firstExample = { en:"Knick~~er~bock~~ers", 
                           de:"Mor~~gen~re~~gen" }

  _global.secoundExample = { en:"Pumper~nickel", 
                             de:"Abend~sonne" }

  _global.cancel = { en:"Cancel", 
                     de:"Beenden" } 
  
  _global.go = { en:"Start", 
                 de:"Start" } 

  _global.userDictionary = { en:"Selection of user dictionary", 
                             de:"Auswahl des Benutzerwörterbuches" }

  _global.highlight = { en:"Highlight", 
                        de:"Markieren" }

  _global.goon = { en:"Continue", 
                   de:"Weiter" } 

  _global.overset = { en:"The searched word is located in overset text or could not display due to other reasons!", 
                      de:"Das gesuchte Wort befindet sich im Textübersatz oder kann aus anderen Gründen nicht angezeigt werden!" }

  _global.lastResult = { en:"You have reached the last match.\rHint: Text on master pages or in overset text is not searched.", 
                         de:"Letzte Fundstelle erreicht.\rHinweis: Nicht untersucht wird Text auf Musterseiten und im Übersatz." }

  _global.justAMoment = { en:"Just a moment please ...", 
                          de:"Einen Moment bitte ..." }

  _global.noWrongDivisionBut = { en:"No wrong word division was found!\rBut at least one of the searched words could be in overset text.", 
                                 de:"Keine falsche Worttrennung gefunden!\rMindestens eines der gesuchten Worte könnte sich allerdings im Textübersatz befinden." }

  _global.noWrongDivisionHint = { en:"No wrong word division was found!\rHint: Text on master pages or in overset text is not searched.", 
                                  de:"Keine falsche Worttrennung gefunden!\rHinweis: Nicht untersucht wird Text auf Musterseiten und im Übersatz." }

                       
} // END function __defLocalizeStrings




