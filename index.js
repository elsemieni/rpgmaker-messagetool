/**
 *========================================================================
 *EN.I RPG Maker message tool v0.7
 *2015-2025 by elsemieni/EN.I - elsemieni.net
 *========================================================================
 This work is free. You can redistribute it and/or modify it under the
 terms of the Do What The Fuck You Want To Public License, Version 2,
 as published by Sam Hocevar. See https://www.wtfpl.net/ for more details.
 *========================================================================
 */

//===========================================================================
//Helper functions
//===========================================================================

//Those are wrapper functions for common selectors.

MsgToolHelper = {
    /**
     * Shortcut for getElementByID
     * @param id
     * @returns {HTMLElement}
     */
    el: function (id) {
        return document.getElementById(id);
    },

    /**
     * Shortcut for getElementByClassName
     * @param id
     * @returns {HTMLElement}
     */
    cel: function (id) {
        return document.getElementsByClassName(id);
    },

    /**
     *    Shows or hide all elements with a specified class.
     *    @param {String} className The name of a class
     *    @param {boolean} state True for visible, false for hide
     */
    turnClass: function (className, state) {
        const styleState = (state === true ? "inline-block" : "none");
        const elems = MsgToolHelper.cel(className);
        for (let i = 0; i < elems.length; i++) {
            elems[i].style.display = styleState;
        }
    },

    /**
     * Insert a string in the specified position of another string.
     * @param {String} string The destination string
     * @param {String} newString The string for add
     * @param {number} pos The string index for add the new string.
     * @return {String} The mixed string.
     */
    stringAdd: function (string, newString, pos) {
        return [string.slice(0, pos), newString, string.slice(pos)].join('');
    },

    /**
     * Insert 2 strings at the start and the end of specified positions, if exists.
     * @param {String} string The destination string
     * @param {String} newString The string for add
     * @param {number} initPos The start string index for add the new string.
     * @param {number} finalPos The end string index for add the new string. Leave is as posInicio if there's no selection.
     * @param {String} newStringAtEnd The string for add at the end of selection.
     * @return {String} The mixed string.
     */
    stringSurround: function (string, newString, initPos, finalPos, newStringAtEnd) {
        if (initPos === finalPos) return MsgToolHelper.stringAdd(string, newString, initPos);
        string = MsgToolHelper.stringAdd(string, newStringAtEnd, finalPos);
        return MsgToolHelper.stringAdd(string, newString, initPos);
    },

    /**
     * Adds an image element at below of the page for debugging purposes
     *    @param {String} url URL for image. Usually we provide base64, but I guess it should support URL too :)
     *    @param {Number} width Width of result image element.
     *    @param {Number} height Height of image element
     */
    addDebugImage: function (url, width, height) {
        /**/return false;/**/
        const parentDiv = document.getElementById('debug');
        const newDiv = document.createElement('div');
        newDiv.style.width = width + 'px';
        newDiv.style.height = height + 'px';
        newDiv.style.display = 'inline-block';
        newDiv.style.backgroundImage = 'url(' + url + ')';
        newDiv.style.backgroundRepeat = 'no-repeat';
        newDiv.style.backgroundSize = '100% 100%';
        newDiv.style.border = '1px solid #2980b9'
        newDiv.style.margin = '5px';
        parentDiv.appendChild(newDiv);
    }
}


//===========================================================================
//Main class
//===========================================================================

/**
 * The main class that holds RPG Maker Message toolbar
 */
