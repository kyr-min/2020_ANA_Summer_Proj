var TM = {};
TM.defaultSettings = {
    screen: {
        canvasId: "tm-canvas",
        frameSpeed: 40,
        column: 60,
        row: 20,
        backgroundColor: "#151617",
        webFontJsPath: "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
        fontColor: "#F5F7FA",
        fontFamily: "monospace",
        fontSource: null,
        fontSize: 30,
        zoom: .5
    },
    charGroups: {
        korean: {
            chars: "ㄱ-힝",
            isFullwidth: !0,
            sizeAdj: 1,
            xAdj: 0,
            yAdj: 0
        }
    },
    debug: {
        devMode: !1,
        outputDomId: "tm-debug-output"
    }
}, TM.common = {}, TM.common.getBlockWidth = function(t) {
    return .6 * t
}, TM.common.getBlockHeight = function(t) {
    var e;
    if (t < 3) e = t;
    else {
        var r = [6, 7, 7],
            n = 0,
            o = 1,
            i = function(t) {
                t - r[n] <= 0 || (t -= r[n], o++, n = (n + 1) % 3, i(t))
            };
        i(t - 3), e = t + o
    }
    return e
}, TM.common.isNumber = function(t) {
    return !!(0 === t || t && t.constructor == Number)
}, TM.common.getCharGroup = function(t, e) {
    for (var r in t) {
        var n = t[r];
        if (new RegExp("^[" + n.chars + "]$").test(e)) return n
    }
}, TM.common.getFullwidthRegex = function(t) {
    var e = "";
    for (var r in t) {
        var n = t[r];
        n && n.isFullwidth && (e += n.chars)
    }
    if (e) return new RegExp("([" + e + "])", "g")
}, TM.common.includeScript = function(t, e) {
    if (t) {
        var r = document.querySelector('script[src="' + t + '"]');
        r || ((r = document.createElement("script")).src = t, r.onload = e, document.getElementsByTagName("head")[0].appendChild(r))
    }
}, TM.common.checkFontLoadedByWebFont = function(t) {
    var e = t.replace(/ /g, "").toLowerCase();
    return !!document.querySelector(".wf-" + e + "-n4-active")
}, TM.common.mergeObjects = function(t, e) {
    for (var r = {}, n = [t, e], o = 0; o < n.length; o++)
        for (var i in n[o]) r[i] = n[o][i];
    return r
}, TM.IObject = function(t, e) {
    this.isActive = null, this.data = TM.common.mergeObjects(this.data, t), e || this.init()
}, TM.IObject.prototype.init = function() {
    this._init(), this.isActive = !0
}, TM.IObject.prototype.inactivate = function() {
    this._inactivate(), this.isActive = !1
}, TM.IObject.prototype._init = function() {}, TM.IObject.prototype._inactivate = function() {}, TM.Interval = function(t, e) {
    this.data = {}, this.speed = t, this.func = e, this.intervalId = null, TM.IObject.call(this, null, !0)
}, TM.Interval.prototype = Object.create(TM.IObject.prototype), TM.Interval.prototype.constructor = TM.Interval, TM.Interval.prototype._init = function() {
    this.stopInterval(), this.startInterval()
}, TM.Interval.prototype._inactivate = function() {
    this.stopInterval()
}, TM.Interval.prototype.setSpeed = function(t) {
    this.speed = t, this.stopInterval(), this.init()
}, TM.Interval.prototype.stopInterval = function() {
    this.intervalId && window.clearInterval(this.intervalId), this.intervalId = null
}, TM.Interval.prototype.startInterval = function() {
    var t = this;
    this.intervalId = window.setInterval(function() {
        t.func()
    }, this.speed)
}, TM.ILoopObject = function(t, e, r) {
    this.speed = t;
    var n = this;
    this.interval = new TM.Interval(this.speed, function() {
        n.isActive && n.calculate(), n.isActive && n.draw()
    }), TM.IObject.call(this, e, r)
}, TM.ILoopObject.prototype = Object.create(TM.IObject.prototype), TM.ILoopObject.prototype.constructor = TM.ILoopObject, TM.ILoopObject.prototype.init = function() {
    TM.IObject.prototype.init.call(this), this.interval.init(), this.draw()
}, TM.ILoopObject.prototype.inactivate = function() {
    TM.IObject.prototype.inactivate.call(this), this.interval.inactivate()
}, TM.ILoopObject.prototype.calculate = function() {
    this._calculate()
}, TM.ILoopObject.prototype.draw = function() {
    this._draw()
}, TM.ILoopObject.prototype._init = function() {}, TM.ILoopObject.prototype._inactivate = function() {}, TM.ILoopObject.prototype._calculate = function() {}, TM.ILoopObject.prototype._draw = function() {}, TM.IProgram = function(t, e, r) {
    this.loopCount = 0, this.objects = TM.common.mergeObjects(this.objects, r), TM.ILoopObject.call(this, t, e, !0)
}, TM.IProgram.prototype = Object.create(TM.ILoopObject.prototype), TM.IProgram.prototype.constructor = TM.IProgram, TM.IProgram.prototype.init = function() {
    TM.ILoopObject.prototype.init.call(this), this.loopCount = 0
}, TM.IProgram.prototype.inactivate = function() {
    TM.ILoopObject.prototype.inactivate.call(this);
    for (var t in this.objects)
        if (Array.isArray(this.objects[t]))
            for (var e = this.objects[t].length - 1; e >= 0; e--) this.objects[t][e].inactivate();
        else this.objects[t] && this.objects[t].inactivate()
}, TM.IProgram.prototype.calculate = function() {
    TM.ILoopObject.prototype.calculate.call(this), this.loopCount++, this.timeline(this.loopCount), this.getInput()
}, TM.IProgram.prototype.draw = function() {
    TM.ILoopObject.prototype.draw.call(this), this._draw()
}, TM.IProgram.prototype.timeline = function(t) {
    this._timeline(t)
}, TM.IProgram.prototype.getInput = function() {
    this._getInput()
}, TM.IProgram.prototype._init = function() {}, TM.IProgram.prototype._inactivate = function() {}, TM.IProgram.prototype._calculate = function() {}, TM.IProgram.prototype._draw = function() {}, TM.IProgram.prototype._timeline = function(t) {}, TM.IProgram.prototype._getInput = function() {}, TM.ScreenManager_Char = function(t, e, r, n, o) {
    this.screenSetting = t, this.char = e, this.isFullwidth = r, this.color = n || t.fontColor, this.backgroundColor = o || t.backgroundColor, this.font = t.fontFamily, this.isNew = !0, TM.IObject.call(this)
}, TM.ScreenManager_Char.prototype = Object.create(TM.IObject.prototype), TM.ScreenManager_Char.prototype.constructor = TM.ScreenManager_Char, TM.ScreenManager_Char.prototype._init = function() {}, TM.ScreenManager_Char.prototype._inactivate = function() {}, TM.ScreenManager_Char.prototype.update = function(t, e, r, n) {
    this.char = t || " ", this.fullwidth = e || !1, this.color = r || this.screenSetting.fontColor, this.backgroundColor = n || this.screenSetting.backgroundColor, this.isNew = !0
}, TM.ScreenManager_Cursor = function(t) {
    this.speed = 500, this.data = {
        refScreenManager: void 0,
        x: 0,
        y: 0,
        xMax: void 0,
        yMax: void 0,
        width: this.blockWidth,
        size: .1,
        isHidden: !1,
        isUpdated: !0
    }, TM.ILoopObject.call(this, this.speed, t)
}, TM.ScreenManager_Cursor.prototype = Object.create(TM.ILoopObject.prototype), TM.ScreenManager_Cursor.prototype.constructor = TM.ScreenManager_Cursor, TM.ScreenManager_Cursor.prototype._init = function() {
    this.data.isHidden = !1
}, TM.ScreenManager_Cursor.prototype._inactivate = function() {
    this.data.isHidden = !0, this.data.isUpdated = !0
}, TM.ScreenManager_Cursor.prototype._calculate = function() {
    this.data.isHidden = !this.data.isHidden, this.data.isUpdated = !0
}, TM.ScreenManager_Cursor.prototype._draw = function() {}, TM.ScreenManager_Cursor.prototype.move = function(t, e) {
    var r = !1;
    if (t >= 0 && t <= this.data.xMax && e >= 0 && e <= this.data.yMax) {
        var n = this.data.refScreenManager;
        n.screenData[this.data.y + n.scrollOffsetY][this.data.x].isNew = !0, r = !0, this.data.x = t, this.data.y = e
    }
    return r
}, TM.ScreenManager_Cursor.prototype.hide = function() {
    this.inactivate()
}, TM.ScreenManager_Cursor.prototype.show = function() {
    this.init()
}, TM.ScreenManager = function(t, e) {
    this.screenSetting = TM.common.mergeObjects(TM.defaultSettings.screen, t), this.charGroups = TM.common.mergeObjects(TM.defaultSettings.charGroups, e), this.speed = this.screenSetting.frameSpeed;
    try {
        if (this.canvas = document.querySelector("#" + this.screenSetting.canvasId), !this.canvas) throw "[#" + this.screenSetting.canvasId + "] does not exist! ";
        if ("CANVAS" !== this.canvas.tagName) throw "[#" + this.screenSetting.canvasId + "] is not a canvas! "
    } catch (t) {
        return this.isActive = !1, void console.error("new TM.ScreenManager ERROR: " + t + " TM.ScreenManager is not created correctly.")
    }
    this.isFontLoaded = !1, this.screenData = [], this.blockWidth = TM.common.getBlockWidth(this.screenSetting.fontSize), this.blockHeight = TM.common.getBlockHeight(this.screenSetting.fontSize), this.canvas.width = this.blockWidth * this.screenSetting.column, this.canvas.height = this.blockHeight * this.screenSetting.row, this.canvas.style.border = this.screenSetting.backgroundColor + " 1px solid", this.canvas.style.borderRadius = "5px", this.canvas.style.backgroundColor = this.screenSetting.backgroundColor, this.canvas.style.width = this.canvas.width * this.screenSetting.zoom + "px", this.canvas.style.height = this.canvas.height * this.screenSetting.zoom + "px", this.canvas.tabIndex = 1, this.canvas.style.outline = "none", this.ctx = this.canvas.getContext("2d"), this.scrollOffsetY = 0, this.cursor = new TM.ScreenManager_Cursor({
        refScreenManager: this,
        xMax: this.screenSetting.column - 1,
        yMax: this.screenSetting.row - 1,
        color: "gray",
        width: this.blockWidth,
        size: .1
    }), this.FullwidthRegex = TM.common.getFullwidthRegex(this.charGroups), TM.ILoopObject.call(this, this.speed)
}, TM.ScreenManager.prototype = Object.create(TM.ILoopObject.prototype), TM.ScreenManager.prototype.constructor = TM.ScreenManager, TM.ScreenManager.prototype._init = function() {
    this.resetScreenData(), this.screenSetting.fontSource && !TM.common.checkFontLoadedByWebFont(this.screenSetting.fontFamily) && this.startLoadingFont()
}, TM.ScreenManager.prototype._inactivate = function() {}, TM.ScreenManager.prototype._calculate = function() {
    !this.isFontLoaded && TM.common.checkFontLoadedByWebFont(this.screenSetting.fontFamily) && (this.isFontLoaded = !0, this.drawLoading(!0), this.cursor.move(0, 0), this.refreshScreen()), this.checkReady() ? this.onReadyFunc && (this.onReadyFunc(), delete this.onReadyFunc) : this.drawLoading()
}, TM.ScreenManager.prototype._draw = function() {
    var t = this.ctx;
    t.textBaseline = "buttom";
    for (var e = this.getNewBgUpdateMap(), r = this.scrollOffsetY; r < this.scrollOffsetY + this.screenSetting.row; r++)
        for (var n = 0; n < this.screenSetting.column; n++) {
            if (!0 === this.screenData[r][n].isNew) {
                if (!e[r][n]) {
                    var o = this.blockWidth * n,
                        i = this.blockHeight * (r - this.scrollOffsetY),
                        a = this.getBackgroundWidthRecursive(r, n, e),
                        s = this.blockHeight;
                    t.fillStyle = this.screenData[r][n].backgroundColor, t.fillRect(o, i, a, s)
                }
                if (this.screenData[r][n].char && "$" != this.screenData[r][n].char[0]) {
                    var c = this.blockWidth * n,
                        h = this.blockHeight * (r - this.scrollOffsetY) + .8 * this.blockHeight,
                        p = TM.common.getCharGroup(this.charGroups, this.screenData[r][n].char);
                    p ? (t.font = this.screenSetting.fontSize * p.sizeAdj + "px " + this.screenData[r][n].font, c += this.blockWidth * p.xAdj, h += this.blockHeight * p.yAdj) : t.font = this.screenSetting.fontSize + "px " + this.screenData[r][n].font, t.fillStyle = this.screenData[r][n].color, t.fillText(this.screenData[r][n].char[0], c, h)
                }
                this.screenData[r][n].isNew = !1
            }
            if (!this.screenData[r][n].isActive && "$off" != this.screenData[r][n].char) {
                this.screenData[r][n].char = "$off", this.screenData[r][n].backgroundColor = this.screenSetting.backgroundColor;
                var u = this.blockWidth * n,
                    l = this.blockHeight * (r - this.scrollOffsetY),
                    d = this.blockWidth,
                    g = this.blockHeight;
                t.fillStyle = this.screenData[r][n].backgroundColor, t.fillRect(u, l, d, g)
            }
        }
    var M = this.cursor.data;
    if (M.isUpdated)
        if (M.isUpdated = !1, M.isHidden) this.screenData[M.y + this.scrollOffsetY][M.x].isNew = !0;
        else {
            var f = M.width,
                y = this.blockHeight * M.size,
                T = this.blockWidth * M.x,
                S = this.blockHeight * M.y + (this.blockHeight - y),
                v = this.screenSetting.fontColor;
            t.fillStyle = v, t.fillRect(T, S, f, y)
        }
}, TM.ScreenManager.prototype.startLoadingFont = function() {
    if (!this.screenSetting.webFontJsPath) return console.error("TM.ScreenManager ERROR: 'webFontJsPath' is required to load font from 'fontSource'!");
    window.WebFont ? this.loadWebFont() : TM.common.includeScript(this.screenSetting.webFontJsPath, this.loadWebFont())
}, TM.ScreenManager.prototype.loadWebFont = function() {
    var t = this;
    return function() {
        var e = document.createElement("link");
        e.rel = "stylesheet", e.href = t.screenSetting.fontSource, document.head.appendChild(e), WebFont.load({
            custom: {
                families: [t.screenSetting.fontFamily],
                urls: [t.screenSetting.fontSource]
            }
        })
    }
}, TM.ScreenManager.prototype.resetScreenData = function() {
    this.screenData = [];
    for (var t = this.scrollOffsetY; t < this.scrollOffsetY + this.screenSetting.row; t++) {
        this.screenData[t] = [];
        for (var e = 0; e < this.screenSetting.column; e++) this.screenData[t][e] = new TM.ScreenManager_Char(this.screenSetting, " ")
    }
}, TM.ScreenManager.prototype.getNewBgUpdateMap = function() {
    for (var t = [], e = this.scrollOffsetY; e < this.scrollOffsetY + this.screenSetting.row; e++) {
        t[e] = [];
        for (var r = 0; r < this.screenSetting.column; r++) t[e][r] = !1
    }
    return t
}, TM.ScreenManager.prototype.getBackgroundWidthRecursive = function(t, e, r) {
    return r[t][e] = !0, e + 1 < this.screenSetting.column && this.screenData[t][e + 1].isNew && this.screenData[t][e].backgroundColor == this.screenData[t][e + 1].backgroundColor ? this.getBackgroundWidthRecursive(t, e + 1, r) + this.blockWidth : this.blockWidth
}, TM.ScreenManager.prototype.refreshScreen = function() {
    for (var t = 0; t < this.screenData.length; t++)
        for (var e = 0; e < this.screenData[t].length; e++) this.screenData[t][e].isNew = !0
}, TM.ScreenManager.prototype.isInScreen = function(t, e) {
    var r = !1;
    return t >= 0 && e >= 0 && e < this.screenSetting.row && t < this.screenSetting.column && (r = !0), r
}, TM.ScreenManager.prototype.insertChar = function(t, e, r) {
    var n = this.cursor.data.x,
        o = this.cursor.data.y,
        i = this.cursor.data.x,
        a = this.cursor.data.y + this.scrollOffsetY;
    if (this.isInScreen(n, o)) {
        if (this.screenData[a][i].char != t || this.screenData[a][i].color != (e || this.screenSetting.fontColor) || this.screenData[a][i].backgroundColor != (r || this.screenSetting.backgroundColor) || "$" == this.screenData[a][i].char[0] && this.screenData[a][i - 1].isNew) {
            var s = this.FullwidthRegex,
                c = !!s && s.test(t);
            this.screenData[a][i].update(t, c, e, r), this.isInScreen(n - 1, o) && (this.screenData[a][i - 1].draw = !0), this.isInScreen(n + (c ? 2 : 1), o) && (this.screenData[a][i + (c ? 2 : 1)].draw = !0)
        }
        n + 1 >= this.screenSetting.column && o + 1 < this.screenSetting.row ? this.cursor.move(0, o + 1) : n + 1 >= this.screenSetting.column && o + 1 >= this.screenSetting.row ? (this.cursor.move(0, o), this.scrollDown()) : this.cursor.move(n + 1, o)
    }
}, TM.ScreenManager.prototype.drawLoading = function(t) {
    t ? this.deleteTextAt(0, 0, "Loading...") : this.insertTextAt(0, 0, "Loading...")
}, TM.ScreenManager.prototype.onReady = function(t) {
    this.checkReady() ? this.onReadyFunc() : this.onReadyFunc = t
}, TM.ScreenManager.prototype.checkReady = function() {
    return !this.screenSetting.fontSource || this.isFontLoaded
}, TM.ScreenManager.prototype.fillScreen = function(t, e, r) {
    for (var n = this.scrollOffsetY; n < this.scrollOffsetY + this.screenSetting.row; n++)
        for (var o = 0; o < this.screenSetting.column; o++) this.screenData[n][o].update(t, !1, e, r)
}, TM.ScreenManager.prototype.scrollDown = function() {
    var t = this.scrollOffsetY + this.screenSetting.row;
    if (!this.screenData[t]) {
        this.screenData[t] = [];
        for (var e = 0; e < this.screenSetting.column; e++) this.screenData[t][e] = new TM.ScreenManager_Char(this.screenSetting, " ")
    }
    this.scrollOffsetY++, this.refreshScreen()
}, TM.ScreenManager.prototype.scrollUp = function() {
    this.scrollOffsetY > 0 && this.scrollOffsetY--, this.refreshScreen()
}, TM.ScreenManager.prototype.clearScreen = function() {
    this.fillScreen(" ")
}, TM.ScreenManager.prototype.insertText = function(t, e, r) {
    var n = this.FullwidthRegex;
    n && (t = t.toString().replace(n, "$1 "));
    for (var o = this.cursor.data.x, i = this.cursor.data, a = 0; a < t.length; a++) switch (t[a]) {
        case "\n":
            i.y + 1 < this.screenSetting.row ? this.cursor.move(o, i.y + 1) : (this.cursor.move(o, i.y), this.scrollDown());
            break;
        case "\r":
            this.cursor.move(0, i.y);
            break;
        default:
            var s = !!n && n.test(t[a]);
            this.insertChar(t[a], e, r), s && (a++, this.insertChar("$fullwidthFiller", e, r))
    }
}, TM.ScreenManager.prototype.insertTextAt = function(t, e, r, n, o) {
    this.cursor.move(t, e) && this.insertText(r, n, o)
}, TM.ScreenManager.prototype.deleteText = function(t) {
    var e = this.FullwidthRegex;
    t = t.toString().replace(e, "$1 "), this.insertText(t.replace(/./g, " "))
}, TM.ScreenManager.prototype.deleteTextAt = function(t, e, r) {
    this.cursor.move(t, e) && this.deleteText(r)
}, TM.ScreenManager.prototype.copyScreen = function() {
    var t = document.createElement("canvas"),
        e = t.getContext("2d");
    return t.width = this.canvas.width, t.height = this.canvas.height, e.drawImage(this.canvas, 0, 0), t
}, TM.ScreenManager.prototype.pasteScreen = function(t) {
    this.ctx.drawImage(t, 0, 0)
}, TM.ScreenManager.prototype.consoleScreenData = function(t) {
    for (var e = this.scrollOffsetY; e < this.scrollOffsetY + this.screenSetting.row; e++) {
        for (var r = "", n = 0; n < this.screenSetting.column; n++) r += this.screenData[e][n].char[0] + (this.screenData[e][n].isNew ? "!" : " ");
        console.log(r)
    }
}, TM.InputManager_Keyboard = function(t) {
    this.refInputManager = t, this.keyState = {}, this.keyPressed = {};
    var e = this;
    this.eventHandlers = {
        keydown: function(t) {
            t.preventDefault(), e.refInputManager.isActive && e.isActive && (e.keyState[t.keyCode] = !0, e.keyPressed[t.keyCode] = !0), e.refInputManager.devMode && console.log("Keyboard Key Pressed keyCode: ", t.keyCode)
        },
        keyup: function(t) {
            t.preventDefault(), delete e.keyState[t.keyCode]
        }
    }, TM.IObject.call(this)
}, TM.InputManager_Keyboard.prototype = Object.create(TM.IObject.prototype), TM.InputManager_Keyboard.prototype.constructor = TM.InputManager_Keyboard, TM.InputManager_Keyboard.prototype._init = function() {
    this.refInputManager.targetDom.addEventListener("keydown", this.eventHandlers.keydown), this.refInputManager.targetDom.addEventListener("keyup", this.eventHandlers.keyup)
}, TM.InputManager_Keyboard.prototype._inactivate = function() {}, TM.InputManager_Keyboard.prototype.checkKeyState = function(t) {
    return !!this.keyState[t]
}, TM.InputManager_Keyboard.prototype.checkKeyStateAny = function() {
    return !!Object.keys(this.keyState).length
}, TM.InputManager_Keyboard.prototype.removeKeyState = function(t) {
    delete this.keyState[t]
}, TM.InputManager_Keyboard.prototype.clearKeyState = function() {
    this.keyState = {}
}, TM.InputManager_Keyboard.prototype.checkKeyPressed = function(t) {
    return !!this.keyPressed[t] && (delete this.keyPressed[t], !0)
}, TM.InputManager_Keyboard.prototype.checkKeyPressedAny = function() {
    return !!Object.keys(this.keyPressed).length && (this.keyPressed = {}, !0)
}, TM.InputManager_Keyboard.prototype.removeKeyPressed = function(t) {
    delete this.keyPressed[t]
}, TM.InputManager_Keyboard.prototype.clearKeyPressed = function() {
    this.keyPressed = {}
}, TM.InputManager_Keyboard.prototype.checkKey = function(t) {
    return this.checkKeyPressed(t) || this.checkKeyState(t)
}, TM.InputManager_Keyboard.prototype.checkKeyAny = function() {
    return this.checkKeyPressedAny() || this.checkKeyStateAny()
}, TM.InputManager_Keyboard.prototype.removeKey = function(t) {
    this.removeKeyPressed(t), this.removeKeyState(t)
}, TM.InputManager_Keyboard.prototype.clearKey = function() {
    this.clearKeyPressed(), this.clearKeyState()
}, TM.InputManager_Keyboard.prototype.getInput = function(t) {
    return prompt(t)
}, TM.InputManager = function(t, e) {
    var r = t || TM.defaultSettings.screen.canvasId;
    try {
        if (this.targetDom = document.querySelector("#" + r), !this.targetDom) throw "[#" + domId + "] does not exist! "
    } catch (t) {
        return this.isActive = !1, void console.error("new TM.InputManager ERROR: " + t + " TM.InputManager is not created.")
    }
    this.devMode = e, this.keyboard = new TM.InputManager_Keyboard(this), TM.IObject.call(this)
}, TM.InputManager.prototype = Object.create(TM.IObject.prototype), TM.InputManager.prototype.constructor = TM.InputManager, TM.InputManager.prototype._init = function() {}, TM.InputManager.prototype._inactivate = function() {}, TM.DebugManager = function(t) {
    this.debugSetting = TM.common.mergeObjects(TM.defaultSettings.debug, t);
    try {
        if (this.outputDom = document.querySelector("#" + this.debugSetting.outputDomId), !this.outputDom) throw "[#" + this.debugSetting.outputDomId + "] does not exist! "
    } catch (t) {
        return this.isActive = !1, void console.error("new TM.DebugManager ERROR: " + t + " TM.DebugManager is not created.")
    }
    this.doms = {}, TM.IObject.call(this)
}, TM.DebugManager.prototype = Object.create(TM.IObject.prototype), TM.DebugManager.prototype.constructor = TM.DebugManager, TM.DebugManager.prototype._init = function() {}, TM.DebugManager.prototype._inactivate = function() {
    this.deleteAll()
}, TM.DebugManager.prototype.replacer = function() {
    var t = [];
    return function(e, r) {
        if (r && "object" == typeof r) {
            if (t.indexOf(r) > -1) return "[Circular]"
        }
        return t.push(r), r
    }
}, TM.DebugManager.prototype.print = function(t, e) {
    if (this.debugSetting.devMode && this.isActive) {
        this.doms[t] || (this.doms[t] = document.createElement("pre"), this.outputDom.appendChild(this.doms[t]));
        var r = "-- " + t + " --\n",
            n = JSON.stringify(e, this.replacer(e), 2);
        this.doms[t].innerHTML = r + n
    } else this.delete(t)
}, TM.DebugManager.prototype.delete = function(t) {
    this.doms[t] && (this.doms[t].remove ? this.doms[t].remove() : this.doms[t].parentElement.removeChild(this.doms[t]), delete this.doms[t])
}, TM.DebugManager.prototype.deleteAll = function() {
    for (var t in this.doms) this.delete(t)
};