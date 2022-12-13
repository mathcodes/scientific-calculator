
// Minimal calculator implementation. Globals for our current algebra, mode, history, variables etc ..  
var Al = Algebra(), mode = 0, histor = '', cur = '', store = false, help = false, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10;

// Grab some of our elements.  
var graph = document.getElementById('graph'); graph.style.opacity = 0.3;
var hist = document.getElementById('hist');
var title = document.getElementById('title');

// Pretty print into the numerical and graphical displays.  
var show = (x) => {
  x = x.replace(/e([012345]+)/g, 'e<sub>$1</sub>').replace(/&/g, '&#x2228;').replace(/\^/g, '&#x2227;').replace(/\<\</, '&#x25cf;')
  document.getElementById('screen').innerHTML = x || '0';
  if ((mode == 3 || mode == 4 || mode == 5) && [x1, x2, x3, x4, x5].filter(x => x).length) {
    var options = {}; if (mode == 5) options.conformal = true;
    while (graph.firstChild) graph.removeChild(graph.firstChild);
    var c = graph.appendChild(Al.graph([x1, x2, x3, x4, x5].filter(x => x).map(x => x.slice()), options))
    c.style.width = c.style.height = '100%'; c.style.backgroundColor = 'transparent';
  }
}

// Print into the history.  
var print = (x) => {
  histor += '<BR>' + x;
  hist.innerHTML = histor.split('<BR>').slice(-10).join('<BR>');
}

// Patch up of ganja.js asciimath output to our input format.  
var patch = (x) => {
  print((((!x.match(/=/)) ? cur + '=' : '') + x).replace(/i/g, 'e_1').replace(/([^\d])e_|^e_/g, '$11e_').replace(/e_/g, 'e').replace(/e([012345]+)/g, 'e<sub>$1</sub>').replace(/&/g, '&#x2228;').replace(/\^/g, '&#x2227;').replace(/\<\</, '&#x25cf;'));
  return x.replace(/([^\d]*\d*\.\d\d\d\d\d\d)(\d*)/g, '$1').replace(/i/g, 'e_1').replace(/([^\d])e_|^e_/g, '$11e_').replace(/e_/g, 'e');
}

// Helper to display pretty help.
var toHelp = (x) => x.replace(/([eE])(\d+)/g, '<i>$1<SUB>$2</SUB></i>').replace(/_([\+\-\/\?\(\)])/g, '<i class="blue">$1</i>').replace(/_\^/g, '<i class="blue">&#x2227;</i>').replace(/_\&/g, '<i class="blue">&#x2228;</i>').replace(/_\./g, '<i class="blue">&#x25cf;</i>').replace(/_\*/g, '<i class="blue">&#x2217;</i>');

// Welcome message 
function hello() {
  print(toHelp(`<DIV><img src="https://www.jonchristie.net/favicon.png" style="display: flex"; width="50px"/></DIV><DIV class="help" style="position:relative"><HR>Cheat sheet : _? + <i class="green" STYLE="width:40px">P2D</i>,<i class="green" STYLE="width:40px">P3D</i> &nbsp;<BR>Examples : _? + <I>1</I>, <I>2</I>, <i>3</i>, <i>4</i>&nbsp;<HR>`))
};
hello();

