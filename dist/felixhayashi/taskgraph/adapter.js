/*\

title: $:/plugins/felixhayashi/taskgraph/adapter.js
type: application/javascript
module-type: library

@preserve

\*/
var utils=require("$:/plugins/felixhayashi/taskgraph/utils.js").utils;var ViewAbstraction=require("$:/plugins/felixhayashi/taskgraph/view_abstraction.js").ViewAbstraction;var vis=require("$:/plugins/felixhayashi/vis/vis.js");var Adapter=function(t){this.wiki=t?t:$tw.wiki;this.opt=$tw.taskgraph.opt;this.logger=$tw.taskgraph.logger};Adapter.prototype.insertEdge=function(t,e){if(typeof t!=="object"||!t.from||!t.to)return;e=new ViewAbstraction(e);var i=t.label?t.label:this.opt.misc.unknownEdgeLabel;var r=e.getEdgeStoreLocation()+"/"+i;var s=this.wiki.getTiddlerData(r,[]);delete t.label;if(t.id){var o=utils.keyOfItemWithProperty(s,"id",t.id);if(typeof o==="undefined"){o=s.length}}else{t.id=utils.genUUID();var o=s.length}this.logger("info",'Inserting edge into store  "'+r+'"',t);s[o]=t;var a={};var d=this.wiki.getTiddler(r);if(!d||!d.fields.id){a.id=utils.genUUID()}this.wiki.setTiddlerData(r,s,a);t.label=i;$tw.taskgraph.edgeChanges.push({type:"insert",edge:t})};Adapter.prototype.selectEdgesByFilter=function(t,e){var i=utils.getMatches(t);var r=[];for(var s=0;s<i.length;s++){r.push(utils.getBasename(i[s]))}return this.selectEdgesByLabel(r,e)};Adapter.prototype.selectEdgesByLabel=function(t,e){if(typeof e!=="object")e=utils.getEmptyMap();var i=new ViewAbstraction(e.view);var r=i.getEdgeStoreLocation();var s=utils.getEmptyMap();for(var o=0;o<t.length;o++){var a=r+"/"+t[o];if(!utils.tiddlerExists(a))continue;var d=this.wiki.getTiddlerData(a);for(var l=0;l<d.length;l++){if(t[o]!==this.opt.misc.unknownEdgeLabel){d[l].label=t[o]}s[d[l].id]=d[l]}}return utils.convert(s,e.outputType)};Adapter.prototype.selectEdgesByEndpoints=function(t,e){if(typeof e!=="object")e=utils.getEmptyMap();var i=new ViewAbstraction(e.view);var r=i.exists()?e.view.getEdgeFilter("compiled"):this.opt.filter.allSharedEdges;var s=this.selectEdgesByFilter(r,{outputType:"array",view:i});return this.filterEdgesByEndpoints(s,t,e)};Adapter.prototype.filterEdgesByEndpoints=function(t,e,i){if(typeof i!=="object")i=utils.getEmptyMap();t=utils.convert(t,"array");var r=/^(=1|>=1|=2)$/;var s=r.test(i.endpointsInSet)?i.endpointsInSet:">=1";var e=utils.getLookupTable(e,"id");var o=utils.getEmptyMap();for(var a=0;a<t.length;a++){var d=t[a];switch(s){case"=2":isMatch=e[d.from];break;case">=1":isMatch=e[d.from]||e[d.to];break;case"=1":isMatch=e[d.from]===undefined&&e[d.to]||e[d.to]===undefined&&e[d.from];break;default:isMatch=false}if(isMatch)o[d.id]=d}return utils.convert(o,i.outputType)};Adapter.prototype.selectNodesByFilter=function(t,e){var i=utils.getMatches(t);return this.selectNodesByReference(i,e)};Adapter.prototype.selectNodesByReference=function(t,e){if(typeof e!=="object")e=utils.getEmptyMap();var i=e.addProperties;var r=utils.getEmptyMap();for(var s=0;s<t.length;s++){var o=this.createNode(t[s],i);if(o){r[o.id]=o}}if(e.view){this._restorePositions(r,e.view)}return utils.convert(r,e.outputType)};Adapter.prototype.createNode=function(t,e){var t=utils.getTiddler(t);if(!t||t.isDraft()||this.wiki.isSystemTiddler(t.fields.title)){return}var i=this.setupTiddler(t);if(!i){throw'Taskgraph: Cannot create node from tiddler "'+t+'"'}var r=utils.getEmptyMap();r.label=utils.getLabel(i,this.opt.field.nodeLabel);if(typeof e==="object"){r=$tw.utils.extendDeepCopy(r,e)}r.id=i.fields[this.opt.field.nodeId];r.ref=i.fields.title;return r};Adapter.prototype.selectNeighbours=function(t,e){if(typeof e!=="object")e=utils.getEmptyMap();if(e.edges){var i=this.filterEdgesByEndpoints(e.edges,t,{outputType:"array",endpointsInSet:"=1"})}else{var i=this.selectEdgesByEndpoints(t,{outputType:"array",view:e.view,endpointsInSet:"=1"})}var t=utils.getLookupTable(t,"id");var r=utils.getEmptyMap();for(var s=0;s<i.length;s++){var o=t[i[s].from]?i[s].to:i[s].from;r[o]=true}return this.selectNodesByIds(r,e)};Adapter.prototype.selectNodesByIds=function(t,e){if(typeof e!=="object")e=utils.getEmptyMap();if(Array.isArray(t)){t=utils.getArrayValuesAsHashmapKeys(t)}else if(t instanceof vis.DataSet){t=utils.getLookupTable(t,"id")}var i=utils.getEmptyMap();var r=this.wiki.allTitles();var s=this.opt.field.nodeId;var o=e.addProperties;for(var a in t){for(var d=0;d<r.length;d++){var l=this.createNode(r[d],o);if(l&&t[l.id]){i[l.id]=l}}}if(e.view){this._restorePositions(i,e.view)}return utils.convert(i,e.outputType)};Adapter.prototype.selectNodeById=function(t,e){if(typeof e!=="object"){e=utils.getEmptyMap()}e.outputType="hashmap";var i=this.selectNodesByIds([t],e);return i[t]};Adapter.prototype.deleteNodesFromStore=function(t){if(!t)return;var e=this.opt.field.nodeId;var i=this.wiki.allTitles();var r=[];var t=utils.getLookupTable(t,"id");for(var s in t){for(var o=0;o<i.length;o++){var a=utils.getTiddlersWithProperty(e,s,{isIncludeDrafts:true,isReturnRef:true,tiddlers:i});r=r.concat(a)}}var d=this.wiki.getTiddlerList("$:/StoryList");if(d.length){d=d.filter(function(t){return r.indexOf(t)==-1});var l=this.wiki.getTiddler("$:/StoryList");this.wiki.addTiddler(new $tw.Tiddler(l,{list:d}))}utils.deleteTiddlers(r)};Adapter.prototype.deleteEdgeFromStore=function(t,e){if(!t)return;var i=t.label?t.label:this.opt.misc.unknownEdgeLabel;var e=new ViewAbstraction(e);var r=e.getEdgeStoreLocation()+"/"+i;var s=this.wiki.getTiddlerData(r,[]);this.logger("info",'Edge with label "'+i+'" will be deleted: '+t);var o=utils.keyOfItemWithProperty(s,"id",t.id);if(o!=null){s.splice(o,1);this.wiki.setTiddlerData(r,s);$tw.taskgraph.edgeChanges.push({type:"delete",edge:t})}};Adapter.prototype.deleteEdgesFromStore=function(t,e){t=utils.convert(t,"array");for(var i=0;i<t.length;i++){this.deleteEdgeFromStore(t[i],e)}};Adapter.prototype.getView=function(t,e){return new ViewAbstraction(t,e)};Adapter.prototype.createView=function(t){if(typeof t!=="string"||t===""){t="My view"}var e=this.wiki.generateNewTitle(this.opt.path.views+"/"+t);return new ViewAbstraction(e,true)};Adapter.prototype._restorePositions=function(t,e){e=new ViewAbstraction(e);if(!e.exists())return;var i=e.getPositions();for(var r in t){if(utils.hasOwnProp(i,r)){t[r].x=i[r].x;t[r].y=i[r].y}}};Adapter.prototype.storePositions=function(t,e){e=new ViewAbstraction(e);e.setPositions(t)};Adapter.prototype.setupTiddler=function(t){var e=this.wiki.getTiddler(utils.getTiddlerReference(t));if(!e)return;var i=this.opt.field.nodeId;if(!e.fields[i]){var r=utils.getEmptyMap();r[i]=utils.genUUID();e=new $tw.Tiddler(e,r);$tw.wiki.addTiddler(e)}return e};Adapter.prototype.insertNode=function(t,e){if(typeof e!=="object")e=utils.getEmptyMap();if(typeof t!=="object"){t=utils.getEmptyMap()}if(!t.id){t.id=utils.genUUID()}var i=utils.getEmptyMap();var r=t.label?t.label:"New node";i.title=this.wiki.generateNewTitle(r);i[this.opt.field.nodeId]=t.id;t.label=i.title;t.ref=i.title;if(e.view){var s=new ViewAbstraction(e.view);s.addNodeToView(t)}this.wiki.addTiddler(new $tw.Tiddler(i,this.wiki.getModificationFields(),this.wiki.getCreationFields()));return t};exports.Adapter=Adapter;