MsgTool = function () {
    //Start with 2k as default
    this.maker = "2k";
    this.faceEnabled = false;
    this.colorShown = false;
    this.symbolShown = false;
    this.inputLength = 50;
    MsgToolHelper.el("inputLength").value = this.inputLength;

    //Those are base64 encoded RPG Maker default System/Glyph/WindowSkin images, which are loaded by default.
    this.defaultSystem2k = "data:image/png;base64,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";
    this.defaultGlyph2k = "data:image/png;base64,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";
    this.defaultWindowskinVX = "data:image/png;base64,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";
    this.defaultWindowskinMV = "data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAANiSURBVHja7N09a5NRGIDhc1LBpaC7S1oRnETs4CZ17CBksLPFxcVVFwdTVPA3CEqro2BFsI4m6OLqouBHs0h/gJ2k9jhYbRPb2gcb83VdFErpkzfhJTcnoSdv89VXSyXRM8/vLDgJPVRxChAACAAEAAIAAYAAQAAgABAACACGxyGnYLB8fvE0Owu7m5yphfa2WQHwEggEAAIAAYAAQAAgABAACAAEAEPEXiDanHrzpavXiXp79lhf7WWyAuAlEAgABAACAAGAAEAAIAAQAAgAhoi9QEMuuren23t1+u3xWAGwAkCnS/nEge4KXSwf+vKKdlYAvAkGAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAcAA8JlgdtSvn+G1AoAVgP2KXlfH/wgDb4JBACAAEAAIAAQAAgABgABAADCw7AWiTb/t1bECgABAACAAEAAIAAQAAgABgABAALBv9gINmMmZWnEWrAAgABAACAAEAAIAAYAAQAAgABAA7CCvLttb0kvX1gf7Mjx3H37s6vHHLh+3AoAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAIAAQAAgABwCjxP8L4J92+bs/3B5+sACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAACAAGAAEAAMEpcF6jHHl14EpqfWHwXml95fz00f+XiWmj+WXq55+9LKSmlsvlV0pmv6efPKaWUcsq583tuu/3U48U9j13K5veNkjZKSbdvtbYdPaWUt46Z85/HFwBd1f6Ey6lS2W3u91M2eOyScsqpjOWUS0m5Umk7yvb773zyC4D/lcGvr5TzwQdW0taxO5/k+S93KACGYJVJ215SxQrzJpiRJgAEAAIAAYAAQAAgABhy/hDWY81mM3aD1nhsvvE6NH7vZOzw576thOYPb0yE5qfG66H5er1lBQABgABAACAAEAAIAAQAAgABIAAYVXl1uVacht65v7YUmr8xez52BxOt2HiqhuYbc7GHc3Q6Nl9r1GM3mD5tBQABgABAACAAEAAIAAQAAgABIAAYVa4L1GPrs/Oh+eb8dGi+MXczNL8SfPy5GtybVK2Gxhdasflq44gVAAQAAgABgABAACAAEAAIAASAAGBU/QAAAP//AwCT2ndB13mojQAAAABJRU5ErkJggg=="
};


//===========================================================================
//METHODS
//===========================================================================

/**
 * Change the controls to specified RPG Maker mode.
 * @param {String} maker "2k" for RPG Maker 2k/2k3, "xp" for RPG Maker XP and "vx" for RPG Maker VX/VX ace
 */
MsgTool.turnInto = function (maker) {
    switch (maker) {
        case "2k":
            mt.maker = "2k";
            MsgTool.cleanButtons();
            MsgToolHelper.turnClass("button2k", true);
            loadSystemColors(mt.defaultSystem2k);
            loadSymbols(mt.defaultGlyph2k);
            break;
        case "xp":
            mt.maker = "xp";
            MsgTool.cleanButtons();
            MsgToolHelper.turnClass("buttonXP", true);
            loadSystemColors(null);
            break;
        case "vx":
            mt.maker = "vx";
            MsgTool.cleanButtons();
            MsgToolHelper.turnClass("buttonVX", true);
            loadSystemColors(mt.defaultWindowskinVX);
            break;
        case "mv": //TODO mmmm
            mt.maker = "mv";
            MsgTool.cleanButtons();
            MsgToolHelper.turnClass("buttonMV", true);
            loadSystemColors(mt.defaultWindowskinMV);
            break;
        case "mz": //TODO mmmm
            mt.maker = "mv";
            MsgTool.cleanButtons();
            MsgToolHelper.turnClass("buttonMZ", true);
            loadSystemColors(mt.defaultWindowskinMV);
            break;

    }
}

