'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');

function Student(o){
  this.name = o.name;
  this.tests = [];
  this.color = o.color;
}

Object.defineProperty(Student, 'collection', {
  get: function(){return global.mongodb.collection('students');}
});

Object.defineProperty(Student.prototype, 'average', {
  get: function(){
    if(!this.tests.length){return 0;}

    var sum = this.tests.reduce(function(total, test){return total + test;});
    return(sum/this.tests.length);
  }
});

Object.defineProperty(Student.prototype, 'letter', {
  get: function() {
    var averageGrade = this.average;

    if(averageGrade >= 90){
      return 'A';
    }else if(averageGrade >= 80){
      return 'B';
    }else if(averageGrade >= 70){
      return 'C';
    }else if(averageGrade >= 60){
      return 'D';
    }else{
      return 'F';
    } 
  }  
});

Object.defineProperty(Student.prototype, 'isSuspended', {
  get: function(){
    var failingTests = this.tests.filter(function(t){return t < 60;});
    return failingTests.length >= 3;
  }
});

Object.defineProperty(Student.prototype, 'isHonorRoll', {
  get: function(){
    return this.average >= 95;
  }
});

Student.prototype.insert = function(cb){
  Student.collection.save(this, cb);
};

Student.prototype.addTest = function(score, cb){
  score = parseFloat(score);

  this.tests.push(score);
  Student.collection.update({_id:this._id}, {$push: {tests:score}}, cb);
};

Student.all = function(cb){
  Student.collection.find().toArray(function(err, objects){
    var students = objects.map(function(o){
      return changePrototype(o);
    });
    cb(students);
  });
};


Student.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Student.collection.findOne({_id:_id}, function(err, obj){
    var student = changePrototype(obj);
   
    cb(student);
  });
};

//PRIVATE FUNCTIONS//

function changePrototype(obj){
  var student = _.create(Student.prototype, obj);
  return student;
}






