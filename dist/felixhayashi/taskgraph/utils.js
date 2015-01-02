/*\

title: $:/plugins/felixhayashi/taskgraph/utils.js
type: application/javascript
module-type: library

ATTENTION: THIS CLASS MUST NOT REQUIRE ANY OTHER TASKGRAPH FILE
IN ORDER TO AVOID ACYCLIC DEPENDENCIES!

@preserve

\*/
var vis=require("$:/plugins/felixhayashi/vis/vis.js");var utils={};utils.deleteTiddlers=function(t){var e=Object.keys(t);for(var i=0;i<e.length;i++){if(utils.tiddlerExists(t[e[i]])){var r=utils.getTiddlerReference(t[e[i]]);$tw.wiki.deleteTiddler(r)}}};utils.getTiddlerIds=function(t,e){var i=[];var r=Object.keys(t);for(var n=0;n<r.length;n++){if(utils.tiddlerExists(t[r[n]])){var s=utils.getTiddler(t[r[n]]).fields[e];i.push(s)}}return i};utils.getTiddlerById=function(t,e){if(!e)e="id";var i=$tw.wiki.allTitles();for(var r=0;r<i.length;r++){var n=utils.getTiddler(i[r]);if(n.fields[e]===t){return n}}};utils.getLabel=function(t,e){var i=utils.getTiddler(t);return i&&i.fields[e]?i.fields[e]:i.fields.title};utils.convert=function(t,e){if(typeof t!=="object")return;switch(e){case"array":return utils.getValues(t);case"hashmap":case"object":if(t instanceof vis.DataSet){return vis.get({returnType:"Object"})}else{return t}case"dataset":default:if(t instanceof vis.DataSet){return t}if(!Array.isArray(t)){t=utils.getValues(t)}return new vis.DataSet(t)}};utils.inject=function(t,e){if(e instanceof vis.DataSet){e.update(utils.convert(t,"array"))}else if(Array.isArray(e)){t=utils.convert(t,"object");for(var i in t){if(e.indexOf(t[i])==-1){e.push(t[i])}}}else{$tw.utils.extend(e,utils.convert(t,"object"))}return e};utils.getValues=function(t){if(Array.isArray(t)){return t}if(t instanceof vis.DataSet){return t.get({returnType:"Array"})}var e=[];var i=Object.keys(t);for(var r=0;r<i.length;r++){e.push(t[i[r]])}return e};utils.hasOwnProp=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};utils.getEmptyMap=function(){var t=Object.create(null);Object.defineProperty(t,"hasOwnProperty",{enumerable:false,configurable:false,writable:false,value:Object.prototype.hasOwnProperty.bind(t)});return t};utils.getMatches=function(t,e,i){var r=undefined;if(typeof e==="object"){var n=Object.keys(e);r=function(t){for(var i=0;i<n.length;i++){var r=utils.getTiddler(e[n[i]]);if(r){t(r,r.fields.title)}}}}if(typeof t==="string"){t=$tw.wiki.compileFilter(t)}var s=t.call($tw.wiki,r);return s};utils.isMatch=function(t,e){var i=utils.getTiddlerReference(t);return utils.getMatches(e,[i]).length>0};utils.getTiddlerReference=function(t){if(t instanceof $tw.Tiddler){return t.fields.title}else if(typeof t==="string"){return t}};utils.getTiddler=function(t){return t instanceof $tw.Tiddler?t:$tw.wiki.getTiddler(t)};utils.getBasename=function(t){return t.substring(t.lastIndexOf("/")+1)};utils.notify=function(t){var e="$:/temp/taskgraph/notify";$tw.wiki.addTiddler(new $tw.Tiddler({title:e,text:t}));$tw.notifier.display(e)};utils.tiddlerExists=function(t){var e=utils.getTiddlerReference(t);return e&&($tw.wiki.tiddlerExists(e)||$tw.wiki.isShadowTiddler(e))};utils.getPropertiesByPrefix=function(t,e,i){var r=utils.getEmptyMap();for(var n in t){if(utils.startsWith(n,e)){r[i?n.substr(e.length):n]=t[n]}}return r};utils.getDomNodePos=function(t){var e={x:0,y:0};while(true){e.x+=t.offsetLeft;e.y+=t.offsetTop;if(t.offsetParent===null)break;t=t.offsetParent}return e};utils.startsWith=function(t,e){return typeof t==="string"&&t.indexOf(e)===0};utils.hasElements=function(t){return Object.keys(t).length>0};utils.isDraft=function(t){return utils.getTiddler(t)&&utils.getTiddler(t).isDraft()};utils.getText=function(t,e){if(!e){e=""}var i=utils.getTiddler(t);return i?i.fields.text:e};utils.keysOfItemsWithProperty=function(t,e,i,r){t=utils.getIterableCollection(t);var n=Object.keys(t);var s=[];var r=typeof r==="number"?r:n.length;for(var l=0;l<n.length;l++){var a=n[l];if(typeof t[a]==="object"&&t[a][e]){if(!i||t[a][e]===i){s.push(a);if(s.length===r){break}}}}return s};utils.keyOfItemWithProperty=function(t,e,i){var r=utils.keysOfItemsWithProperty(t,e,i,1);return r.length?r[0]:undefined};utils.getIterableCollection=function(t){return t instanceof vis.DataSet?t.get():t};utils.getLookupTable=function(t,e){t=utils.getIterableCollection(t);var i=utils.getEmptyMap();var r=Object.keys(t);for(var n=0;n<r.length;n++){var s=r[n];var l=e?t[s][e]:t[s];if(typeof l==="string"&&l!=""||typeof l==="number"){if(!i[l]){i[l]=t[s];continue}}throw'Taskgraph: Cannot use "'+l+'" as lookup table index'}return i};utils.getArrayValuesAsHashmapKeys=function(t){return utils.getLookupTable(t)};utils.getTiddlersWithProperty=function(t,e,i){if(typeof i!=="object")i=utils.getEmptyMap();if(!i.tiddlers){i.tiddlers=$tw.wiki.allTitles()}var r=[];var n=i.isReturnRef;var s=Object.keys(i.tiddlers);for(var l=0;l<s.length;l++){var a=utils.getTiddler(i.tiddlers[s[l]]);if(a.fields[t]===e){r.push(n?a.fields.title:a);if(i.isIncludeDrafts){var u=$tw.wiki.findDraft(a.fields.title);if(u){r.push(n?u:$tw.wiki.getTiddler(u))}}}}return r};utils.flatten=function(t,e){e=e||{};var i=e.delimiter||".";var r={};function n(t,s){Object.keys(t).forEach(function(l){var a=t[l];var u=e.safe&&Array.isArray(a);var f=Object.prototype.toString.call(a);var o=f==="[object Object]"||f==="[object Array]";var d=s?s+i+l:e.prefix+l;if(!u&&o){return n(a,d)}r[d]=a})}n(t);return r};utils.unflatten=function(t,e){e=e||{};var i=e.delimiter||".";var r={};if(Object.prototype.toString.call(t)!=="[object Object]"){return t}function n(t){var e=Number(t);return isNaN(e)||t.indexOf(".")!==-1?t:e}Object.keys(t).forEach(function(s){var l=s.split(i);var a=n(l.shift());var u=n(l[0]);var f=r;while(u!==undefined){if(f[a]===undefined){f[a]=typeof u==="number"&&!e.object?[]:{}}f=f[a];if(l.length>0){a=n(l.shift());u=n(l[0])}}f[a]=unflatten(t[s],e)});return r};utils.genUUID=function(){var t="0123456789abcdefghijklmnopqrstuvwxyz".split("");return function(){var e=t,i=new Array(36);var r=0,n;for(var s=0;s<36;s++){if(s==8||s==13||s==18||s==23){i[s]="-"}else if(s==14){i[s]="4"}else{if(r<=2)r=33554432+Math.random()*16777216|0;n=r&15;r=r>>4;i[s]=e[s==19?n&3|8:n]}}return i.join("")}}();exports.utils=utils;