(()=>{"use strict";function e(e={}){return()=>t=>n=>{const{index:u,path:a,newValue:l,oldValue:r,$$UNDO_REDO_TYPE:c}=n.payload||{},i=e.ADD_INTO_HISTORY_ACTION;return(i&&c&&function(e,t){return(...n)=>t(e(...n))}(i,t)||(()=>{}))({type:c,index:u||-1,path:a||[],newValue:l||!1,oldValue:r||!1,cacheItem:null}),t(n)}}e().withExtraArgument=e})();