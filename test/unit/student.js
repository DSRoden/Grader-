/* jshint expr:true */
/* global describe, it, before, beforeEach*/

'use strict';

var expect = require('chai').expect;
var Student = require('../../app/models/student');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var jane, daniel, liza;

describe('Student', function(){
  before(function(done){
    dbConnect('Grader-test', function(){
      done();
     });
  });

  beforeEach(function(done){
    Student.collection.remove(function(){
    var o = {name:'jane', color: 'blue'};
    var o1 = {name:'daniel', color: 'white'};
    var o2 = {name:'liza', color: 'green'};
    jane = new Student(o);
    daniel = new Student(o1);
    liza = new Student(o2);


    jane.tests.push(80,90,100);
    daniel.tests.push(50,50,40);
    liza.tests.push(98,93,99);
    
       jane.save(function(){
          daniel.save(function(){
            liza.save(function(){
              done();
            });
          });
       });
    });
  });

  describe('constructor', function(){
    it('should create a new student', function(){
    var o = {name:'jane', color: 'blue'};
    var jane = new Student(o);
    
    expect(jane).to.be.instanceof(Student);
    expect(jane.name).to.equal('jane');
    expect(jane.tests).to.have.length(0);
    expect(jane.isSuspended).to.be.false;
    expect(jane.isHonor).to.be.false;
    expect(jane.color).to.equal('blue');
    });
  });

  describe('#average', function(){
    it('should find a student average', function(){
    console.log(jane.tests);
    var average = jane.average();
    expect(jane.tests).to.have.length(3);
    expect(average).to.be.closeTo(90, 0.1);
    });
  });

  describe('#letterGrade', function(){
    it('should assign a letter grade', function(){
      jane.average();
      var letterGrade = jane.letterGrade();

      expect(letterGrade).to.equal('A');
    });
  });

  describe('#suspended', function(){
    it('should suspend student', function() {
    daniel.suspended();  
    expect(daniel.isSuspended).to.be.true;
    });
    
    it('should not suspend student', function() {
    jane.suspended();
    expect(jane.isSuspended).to.be.false;
    });
  });

  describe('#honored', function(){
    it('should place student with 95+ avg on honor roll', function(){
      liza.honored();
      expect(liza.isHonor).to.be.true;
    });
    it('should not place student with avg below 95 on honor roll', function(){
      daniel.honored();
      expect(daniel.isHonor).to.be.false;
    });
  });

  describe('#save', function(){
    it('should save a student to the database', function(done){
      var o = {name:'jane', color: 'blue'};
      var jane = new Student(o);
      
      jane.save(function(){
        expect(jane._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.all', function(){
    it('should get all students in db', function(done){
      Student.all(function(students){
        expect(students).to.have.length(3);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a student by their id', function(done){
      Student.findById(jane._id.toString(), function(student){
        expect(student.name).to.equal('jane');
        done();
      });
    });
  });

  describe('#addTest', function(){
    it('should add test to student test array', function(done){
      Student.findById(liza._id.toString(), function(student){
       student.addTest(95);
       student.save(function(){
        expect(student.tests).to.have.length(4);
        expect(student.isSuspended).to.be.false;
        expect(student.isHonor).to.be.true;
        done();
       });
      });
    });
  });

//Last braces
});

