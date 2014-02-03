var introspect = function (file) {
    function inject(file) {
        file = file.substring(file.indexOf('function'), file.lastIndexOf('}'));
        var privs = file.match(/((var )?\s*?(\w.*?)=\s*?)?function(\s*?(\w.*?))?\(/g), //get func
            replace = "return Public;", //this should be passed in as a param
            instance = eval("new (" + file.replace(replace, "Public._initPrivs = function(funcs){"
                + "Public._privates = {};" //init _privates property
                + "for(var i=funcs.length;i--;){" //loop the funcs found from `privs`
                + "var fn=funcs[i].replace(/function|=|\\s.*?|\\(|var /g,'');" //remove tokens
                + "if(fn.length == 0) continue;" //skip the empty string funcs
                + "try{Public._privates[fn] = eval(fn);}catch(e){" // test to see if func is defined
                + "if(e.name=='ReferenceError'){continue;}else{throw e;}}}}\n" //if not, ignore
                + replace) //add the thing we replaced back in. a better option would be use .slice
                + "})()"); //eval(new(function(){})()) turn it into a func we can call
        instance._initPrivs(privs); //call the initPrivs function to load the _privates property
        delete instance._initPrivs; //delete the initiation function
        return instance;
    }

    var request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.send();

    request.onload = function () {
        introspect.injected = inject(this.response);
    };
};