// Our calculator buttons.   
var buttons = {
  // metric selection.
  "R": { color: 'green', label: "<SPAN CLASS='outline'>R</SPAN>", click: () => { E(); e(); Al = Algebra(); graph.style.opacity = 0.3; hist.style.visibility = 'visible'; mode = 0; title.innerHTML = "<SPAN CLASS='outline'>R</SPAN>"; }, help: "<I CLASS='outline'>R</I>: Real Numbers." },
  "C": { color: 'green', label: "<SPAN CLASS='outline'>C</SPAN><DIV CLASS='mini'>0,1</DIV>", click: () => { mode = 1; E(); e(0, 1, 0, 0, 0, 0); Al = Algebra(0, 1); graph.style.opacity = 0.3; hist.style.visibility = 'visible'; title.innerHTML = "<SPAN CLASS='outline'>C</SPAN> - <SPAN CLASS='outline'>R</SPAN><sub>0,1</sub>"; }, help: '<I CLASS="outline">C</I>: Complex Numbers.' },
  "D": { color: 'green', label: "<SPAN CLASS='outline'>D</SPAN><DIV CLASS='mini'>0,0,1</DIV>", click: () => { mode = 7; E(); e(1, 0, 0, 0, 0, 0); Al = Algebra(0, 0, 1); graph.style.opacity = 0.3; hist.style.visibility = 'visible'; title.innerHTML = "<SPAN CLASS='outline'>D</SPAN> - <SPAN CLASS='outline'>R</SPAN><sub>0,0,1</sub>"; }, help: '<I CLASS="outline">D</I>: Dual Numbers.' },
  "M": { color: 'green', label: "<SPAN CLASS='outline'>M</SPAN><DIV CLASS='mini'>1,3</DIV>", click: () => { mode = 2; E(0, 1, 1, 1, 1, 0); Al = Algebra(1, 3); graph.style.opacity = 0.3; hist.style.visibility = 'visible'; title.innerHTML = "<SPAN CLASS='outline'>M</SPAN> - <SPAN CLASS='outline'>R</SPAN><sub>1,3</sub>"; }, help: '<I CLASS="outline">M</I> : <I CLASS="outline">R</I><SUB>1,3</SUB> : Minkowski spacetime.' },
  "P2D": { color: 'green', label: "P2D<DIV CLASS='mini'>2,0,1</DIV>", click: () => { mode = 3; E(1, 1, 1, 0, 0, 0); Al = Algebra(2, 0, 1); graph.style.opacity = 1; hist.style.visibility = 'visible'; title.innerHTML = "P2D - P(<SPAN CLASS='outline'>R</SPAN>*<sub>2,0,1</sub>)"; }, help: toHelp(`PGA2D Cheat Sheet<HR><TABLE CLASS="help" STYLE="position:relative; display:table" WIDTH=100%><TR><TD>point at (x,y)<TD>E0_-xE1_+yE2<TR><TD>line ax + by + c = 0<TD>ae1_+be2_+ce0<TR><TD>join points P,Q<TD>P_&Q<TR><TD>intersect lines a,b<TD>a_^b<TR><TD>line through P ortho to a<TD>a_.P<TR><TD>project P onto a<TD>a_.P_*a<TR><TD>line through P parallel to a<TD>a_.P_*P<TR><TD>Rotator &alpha; around P<TD>_(&alpha;_*P_/<i>2</i>_)<i style="width:40px" class="blue">exp</i><TR><TD>Motor x,y<TD><i>1</i>_+xE1_+yE2</TABLE><HR>`) },
  "P3D": { color: 'green', label: "P3D<DIV CLASS='mini'>3,0,1</DIV>", click: () => { mode = 4; E(1, 1, 1, 1, 0, 0); Al = Algebra(3, 0, 1); graph.style.opacity = 1; hist.style.visibility = 'visible'; title.innerHTML = "P3D - P(<SPAN CLASS='outline'>R</SPAN>*<sub>3,0,1</sub>)"; }, help: toHelp(`PGA3D Cheat Sheet<HR><TABLE CLASS="help" STYLE="position:relative; display:table" WIDTH=100%><TR><TD>point at (x,y,z)<TD>E0_-xE1_+yE2_+zE3<TR><TD>plane ax + by + cz + d = 0<TD>ae1_+be2_+ce3_+de0<TR><TD>join elements x,y<TD>x_&y<TR><TD>intersect elements x,y<TD>x_^y<TR><TD>plane through P ortho to a<TD>a_.P<TR><TD>project x onto y<TD>x_.y_*y<TR><TD>plane through P parallel to a<TD>a_.P_*P<TR><TD>Rotator &alpha; around L<TD>_(&alpha;_*L_/<i>2</i>_)<i style="width:40px" class="blue">exp</i><TR><TD>Motor x*2,y*2,z*2<TD><i>1</i>_+xE1_+yE2_+zE3</TABLE><HR>`) },
  "C2D": { color: 'green', label: "C2D<DIV CLASS='mini'>3,1</DIV>", click: () => { mode = 5; E(0, 1, 1, 1, 1, 0); Al = Algebra(3, 1, 0); graph.style.opacity = 1; hist.style.visibility = 'visible'; title.innerHTML = "C2D - C(<SPAN CLASS='outline'>R</SPAN><sub>3,1</sub>)"; }, help: "C(<I CLASS='outline'>R</I><SUB>3,1</SUB>): Conformal 2D Geometric Algebra." },
  "C3D": { color: 'green', label: "C3D<DIV CLASS='mini'>4,1</DIV>", click: () => { mode = 6; E(0, 1, 1, 1, 1, 1); Al = Algebra(4, 1, 0); graph.style.opacity = 0.3; hist.style.visibility = 'visible'; title.innerHTML = "C3D - C(<SPAN CLASS='outline'>R</SPAN><sub>4,1</sub>)"; }, help: "C(<I CLASS='outline'>R</I><SUB>4,1</SUB>): Conformal 3D Geometric Algebra." },
  // basis vectors + store
  "e0": { label: "e0", click: () => { cur += cur.match(/e\d+$/) ? '0' : cur.match(/\d+$/) ? 'e0' : '1e0'; show(cur); }, help: "e<sub>0</sub> basisvector." },
  "e1": { label: "e1", click: () => { cur += cur.match(/e\d+$/) ? '1' : cur.match(/\d+$/) ? 'e1' : '1e1'; show(cur); }, help: "e<sub>1</sub> basisvector." },
  "e2": { label: "e2", click: () => { cur += cur.match(/e\d+$/) ? '2' : cur.match(/\d+$/) ? 'e2' : '1e2'; show(cur); }, help: "e<sub>2</sub> basisvector." },
  "e3": { label: "e3", click: () => { cur += cur.match(/e\d+$/) ? '3' : cur.match(/\d+$/) ? 'e3' : '1e3'; show(cur); }, help: "e<sub>3</sub> basisvector." },
  "e4": { label: "e4", click: () => { cur += cur.match(/e\d+$/) ? '4' : cur.match(/\d+$/) ? 'e4' : '1e4'; show(cur); }, help: "e<sub>4</sub> basisvector." },
  "e5": { label: "e5", click: () => { cur += cur.match(/e\d+$/) ? '5' : cur.match(/\d+$/) ? 'e5' : '1e5'; show(cur); }, help: "e<sub>5</sub> basisvector." },
  "ori": { label: "ori", click: () => { cur += (cur.match(/\d$/) ? '*' : '') + '(.5e3+.5e4)'; show(cur); }, help: "origin : 0.5e<sub>+</sub> + 0.5e<sub>-</sub>" },
  "_?": { color: 'blue', label: "?", click: () => { print('Click any button for help.'); help = true; }, help: "Click help and any button for more help." },
  // basis dual vectors + x1
  "E0": { label: "E0", click: () => { var s = Al.inline('1e0.Dual')().toString().replace('_', ''); cur += cur.match(/e\d+$/) ? '0' : cur.match(/\d+$/) ? s : ('1' + s); show(cur); }, help: "dual of e<sub>0</sub> basisvector." },
  "E1": { label: "E1", click: () => { var s = Al.inline('1e1.Dual')().toString().replace('_', ''); cur += cur.match(/e\d+$/) ? '1' : cur.match(/\d+$/) ? s : ('1' + s); show(cur); }, help: "dual of e<sub>1</sub> basisvector." },
  "E2": { label: "E2", click: () => { var s = Al.inline('1e2.Dual')().toString().replace('_', ''); cur += cur.match(/e\d+$/) ? '2' : cur.match(/\d+$/) ? s : ('1' + s); show(cur); }, help: "dual of e<sub>2</sub> basisvector." },
  "E3": { label: "E3", click: () => { var s = Al.inline('1e3.Dual')().toString().replace('_', ''); cur += cur.match(/e\d+$/) ? '3' : cur.match(/\d+$/) ? s : ('1' + s); show(cur); }, help: "dual of e<sub>3</sub> basisvector." },
  "E4": { label: "E4", click: () => { var s = Al.inline('1e4.Dual')().toString().replace('_', ''); cur += cur.match(/e\d+$/) ? '4' : cur.match(/\d+$/) ? s : ('1' + s); show(cur); }, help: "dual of e<sub>4</sub> basisvector." },
  "E5": { label: "E5", click: () => { var s = Al.inline('1e5.Dual')().toString().replace('_', ''); cur += cur.match(/e\d+$/) ? '5' : cur.match(/\d+$/) ? s : ('1' + s); show(cur); }, help: "dual of e<sub>5</sub> basisvector." },
  "inf": { label: "inf", click: () => { cur += (cur.match(/\d$/) ? '*' : '') + '(1e4-1e3)'; show(cur); }, help: "infinity : e<sub>-</sub> - e<sub>+</sub>" },
  "st": { color: 'purple', label: "st", click: () => { store = true; }, help: "ST : Store variable. (follow by x1 to x10)" },
  // pss, dual, reverse, .. 
  "pss": { label: "pss", click: () => { cur = cur.match(/\d+$/) ? '' : '1' + ['', 'e1', 'e1234', 'e012', 'e0123', 'e1234', 'e12345'][mode]; show(cur); }, help: "Pseudo-Scalar" },
  "inv": { color: 'blue', label: "x<sup>-1</sup>", click: () => { cur += '**-1'; show(cur); }, help: "Inverse" },
  "up": { color: 'blue', label: "&#x21E7;", click: () => { cur += ''; show(cur); }, help: "from euclidean to conformal space" },
  "dwn": { color: 'blue', label: "&#x21E9", click: () => { cur += ''; show(cur); }, help: "from conformal to euclidean space" },
  "dual": { color: 'blue', label: "Dual", click: () => { cur += '.Dual'; show(cur); }, help: "Multivector Dual" },
  "rev": { color: 'blue', label: "Rev", click: () => { cur += '.Reverse'; show(cur); }, help: "Multivector Reverse" },
  "x1": { color: 'purple', label: "x<sub>1</sub>", click: () => { if (store) { store = false; x1 = Al.inline(new Function('return ' + cur))(); patch('x1=' + x1.toString()); return show(cur); } cur += 'x1'; show(cur); }, help: "x1 variable" },
  "x6": { color: 'purple', label: "x<sub>6</sub>", click: () => { if (store) { store = false; x6 = Al.inline(new Function('return ' + cur))(); patch('x6=' + x6.toString()); return show(cur); } cur += 'x6'; show(cur); }, help: "x6 variable" },
  // 7,8,9,-,/,Exp,x2
  "_7": { label: "7", click: () => { cur += '7'; show(cur); } },
  "_8": { label: "8", click: () => { cur += '8'; show(cur); } },
  "_9": { label: "9", click: () => { cur += '9'; show(cur); } },
  "-": { color: 'blue', label: "-", click: () => { cur += '-'; show(cur); }, help: "subtract" },
  "/": { color: 'blue', label: "/", click: () => { cur += '/'; show(cur); }, help: "divide" },
  "Exp": { color: 'blue', label: "Exp", click: () => { cur += '.Exp()'; show(cur); }, help: "exponentiate" },
  "x2": { color: 'purple', label: "x<sub>2</sub>", click: () => { if (store) { store = false; x2 = Al.inline(new Function('return ' + cur))(); patch('x2=' + x2.toString()); return show(cur); } cur += 'x2'; show(cur); }, help: "x2 variable" },
  "x7": { color: 'purple', label: "x<sub>7</sub>", click: () => { if (store) { store = false; x7 = Al.inline(new Function('return ' + cur))(); patch('x7=' + x7.toString()); return show(cur); } cur += 'x7'; show(cur); }, help: "x7 variable" },
  // 4,5,6,+,*,Conjugate,x3
  "_4": { label: "4", click: () => { cur += '4'; show(cur); }, help: 'P(<I CLASS="outline">R</I>*<SUB>2,0,1</SUB>): Projective 2D Geometric Algebra. (euclidian plane).<HR>Solve the system of equations : x+y-0.5=0 and 2x-y=0<HR><DIV class="help" style="position:relative"> <i class="green" STYLE="width:60px">P2D</i><i>e<sub>1</sub></i><i class="blue">+</i><i>e<sub>2</sub></i><i class="blue">-</i><i>0</i><i>.</i><i>5</i><i>e<sub>0</sub></i><i class="purple">ST</i><i class="purple">x1</i><BR><i class="green">Cl</i><i>2</i><i>e<sub>1</sub></i><i class="blue">-</i><i>e<sub>2</sub></i><i class="purple">ST</i><i class="purple">x2</i><BR><i class="green">Cl</i><i class="purple">x1</i><i class="blue">&#x2227;</i><i class="purple">x2</i><i class="purple">ST</i><i class="purple">x3</i><BR><i class="green">Cl</i><i class="purple">x3</i><i class="blue">/</i><i class="blue">(</i><i class="blue">-</i><i>E<sub>0</sub></i><i class="blue">&#x25cf;</i><i class="purple">x3</i><i class="blue">)</i><i class="red">=</i> </DIV><HR>' },
  "_5": { label: "5", click: () => { cur += '5'; show(cur); } },
  "_6": { label: "6", click: () => { cur += '6'; show(cur); } },
  "_+": { color: 'blue', label: "+", click: () => { cur += '+'; show(cur); }, help: "add" },
  "_*": { color: 'blue', label: "&#x2217;", click: () => { cur += '*'; show(cur); }, help: "multiply (Geometric Product)" },
  "Conj": { color: 'blue', label: "Conj", click: () => { cur += '.Conjugate'; show(cur); }, help: "Clifford Conjugate" },
  "x3": { color: 'purple', label: "x<sub>3</sub>", click: () => { if (store) { store = false; x3 = Al.inline(new Function('return ' + cur))(); patch('x3=' + x3.toString()); return show(cur); } cur += 'x3'; show(cur); }, help: "x3 variable" },
  "x8": { color: 'purple', label: "x<sub>8</sub>", click: () => { if (store) { store = false; x8 = Al.inline(new Function('return ' + cur))(); patch('x8=' + x8.toString()); return show(cur); } cur += 'x8'; show(cur); }, help: "x8 variable" },
  // 1,2,3,^,.,(,x4
  "_1": { label: "1", click: () => { cur += '1'; show(cur); }, help: '<I CLASS="outline">C</I>: Complex Numbers.<HR>Example: calculate (3+2i)*(1+4i)<HR><DIV class="help" style="position:relative"><i class="green"><SPAN CLASS="outline">C</SPAN></i><i class="blue">(</i><i>3</i><i class="blue">+</i><i>2</i><i>e<sub>1</sub></i><i class="blue">)</i><i class="blue">*</i><i class="blue">(</i><i>1</i><i class="blue">+</i><i>4</i><i>e<sub>1</sub></i><i class="blue">)</i><i class="red">=</i></DIV><HR>' },
  "_2": { label: "2", click: () => { cur += '2'; show(cur); }, help: '<I CLASS="outline">D</I>: Dual Numbers.<HR>Example: Calculate the value of the function and first derivative at x=3<BR>x<sup>3</sup>-2x<sup>2</sup>+3<HR><DIV class="help" style="position:relative"><i class="green"><SPAN CLASS="outline">D</SPAN></i><i>3</i><i class="blue">+</i><i>e<sub>0</sub></i><i class="purple">ST</i><i class="purple">x1</i><BR><i class="green">Cl</i><i class="purple">x1</i><i class="blue">*</i><i class="purple">x1</i><i class="blue">*</i><i class="purple">x1</i><i class="blue">-</i><i>2</i><i class="blue">*</i><i class="purple">x1</i><i class="blue">*</i><i class="purple">x1</i><i class="blue">+</i><i>3</i><i class="red">=</i></DIV><HR>' },
  "_3": { label: "3", click: () => { cur += '3'; show(cur); }, help: '<I CLASS="outline">M</I> : <I CLASS="outline">R</I><SUB>1,3</SUB> : Minkowski spacetime.<HR>You see two simultaneous lightning strikes in 10 microseconds, one where you are, one 20 km in the x-direction. Are these events simultaneous for a spaceship flying at 0.5c in the x-direction? (given : atanh(0.5)=0.5493)<HR><DIV class="help" style="position:relative"><i class="green"><SPAN CLASS="outline">M</SPAN></i><i>0</i><i>.</i><i>0</i><i>0</i><i>0</i><i>0</i><i>1</i><i>e<sub>1</sub></i><i class="purple">ST</i><i class="purple">x1</i><BR><i class="blue">+</i><i>2</i><i>0</i><i>e<sub>2</sub></i><i class="blue">/</i><i>3</i><i>0</i><i>0</i><i>0</i><i>0</i><i>0</i><i class="purple">ST</i><i class="purple">x2</i><BR><i class="green">Cl</i><i class="blue">(</i><I>0</i><I>.</i><I>5</i><I>4</i><I>9</i><I>3</i><i class="blue">*</i><i>.</i><i>5</i><i>e<sub>1</sub></i><i>e<sub>2</sub></i><i class="blue">)</i><i class="blue" STYLE="width:50px">Exp</i><i class="purple">ST</i><i class="purple">x3</i><BR><i class="green">Cl</i><i class="purple">x3</i><i class="blue">*</i><i class="purple">x1</i><i class="blue">*</i><i class="purple">x3</i><i class="blue">x&#772;</i><i class="purple">ST</i><i class="purple">x4</i><BR><i class="green">Cl</i><i class="purple">x3</i><i class="blue">*</i><i class="purple">x2</i><i class="blue">*</i><i class="purple">x3</i><i class="blue">x&#772;</i><i class="purple">ST</i><i class="purple">x5</i></DIV><HR>' },
  "^": { color: 'blue', label: "&#x2227;", click: () => { cur += '^'; show(cur); }, help: "outer product" },
  ".": { color: 'blue', label: "&#x25cf;", click: () => { cur += '<<'; show(cur); }, help: "inner product (left contraction)" },
  "(": { color: 'blue', label: "(", click: () => { cur += '('; show(cur); } },
  "x4": { color: 'purple', label: "x<sub>4</sub>", click: () => { if (store) { store = false; x4 = Al.inline(new Function('return ' + cur))(); patch('x4=' + x4.toString()); return show(cur); } cur += 'x4'; show(cur); }, help: "x4 variable" },
  "x9": { color: 'purple', label: "x<sub>9</sub>", click: () => { if (store) { store = false; x9 = Al.inline(new Function('return ' + cur))(); patch('x9=' + x9.toString()); return show(cur); } cur += 'x9'; show(cur); }, help: "x9 variable" },
  // Cl,0,.,
  "Cl": { color: 'green', label: "Cl", click: () => { if (cur == '') { if (histor == '') { while (graph.firstChild) graph.removeChild(graph.firstChild); x1 = x2 = x3 = x4 = x5 = x6 = x7 = x8 = x9 = x10 = undefined; return hello(); }; histor = ''; hist.innerHTML = histor; }; cur = ''; show(cur); }, help: "Cl : clear last result / all" },
  "_0": { label: "0", click: () => { cur += '0'; show(cur); } },
  "_.": { label: ".", click: () => { cur += '.'; show(cur); } },
  "V": { color: 'blue', label: "&#x2228;", click: () => { cur += '&'; show(cur); }, help: "dual outer product." },
  "=": { color: 'red', label: "=", click: () => { cur = patch(Al.inline(new Function('return ' + cur))().toString()); show(cur); } },
  ")": { color: 'blue', label: ")", click: () => { cur += ')'; show(cur); } },
  "x5": { color: 'purple', label: "x<sub>5</sub>", click: () => { if (store) { store = false; x5 = Al.inline(new Function('return ' + cur))(); patch('x5=' + x5.toString()); return show(cur); } cur += 'x5'; show(cur); }, help: "x5 variable" },
  "x10": { color: 'purple', label: "x<sub>10</sub>", click: () => { if (store) { store = false; x10 = Al.inline(new Function('return ' + cur))(); patch('x10=' + x10.toString()); return show(cur); } cur += 'x10'; show(cur); }, help: "x10 variable" }
}