/**
 * Shows or hides the color picker.
 * @param {boolean} state True for show, False for hide.
 */
MsgTool.turnColorPicker = function (state) {
    mt.colorShown = state;
    if (state === true) MsgToolHelper.el("colorTable").setAttribute("style", "display:block");
    else MsgToolHelper.el("colorTable").setAttribute("style", "display:none");
};

/**
 * Shows or hides the symbol picker.
 * @param {boolean} state True for show, False for hide.
 */
MsgTool.turnSymbolPicker = function (state) {
    mt.symbolShown = state;
    if (state === true) MsgToolHelper.el("gTable").setAttribute("style", "display:block");
    else MsgToolHelper.el("gTable").setAttribute("style", "display:none");
};

/**
 * Disables all RPG Maker specific buttons. Used for cleaning.
 */
MsgTool.cleanButtons = function () {
    //disable and hide
    mt.faceEnabled = false;
    MsgTool.turnColorPicker(false);
    MsgTool.turnSymbolPicker(false);

    MsgToolHelper.turnClass("button2k", false);
    MsgToolHelper.turnClass("buttonXP", false);
    MsgToolHelper.turnClass("buttonVX", false);
    MsgToolHelper.turnClass("buttonMV", false);
    MsgToolHelper.turnClass("buttonMZ", false);
}
/**
 * Checks the actual char limit per line, which depends on the Maker used
 * @return {number} The character limit.
 */
MsgTool.limitLength = function () {
    //TODO only for 2k/3?
    return (mt.faceEnabled === false ? mt.inputLength : mt.inputLength - 12);
}

MsgTool.setCustomInputLength = function () {
    mt.inputLength = MsgToolHelper.el("inputLength").value;
    if (mt.inputLength < 1) mt.inputLength = 50;
    MsgTool.checkText();
}

/**
 /* Returns the length of a string considering RPG Maker special commands
 /* @param {String} The input string.
 /* @return {number} The string length.
 */
MsgTool.noCommandLength = function (string) {
    string = string.replace(/\\\\/g, "A");						//Consider slashes as 1 character
    string = string.replace(/(\\([!-}])(\[\w+])*)/g, "");	//Stripping special commands
    string = string.replace(/(\$([A-z]))/g, "A");				//Consider symbols as 1 character
    return string.length;
}

/**
 * Checks the length of input message and show the results in the page.
 */
MsgTool.checkText = function () {
    const chars = (MsgToolHelper.el("S1").value).split('\n');
    if (chars.length > 4) MsgToolHelper.el("tooLargeText").innerHTML = "<b>Your text has " + chars.length + " lines! Notice that a message just contain 4 lines.</b>";
    else MsgToolHelper.el("tooLargeText").innerHTML = "";

    let outputText = "";
    for (let i = 0; i < chars.length; i++) {
        outputText += (i + 1) + "th line length: " + MsgTool.noCommandLength(chars[i]) + " ( " + (MsgTool.limitLength() - MsgTool.noCommandLength(chars[i])) + " characters remain)";
        if (MsgTool.noCommandLength(chars[i]) > MsgTool.limitLength()) outputText += " - You overreached the character limit in " + (MsgTool.noCommandLength(chars[i]) - MsgTool.limitLength()) + " characters!";
        outputText += "</br>";
    }
    document.getElementById("lengths").innerHTML = outputText;
}

/**
 * Takes the text in the textbox and adapts it to fits in RPG Maker messages, which depends on it has face enabled or not.
 */
MsgTool.adaptText = function () {
    let output = "";
    const text = MsgToolHelper.el("S1").value;
    const paragraphs = text.split("\n");
    const limitLength = MsgTool.limitLength();

    for (let i = 0; i < paragraphs.length; i++) {
        const words = paragraphs[i].split(" ");
        let charcount = 0;
        let linecount = 0;
        for (let j = 0; j < words.length; j++) {
            if ((charcount + words[j].length + 1) >= limitLength) {
                //New line
                if (linecount === 3) {
                    //New message
                    output += "\n==========NEXT MESSAGE============\n";
                    linecount = 0;

                } else {
                    output += "\n";
                    linecount++;
                }
                charcount = words[j].length + 1;

            } else {
                charcount += words[j].length + 1;
            }
            output += words[j] + " ";
        }
        output += "\n==========NEXT MESSAGE============\n";
    }

    MsgToolHelper.el("S1").value = output;
    MsgTool.checkText();

}

