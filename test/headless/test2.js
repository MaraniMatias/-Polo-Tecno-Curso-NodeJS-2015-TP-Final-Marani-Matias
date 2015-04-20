var assert = require('assert')
 ,  config = require('../../config')
 ,  mongoose = require('mongoose')
 ,  Browser = require("zombie")
 ,  fixtures = require('mongoose-fixtures')
;
// Global Variables for the test case
var Sample, sample, browser, sampleId, sampleSearch, sampleEdited, sampleNew, d;
d = 'http://'+config.app.domain+":"+config.app.port;

// Unit Tests
describe('CRUD Sample '+d, function(){

    before(function(done){ 
        mongoose.connect(config.mongoDB.url); 
        //fixtures.load('../../fixtures/employees.js');
      
        Sample = require('../../models/employees');
        // It show create a new document in the database
        sample = new Sample({ name : 'empleado' , 
                              surname : 'surname' ,
                              provider : 'test'+Math.floor((Math.random() * 10) + 1),
                              email : 'test3@test.com' , 
                              password : 'Qwerty@123'});
        sample.save();
        sampleId = sample._id;
        sampleSearch = sample.name;

        // Get domain
        d = 'http://'+config.app.domain+":"+config.app.port;
        // Start browser
        browser = new Browser({debug:false});
        // Login if necesary
        browser.visit(d+"/admin", function () {
          browser
            .fill("email", "admin@admin.com")
            .fill("password", "123456")
            .pressButton("Login", function(){
                done();
            });
        });
    });

    describe('Samples CRUD', function(){

        it('Deveriamos estar en la pag. de bienbenida', function() {
          browser.assert.text('title', 'Welcome');
        });
      
      
        it('Lista empleados', function(done){
            browser.visit(d+"/panel/employees", function () {
              assert.ok(browser.success);
              assert.ok(browser.location.href === d+'/panel/employees');
              assert.ok(browser.document.querySelectorAll('table tr td a[href="/edit/'+sampleId+'"]').length > 0,  'Debe mostrar un documento recientemente añadido enumerado');
              done();
            });
        });

/*      it('Search Samples', function(done){
            browser.visit(d+"/panel/employees", function () {
              assert.ok(browser.success);
              //assert.ok(browser.location.hash === "#/crud/sample");
              assert.ok(browser.location.href === d+'/panel/employees');
              browser.fill('input[ng-model="search"]', sampleSearch);
              browser.wait(function(){
                 //console.log(browser.document.querySelectorAll('table')[0].innerHTML);
                 assert.ok(browser.document.querySelectorAll('table tr td a[href="/edit/'+sampleId+'"]').length > 0, 'Debe mostrar un documento recientemente añadido enumerado');
                  done();
              });
            });
        }); */

        it('Actualizar employees', function(done){
           browser.visit(d+"/panel/employees", function () {
              assert.ok(browser.success);
              assert.ok(browser.location.href === d+'/panel/employees');
              browser.clickLink('a[href="/edit/'+sampleId+'"]', function(){
                
                //console.log(browser.document.querySelectorAll('form[name="myForm"]')[0].innerHTML);
                //sampleEdited = "sample"+new Date().getTime(); //nuevo nombre con las hora
                sampleEdited = "nuevo nombre";
                console.log("1--->", browser.userAgent);
                //console.log(browser.html());
                
                browser
                  .fill('form[name="myForm"] input[name="name"]', sampleEdited)
                  .fill('form[name="myForm"] input[name="surname"]', 'apellidoTest')
                  .fill('form[name="myForm"] input[name="email"]', 'adm@email.com')
                  .pressButton('Save',function(err, b){
                  // https://github.com/angular/angular.js/issues/3915
                  //console.log("--->", browser.html());
                   
                  browser.visit(d+"/panel/employees", function () {
                       //console.log(browser.document.location.hash);
                       //console.log(browser.document.querySelectorAll('body')[0].innerHTML);
                       //browser.fill('input[ng-model="search"]', sampleEdited);
                       browser.wait(function(){
                           //console.log(browser.document.querySelectorAll('table')[0].innerHTML);
                           assert.ok(browser.document.querySelectorAll('table tr td a[href="/edit/'+sampleId+'"]').length > 0,'Debe mostrar un documento recientemente editado enumerado');
                            done();
                       });
                   });
                });
              });
           });
        });
/*
        it('Create Samples', function(done){
           browser.visit(d+"/admin/panel#/crud/sample", function () {
              //console.log("0--->", browser.text('[ng-view]'));
              assert.ok(browser.success);
              assert.ok(browser.location.hash === "#/crud/sample");
              browser.visit(d+'/admin/panel#/crud/sample-new', function(){
                //console.log("1--->", browser.text('[ng-view]'));
                sampleNew = "samplenew"+new Date().getTime();
                browser
                 .fill('form[name="myForm"] input[name="name"]', sampleNew)
                 .pressButton('button[ng-click="save()"]',function(err, b){
                   //console.log("2--->", browser.text('[ng-view]'));
                   browser.visit(d+"/admin/panel#/crud/sample", function () {
                       browser.fill('input[ng-model="search"]', sampleNew);
                       browser.wait(function(){
                           //console.log(browser.html('table'));
                           assert.ok(browser.html('table').match(sampleNew) !== null,
                                'Should show a recently created doc listed');
                            done();
                       });
                   });
                });
              });
           });
        });

        it('Delete Samples', function(done){
           browser.visit(d+"/admin/panel#/crud/sample", function () {
              assert.ok(browser.success);
              assert.ok(browser.location.hash === "#/crud/sample");
              browser.clickLink('a[data-edit-id="'+sampleId+'"]', function(){
                //console.log(browser.document.querySelectorAll('form[name="myForm"]')[0].innerHTML);
                sampleEdited = "sample"+new Date().getTime();
                //console.log("1--->", browser.userAgent);
                //console.log(browser.html());
                browser
                 .fill('form[name="myForm"] input[name="name"]', sampleEdited)
                 .pressButton('button[ng-click="destroy()"]',function(err, b){
                   // https://github.com/angular/angular.js/issues/3915
                   //console.log("--->");
                   //console.log(browser.html());
                   browser.visit(d+"/admin/panel#/crud/sample", function () {
                       //console.log(browser.document.location.hash);
                       //console.log(browser.document.querySelectorAll('body')[0].innerHTML);
                       browser.fill('input[ng-model="search"]', sampleEdited);
                       browser.wait(function(){
                           //console.log(browser.document.querySelectorAll('table')[0].innerHTML);
                           assert.ok(browser.html('table').match(sampleNew) === null,
                                'Should not show a recently deleted doc listed');
                            done();
                       });
                   });
                });
              });
           });
        });
*/
    });
  
  after(function() {
    browser.destroy();
  });
});

    