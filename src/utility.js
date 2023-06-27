const fs = require('fs'), path = require('path');
const _ = require('lodash');

module.exports = {
    proccessCollection: function (filepath){
        console.log(filepath)
        let collection = JSON.parse(fs.readFileSync(filepath));
        this.updateResourcePath(collection);
        fs.writeFileSync( filepath, JSON.stringify(collection));
    },

    getAllCollections: function(){
        let dirPath = path.join(__dirname, 'collections');
        let collections;
        collections = fs.readdirSync(dirPath);
        return collections;
    },
    
    updateResourcePath: function(collection){
        collection.item.map( _it => {
            if(typeof _it.item !="undefined"){
                console.log('folder found::', _it['name']);
                return updateResourcePath(_it);
            }else if(typeof _it['request'] != 'undefined' && _it['request'].method == 'POST' && _it['request'].body.mode == 'formdata'){
                console.log('request found::', _it['name'])
                return _it['request'].body.formdata.map(data => {
                    if(data.type == "file"){
                        console.log('replacing file path..')
                        let lIndex = (data.src.lastIndexOf('/') >= 0 ) ? data.src.lastIndexOf('/') : data.src.lastIndexOf('\\');
                        data.src = path.join(__dirname ,'resources' , data.src.slice(lIndex+1, data.src.length));
                    }
                    return data
                });
            }
        });
    }
}