/**
 * Clean input textbox, after a confirmation.
 */
MsgTool.cleanText = function () {
    const r = confirm("Are you sure?");
    if (r === true) {
        MsgToolHelper.el("S1").value = "";
        MsgTool.checkText();
    }
}

/**
 *    Copy the contents of the textbox to the clipboard.
 */
MsgTool.copyToClipboard = function () {
    const textBox = MsgToolHelper.el("S1");
    textBox.setSelectionRange(0, textBox.value.length);

    navigator.clipboard.writeText(textBox.value).catch((err) => {
        alert("Something happened... Perhaps your browser did not like clipboards? Copy it manually :P");
    });

}

//===========================================================================
//IMAGE MANIPULATION METHODS
//===========================================================================

/**
 * Take a Base64 input image and it crops in specified-size tiles.
 * @param {String} original Base64 image.
 * @param {number} tilewidth the width of output tiles
 * @param {number} tileheight the height of output tiles
 * @param {number} xtiles Wich tiles you want in x-coordinates.
 * @param {number} ytiles Wich tiles you want in y-coordinates.
 * @return {String[]} An array of Base64-image tiles.
 */
function cutImageUp(original, tilewidth, tileheight, xtiles, ytiles) {

    MsgToolHelper.addDebugImage(original, 200, 200);

    const image = new Image();
    image.src = original;

    const imagePieces = [];
    for (let y = 0; y < ytiles; ++y) {
        for (let x = 0; x < xtiles; ++x) {
            const canvas = document.createElement('canvas');
            canvas.width = tilewidth;
            canvas.height = tileheight;
            const context = canvas.getContext('2d');
            context.drawImage(image, x * tilewidth, y * tileheight, tilewidth, tileheight, 0, 0, canvas.width, canvas.height);
            imagePieces.push(canvas.toDataURL());
        }
    }

    for (let i = 0; i < imagePieces.length; i++) {
        MsgToolHelper.addDebugImage(imagePieces[i], 16, 16);
    }

    return imagePieces;
}

/**
 * Take a Base64 input image and it crops in specified-size tiles. The main difference with the previous method is that preloads the image asynchronously.
 * @param {String} original Base64 image.
 * @param {number} tilewidth the width of output tiles
 * @param {number} tileheight the height of output tiles
 * @param {number} xtiles Wich tiles you want in x-coordinates.
 * @param {number} ytiles Wich tiles you want in y-coordinates.
 * @param {function} callback Function to call when this is ready.
 * @param context
 */
function cutImageUpAsync(original, tilewidth, tileheight, xtiles, ytiles, callback, context=null){
    MsgToolHelper.addDebugImage(original, 200, 200);

    const image = new Image();
    image.src = original;
    image.decode().then(() => {
        const imagePieces = [];
        for (let y = 0; y < ytiles; ++y) {
            for (let x = 0; x < xtiles; ++x) {
                const canvas = document.createElement('canvas');
                canvas.width = tilewidth;
                canvas.height = tileheight;
                const context = canvas.getContext('2d');
                context.drawImage(image, x * tilewidth, y * tileheight, tilewidth, tileheight, 0, 0, canvas.width, canvas.height);
                imagePieces.push(canvas.toDataURL());
            }
        }

        for (let i = 0; i < imagePieces.length; i++) {
            MsgToolHelper.addDebugImage(imagePieces[i], 16, 16);
        }

        callback.bind(context)(imagePieces);
    })


}