// Add all the buttons and install mouse and touch handlers. 
var j = 0, p; for (var i in buttons) {
  // Every 8 buttons, start a new group.
  if (j % 8 == 0) p = document.getElementById("calcBody").appendChild(Object.assign(document.createElement('div'), { className: 'group' }));
  // Add the button to the current group.  
  buttons[i].el = p.appendChild(Object.assign(document.createElement('div'), { className: "numButton noselect " + (buttons[i].color || ''), innerHTML: buttons[i].label }));
  // Link the handlers  
  (function (x) {
    buttons[i].el.ontouchend = function (e) { this.classList.remove('active'); }
    buttons[i].el.ontouchstart = buttons[i].el.onmouseup = function (e) {
      e.preventDefault(); e.stopPropagation();
      // Show touch response and vibrate on mobile.
      if (window.TouchEvent && e instanceof TouchEvent) this.classList.add('active');
      navigator.vibrate && navigator.vibrate(50);
      // Show help if needed. 
      if (help) {
        help = false; histor = '';
        return print(buttons[x].help || 'no help for this button.');
      }
      // Call button click handler.  
      buttons[x].click();
    }
  })(i); j++;
}

buttons.up.el.classList.add('disabled');
buttons.dwn.el.classList.add('disabled');

// Shorthand to enable/disable buttons depending on mode.
var e = function (x0, x1, x2, x3, x4, x5) {
  ['Conj', 'dual', 'rev', 'pss'].forEach(x => buttons[x].el.classList[(arguments.length == 0) ? 'add' : 'remove']('disabled'));
  ['ori', 'inf'/*,'up','dwn'*/].forEach(x => buttons[x].el.classList[(mode == 5 || mode == 6) ? 'remove' : 'add']('disabled'));
  for (var i = 0; i < 6; i++) buttons['e' + i].el.classList[arguments[i] ? 'remove' : 'add']('disabled');
}
var E = function (x0, x1, x2, x3, x4, x5) {
  ["^", "V", "."].forEach(x => buttons[x].el.classList[(arguments.length == 0) ? 'add' : 'remove']('disabled'));
  e(x0, x1, x2, x3, x4, x5);
  for (var i = 0; i < 6; i++) buttons['E' + i].el.classList[arguments[i] ? 'remove' : 'add']('disabled');
}
E(); e();



// patch for cocoon.io
document.body.ontouchstart = function (e) { e.preventDefault(); e.stopPropagation(); }
document.body.ontouchmove = function (e) { e.preventDefault(); e.stopPropagation(); }
