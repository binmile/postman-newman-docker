const newman = require('newman');
const path = require('path');
const minimist = require('minimist');
const async = require('async');

const util = require('./utility');

let args = minimist(process.argv.slice(2), {
    alias: {
        c: 'collections',
        e: 'environment',
        r: 'reporters'
    },
    default: {
        c: '',
        r:'cli'
    },
});

run = function(){
    let collections = (args['collections'] == 'all') ? util.getAllCollections() : args['collections'].split(',');
    console.log(collections);
    async.eachSeries(collections, (file, next) => {
        util.proccessCollection( path.join(__dirname, 'collections', file));
        start(args['environment'], file, next);
    }, (err, result) => {
        console.error(err);
    })
}

start = function(environment, collection, callback){
   
    newman.run({
        collection: path.join(__dirname, 'collections', collection), 
        environment: path.join(__dirname, 'environment', environment),
        reporters: args['reporters'].split(','),
        reporter: {
            html: {
                export: path.join(__dirname, 'reports', collection.slice(0, collection.lastIndexOf('.')) + (new Date()).toISOString().replace(/[^\d]+/g, '_') + '.report.html'),
                template: path.join(__dirname, 'template', 'customTemplate_2.hbs'),
            },
            htmlextra: {
                export: path.join(__dirname, 'reports', collection.slice(0, collection.lastIndexOf('.')) + (new Date()).toISOString().replace(/[^\d]+/g, '_') + '.report.html'),
                //template: path.join(__dirname, 'template', 'customTemplate_2.hbs'),
            },
           junit:{
               export: path.join(__dirname, 'reports')
           }
        }
    },(err, summary) => {
        callback(err, summary);
    })
}


console.log('args:',args);
run();