/**
 * Process a System/WindowSkin base64 picture and apply the color tiles, which depends on chosen maker.
 * @param {String} image Base64 (or url) input picture. Use any (null) and if RPG Maker XP is selected it will be filled with colors. .
 */
function loadSystemColors(image) {
    let i, k;
    let imageArray;
    switch (mt.maker) {
        //================================================================
        case "2k":
            cutImageUpAsync(image, 16, 16, 10, 5, function(imageArray) {
                for (i = 30; i < 50; i++) {
                    MsgToolHelper.el("colorButton" + (i - 30)).setAttribute("style", "background-image: url(" + imageArray[i] + ");");
                }
            }, this);
            break;
        //================================================================
        case "vx":
        case "mv":
        case "mz":
            // VX/VXAce and MV/MZ shares the same format. The only difference is that MV uses a 128x128 size and MV/MZ 192x192 one
            // So we can re-use a lot of code here!
            let tileSize;
            if (mt.maker === "vx") tileSize = 8;
            else tileSize = 12;
            cutImageUpAsync(image, tileSize, tileSize, 16, 16, function(imageArray) {
                i = 0;
                k = 0;
                while (i < 32) {
                    for (let j = 8; j < 16; j++) {
                        MsgToolHelper.el("colorButton" + (i)).setAttribute("style", "background-image: url(" + imageArray[192 + (k * 16) + j] + ");");
                        i++;
                    }
                    k++;
                }
            }, this);
            break;
        //================================================================
        case "xp":
            for (i = 0; i < 8; i++) {
                MsgToolHelper.el("colorButton" + (i)).setAttribute("style", "background-image: '';");
            }

            MsgToolHelper.el("colorButton0").setAttribute("style", "background-color: white;");
            MsgToolHelper.el("colorButton1").setAttribute("style", "background-color: #0080FF;");
            MsgToolHelper.el("colorButton2").setAttribute("style", "background-color: #FF6A6A;");
            MsgToolHelper.el("colorButton3").setAttribute("style", "background-color: lime;");
            MsgToolHelper.el("colorButton4").setAttribute("style", "background-color: aqua;");
            MsgToolHelper.el("colorButton5").setAttribute("style", "background-color: #FF9FFF;");
            MsgToolHelper.el("colorButton6").setAttribute("style", "background-color: #FFFF84;");
            MsgToolHelper.el("colorButton7").setAttribute("style", "background-color: #D6D6D6;");

            break;
        //================================================================
    }
}

/**
 * Process an RPG Maker 2000/2003 symbol Base64 picture and apply it to the buttons.
 * @param {String} image Glyph Base64 input picture.
 */
function loadSymbols(image) {
    cutImageUpAsync(image, 12, 12, 13, 4, function(imageArray) {
        for (i = 0; i < 52; i++) {
            MsgToolHelper.el("symButton" + i).setAttribute("style", "background-image: url(" + imageArray[i] + ");");
        }
    }, this);
}

//===========================================================================
//TEXT INSERTION SPECIFIC TOOL METHODS
//===========================================================================

MsgTool.focus = function (position) {
    MsgToolHelper.el("S1").focus();
    MsgToolHelper.el("S1").setSelectionRange(pos, pos, "forward");
}

/**
 * Add a command string in the selected position of input textbox.
 * @param {String} data The string for add.
 */
MsgTool.addData = function (data) {
    const pos = MsgToolHelper.el("S1").selectionStart;
    MsgToolHelper.el("S1").value = MsgToolHelper.stringAdd(MsgToolHelper.el("S1").value, data, pos);
    MsgTool.focus(pos);
};

/**
 * Add a command string in the selected position of input textbox, with a parameter inside.
 * @param {String} data The string for add.
 * @param {number} value The value for add inside.
 */
MsgTool.addSurroundedData = function (data, value) {
    const text = MsgToolHelper.el("S1");
    text.value = MsgToolHelper.stringSurround(text.value, data + "[" + value + "]", text.selectionStart, text.selectionEnd, data + "[0]");
    MsgTool.focus(text.selectionEnd);
};

