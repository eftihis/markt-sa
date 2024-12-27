!function(D, u) {
    "use strict";
    "object" == typeof exports && "undefined" != typeof module ? u(exports) : "function" == typeof define && define.amd ? define(["exports"], u) : u((D = D || self).window = D.window || {})
}(this, function(u) {
    "use strict";
    var b = /([\uD800-\uDBFF][\uDC00-\uDFFF](?:[\u200D\uFE0F][\uD800-\uDBFF][\uDC00-\uDFFF]){2,}|\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])/;

    var U, e, t, i, s, r, o, S = /(?:\r|\n|\t\t)/g,
        _ = /(?:\s\s+)/g,
        m = String.fromCharCode(160),
        l = "SplitText";

    function n(D) {
        U = document, 
        e = window, 
        (i = i || D || e.gsap || console.warn("Please gsap.registerPlugin(SplitText)")) && (r = i.utils.toArray, s = i.core.context || function() {}, t = 1)
    }

    function q() {
        return String.fromCharCode.apply(null, arguments)
    }

    function v(D) {
        return e.getComputedStyle(D)
    }

    function w(D) {
        return "absolute" === D.position || !0 === D.absolute
    }

    function x(D, u) {
        for (var e, t = u.length; - 1 < --t;)
            if (e = u[t], D.substr(0, e.length) === e) return e.length
    }

    function z(D, u) {
        void 0 === D && (D = "");
        var e = ~D.indexOf("++"),
            t = 1;
        return e && (D = D.split("++").join("")),
            function() {
                return "<" + u + " style='position:relative;display:inline-block;'" + (D ? " class='" + D + (e ? t++ : "") + "'>" : ">")
            }
    }

    function A(D, u, e) {
        var t = D.nodeType;
        if (1 === t || 9 === t || 11 === t)
            for (D = D.firstChild; D; D = D.nextSibling) A(D, u, e);
        else 3 !== t && 4 !== t || (D.nodeValue = D.nodeValue.split(u).join(e))
    }

    function B(D, u) {
        for (var e = u.length; - 1 < --e;) D.push(u[e])
    }

    function C(D, u, e) {
        for (var t; D && D !== u;) {
            if (t = D._next || D.nextSibling) return t.textContent.charAt(0) === e;
            D = D.parentNode || D._parent
        }
    }

    function D(u) {
        var e, t, F = r(u.childNodes),
            i = F.length;
        for (e = 0; e < i; e++)(t = F[e])._isSplit ? D(t) : e && t.previousSibling && 3 === t.previousSibling.nodeType ? (t.previousSibling.nodeValue += 3 === t.nodeType ? t.nodeValue : t.firstChild.nodeValue, u.removeChild(t)) : 3 !== t.nodeType && (u.insertBefore(t.firstChild, t), u.removeChild(t))
    }

    function E(D, u) {
        return parseFloat(u[D]) || 0
    }

    function F(u, e, t, F, i, n, s) {
        var r, o, l, d, a, p, h, f, c, g, x, y, b = v(u),
            S = E("paddingLeft", b),
            _ = -999,
            m = E("borderBottomWidth", b) + E("borderTopWidth", b),
            q = E("borderLeftWidth", b) + E("borderRightWidth", b),
            T = E("paddingTop", b) + E("paddingBottom", b),
            N = E("paddingLeft", b) + E("paddingRight", b),
            L = E("fontSize", b) * (e.lineThreshold || .2),
            W = b.textAlign,
            H = [],
            O = [],
            j = [],
            k = e.wordDelimiter || " ",
            V = e.tag ? e.tag : e.span ? "span" : "div",
            M = e.type || e.split || "chars,words,lines",
            R = i && ~M.indexOf("lines") ? [] : null,
            P = ~M.indexOf("words"),
            z = ~M.indexOf("chars"),
            G = w(e),
            $ = e.linesClass,
            I = ~($ || "").indexOf("++"),
            J = [],
            K = "flex" === b.display,
            Q = u.style.display;

        for (I && ($ = $.split("++").join("")), K && (u.style.display = "block"), l = (o = u.getElementsByTagName("*")).length, a = [], r = 0; r < l; r++) a[r] = o[r];

        if (R || G)
            for (r = 0; r < l; r++)((p = (d = a[r]).parentNode === u) || G || z && !P) && (y = d.offsetTop, R && p && Math.abs(y - _) > L && ("BR" !== d.nodeName || 0 === r) && (h = [], R.push(h), _ = y), G && (d._x = d.offsetLeft, d._y = y, d._w = d.offsetWidth, d._h = d.offsetHeight), R && ((d._isSplit && p || !z && p || P && p || !P && d.parentNode.parentNode === u && !d.parentNode._isSplit) && (h.push(d), d._x -= S, C(d, u, k) && (d._wordEnd = !0)), "BR" === d.nodeName && (d.nextSibling && "BR" === d.nextSibling.nodeName || 0 === r) && R.push([])));

        for (r = 0; r < l; r++)
            if (p = (d = a[r]).parentNode === u, "BR" !== d.nodeName)
                if (G && (c = d.style, P || p || (d._x += d.parentNode._x, d._y += d.parentNode._y), c.left = d._x + "px", c.top = d._y + "px", c.position = "absolute", c.display = "block", c.width = d._w + 1 + "px", c.height = d._h + "px"), !P && z)
                    if (d._isSplit)
                        for (d._next = o = d.nextSibling, d.parentNode.appendChild(d); o && 3 === o.nodeType && " " === o.textContent;) d._next = o.nextSibling, d.parentNode.appendChild(o), o = o.nextSibling;
                    else d.parentNode._isSplit ? (d._parent = d.parentNode, !d.previousSibling && d.firstChild && (d.firstChild._isFirst = !0), d.nextSibling && " " === d.nextSibling.textContent && !d.nextSibling.nextSibling && J.push(d.nextSibling), d._next = d.nextSibling && d.nextSibling._isFirst ? null : d.nextSibling, d.parentNode.removeChild(d), a.splice(r--, 1), l--) : p || (y = !d.nextSibling && C(d.parentNode, u, k), d.parentNode._parent && d.parentNode._parent.appendChild(d), y && d.parentNode.appendChild(U.createTextNode(" ")), "span" === V && (d.style.display = "inline"), H.push(d));
        else d.parentNode._isSplit && !d._isSplit && "" !== d.innerHTML ? O.push(d) : z && !d._isSplit && ("span" === V && (d.style.display = "inline"), H.push(d));
        else R || G ? (d.parentNode && d.parentNode.removeChild(d), a.splice(r--, 1), l--) : P || u.appendChild(d);

        for (r = J.length; - 1 < --r;) J[r].parentNode.removeChild(J[r]);
        if (R) {
            for (G && (g = U.createElement(V), u.appendChild(g), x = g.offsetWidth + "px", y = g.offsetParent === u ? 0 : u.offsetLeft, u.removeChild(g)), c = u.style.cssText, u.style.cssText = "display:none;"; u.firstChild;) u.removeChild(u.firstChild);
            for (f = " " === k && (!G || !P && !z), r = 0; r < R.length; r++) {
                for (h = R[r], (g = U.createElement(V)).style.cssText = "display:block;text-align:" + W + ";position:" + (G ? "absolute;" : "relative;"), $ && (g.className = $ + (I ? r + 1 : "")), j.push(g), l = h.length, o = 0; o < l; o++) "BR" !== h[o].nodeName && (d = h[o], g.appendChild(d), f && d._wordEnd && g.appendChild(U.createTextNode(" ")), G && (0 === o && (g.style.top = d._y + "px", g.style.left = S + y + "px"), d.style.top = "0px", y && (d.style.left = d._x - y + "px")));
                0 === l ? g.innerHTML = "&nbsp;" : P || z || (D(g), A(g, String.fromCharCode(160), " ")), G && (g.style.width = x, g.style.height = d._h + "px"), u.appendChild(g)
            }
            u.style.cssText = c
        }
        G && (s > u.clientHeight && (u.style.height = s - T + "px", u.clientHeight < s && (u.style.height = s + m + "px")), n > u.clientWidth && (u.style.width = n - N + "px", u.clientWidth < n && (u.style.width = n + q + "px"))), K && (Q ? u.style.display = Q : u.style.removeProperty("display")), B(t, H), P && B(F, O), B(i, j)
    }

    function G(D, u, e, t) {
        function sb(D) {
            return D === p || D === m && " " === p
        }
        var F, i, n, C, s, E, r, o, l = u.tag ? u.tag : u.span ? "span" : "div",
            d = ~(u.type || u.split || "chars,words,lines").indexOf("chars"),
            a = w(u),
            p = u.wordDelimiter || " ",
            h = " " !== p ? "" : a ? "&#173; " : " ",
            f = "</" + l + ">",
            B = 1,
            c = u.specialChars ? "function" == typeof u.specialChars ? u.specialChars : x : null,
            g = U.createElement("div"),
            y = D.parentNode;

        for (y.insertBefore(g, D), g.textContent = D.nodeValue, y.removeChild(D), r = -1 !== (F = function getText(D) {
                var u = D.nodeType,
                    e = "";
                if (1 === u || 9 === u || 11 === u) {
                    if ("string" == typeof D.textContent) return D.textContent;
                    for (D = D.firstChild; D; D = D.nextSibling) e += getText(D)
                } else if (3 === u || 4 === u) return D.nodeValue;
                return e
            }(D = g)).indexOf("<"), !1 !== u.reduceWhiteSpace && (F = F.replace(_, " ").replace(S, "")), r && (F = F.split("<").join("{{LT}}")), s = F.length, i = (" " === F.charAt(0) ? h : "") + e(), n = 0; n < s; n++)
            if (E = F.charAt(n), c && (o = c(F.substr(n), u.specialChars))) E = F.substr(n, o || 1), i += d && " "