/**
 * Add a command string at the beginning and the end of the selected text of input textbox.
 * @param {String} data The string for add at the beginning.
 * @param {String} data2 The string for add at the end.
 */
MsgTool.addSurroundedDataFixed = function (data, data2) {
    const text = MsgToolHelper.el("S1");
    text.value = MsgToolHelper.stringSurround(text.value, data, text.selectionStart, text.selectionEnd, data2);
    MsgTool.focus(text.selectionEnd);
};

/**
 * Add a command string in the selected position of input textbox, with a parameter which is asked to user to input.
 * @param {String} command The string for add.
 * @param {String} infoString The message for the user to ask for input.
 * @param {number} defaultValue A placeholder value
 */
MsgTool.addDataPrompt = function (command, infoString, defaultValue) {
    const data = prompt(infoString, defaultValue);
    if (data == null) return;

    const pos = MsgToolHelper.el("S1").selectionStart;
    MsgToolHelper.el("S1").value = MsgToolHelper.stringAdd(MsgToolHelper.el("S1").value, command + "[" + data + "]", pos);
    MsgTool.focus(MsgToolHelper.el("S1").selectionEnd);
};

/**
 * Add a command string at the beginning and the end of the selected text of input textbox, with a parameter that's asked the user.
 * @param {String} command The string for add.
 * @param {String} infoString The message for the user to ask for input.
 * @param {number} defaultValue A placeholder value
 */
MsgTool.addSurroundedDataPrompt = function (command, infoString, defaultValue) {
    const data = prompt(infoString, defaultValue);
    if (data == null) return;

    MsgTool.addSurroundedData(command, data);
}

//===========================================================================
//ADD TEXT METHODS
//===========================================================================

/**
 *    Those are text input methods for add RPG Maker specific commands, that uses
 *    the text insertion specific methods for add those to the input text.
 *    Their functionality is self-explain.
 */

MsgTool.addSymbol = function (data) {
    MsgTool.addData(data);
    MsgTool.turnSymbolPicker(false);
    MsgTool.checkText();
};

MsgTool.addColor = function (data) {
    MsgTool.addSurroundedData("\\c", data);
    MsgTool.turnColorPicker(false);
}

MsgTool.addMoney = function () {
    if (mt.maker === "xp") MsgTool.addData("\\G");
    else MsgTool.addData("\\$");
};

MsgTool.drawIcon = function () {
    MsgTool.addDataPrompt("\\I", "Wich icon?", "1");
    MsgTool.checkText();
};
MsgTool.addSlash = function () {
    MsgTool.addData("\\\\");
    MsgTool.checkText();
};
MsgTool.addSpeed = function () {
    MsgTool.addSurroundedDataPrompt("\\s", "Wich speed?", "0");
};
MsgTool.addInstant = function () {
    MsgTool.addSurroundedDataFixed("\\>", "\\<");
};
MsgTool.addVar = function () {
    MsgTool.addDataPrompt("\\v", "Wich variable ID?", "0");
};
MsgTool.addHero = function () {
    MsgTool.addDataPrompt("\\n", "Wich hero ID?", "0");
};
MsgTool.addPartyMember = function () {
    MsgTool.addDataPrompt("\\P", "Wich party member ID?", "0");
};
MsgTool.addCurrency = function () {
    MsgTool.addData("\\G");
};
MsgTool.addMoreSize = function () {
    MsgTool.addData("\\{");
};
MsgTool.addLessSize = function () {
    MsgTool.addData("\\}");
};

MsgTool.addPause = function () {
    MsgTool.addData("\\!");
};
MsgTool.addQuartPause = function () {
    MsgTool.addData("\\.");
};
MsgTool.addIntPause = function () {
    MsgTool.addData("\\|");
};
MsgTool.addEnd = function () {
    MsgTool.addData("\\^");
};
MsgTool.addHalfSpace = function () {
    MsgTool.addData("\\_");
};
MsgTool.addSetTextSize = function () {
    MsgTool.addDataPrompt("\\FS", "What text size?", "12");
};
MsgTool.addSetXCoordinate = function () {
    MsgTool.addDataPrompt("\\PX", "Which X coordinate?", "0");
};
MsgTool.addSetYCoordinate = function () {
    MsgTool.addDataPrompt("\\PY", "Which Y coordinate?", "0");
};

//===========================================================================
//EVENT LISTENERS
//===========================================================================

/**
 *    Loads/hides color table.
 */
MsgTool.turnColor = function () {
    if (mt.colorShown === false) MsgTool.turnColorPicker(true);
    else MsgTool.turnColorPicker(false);
}

/**
 *    Activates/deactivates the face message limiter.
 */
MsgTool.faceLimiter = function () {
    mt.faceEnabled = (mt.faceEnabled === false);
    MsgTool.checkText();
}

/**
 *    Process asynchronously the uplodaded System/Windowskin for the crop process.
 */
MsgTool.readSystem = function () {
    if (this.files && this.files[0]) {
        const FR = new FileReader();
        FR.onload = function (e) {
            //Preload image before loading into canvases (if possible)
            try {
                let imageToLoad = new Image();
                imageToLoad.onload = () => {
                    loadSystemColors(e.target.result);
                };
                imageToLoad.src = e.target.result;
            } catch (e) {
                console.log("Something happened while loading the image :P")
            }

        };
        FR.readAsDataURL(this.files[0]);
    }
}

/**
 *    Process asynchronously the uplodaded symbol for the crop process.
 */
MsgTool.readSymbol = function () {
    if (this.files && this.files[0]) {
        const FR = new FileReader();
        FR.onload = function (e) {
            loadSymbols(e.target.result);
        };
        FR.readAsDataURL(this.files[0]);
    }
}

/**
 *    Changes the RPG Maker mode.
 */
MsgTool.changeMaker = function () {
    switch (MsgToolHelper.el("makerSelector").value) {
        case "RPG Maker 2000/2003":
            MsgTool.turnInto("2k");
            break;
        case "RPG Maker XP":
            MsgTool.turnInto("xp");
            break;
        case "RPG Maker VX/VXAce":
            MsgTool.turnInto("vx");
            break;
        case "RPG Maker MV":
            MsgTool.turnInto("mv");
            break;
        case "RPG Maker MZ":
            MsgTool.turnInto("mz");
            break;
    }
}

/**
 *    Loads/hides the symbol table.
 */
MsgTool.turnSymbol = function () {
    MsgTool.turnSymbolPicker(!mt.symbolShown);
}

/**
 *    Loads/hides the color table.
 */
MsgTool.turnColor = function () {
    MsgTool.turnColorPicker(!mt.colorShown);
}

//Those are event listeners for uploaders and RPG Maker selector.
MsgToolHelper.el("systemUpload").addEventListener("change", MsgTool.readSystem, false);
MsgToolHelper.el("symbolUpload").addEventListener("change", MsgTool.readSymbol, false);
MsgToolHelper.el("makerSelector").addEventListener("change", MsgTool.changeMaker, false);


//===========================================================================
//INITIALIZE
//===========================================================================

const mt = new MsgTool;

// Fix a bug that prevents canvases correctly load base64 images at page load.
// Ensure to preload images on browser first before doing anything else.
const imagesToLoad = [
    mt.defaultSystem2k,
    mt.defaultGlyph2k,
    mt.defaultWindowskinVX,
    mt.defaultWindowskinMV
]

let imageLoadedI = -1;
let imageToLoad;

onDefaultImageLoaded = function () {
    imageLoadedI++;
    // If loading ended, continue to load our web
    if (imageLoadedI >= imagesToLoad.length) {
        console.log("All images preloaded, loading site");
        MsgToolHelper.el("center").style.display = "";
        MsgTool.turnInto("2k");
    } else {
        //load next image
        imageToLoad = new Image();
        imageToLoad.onload = onDefaultImageLoaded
        imageToLoad.src = imagesToLoad[imageLoadedI];
    }
}
onDefaultImageLoaded();

