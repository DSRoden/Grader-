'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');

function Student(o){
  this.name = o.name;
  this.tests = [];
  this.isSuspended = false;
  this.isHonor = false;
  this.color = o.color;
}

Object.defineProperty(Student, 'collection', {
  get: function(){return global.mongodb.collection('students');}
});

Student.prototype.average = function(){
  var sum = 0;

  for(var i = 0; i < this.tests.length; i++){
    sum += this.tests[i]; 
  }
 
  var avg= sum / this.tests.length;
  return avg;
};

Student.prototype.letterGrade = function(){
  var averageGrade = this.average();
  var letter;
  if(averageGrade >= 90){
    letter = 'A';
  }else if(averageGrade >= 80){
    letter = 'B';
  }else if(averageGrade >= 70){
    letter = 'C';
  }else if(averageGrade >= 60){
    letter = 'D';
  }else{
    letter = 'F';
  }
  return letter;
};

Student.prototype.suspended = function(){
  var fails = [];
  for(var i = 0; i < this.tests.length; i++){
    if(this.tests[i] < 60){
      fails.push(this.tests[i]);
    }
  }
  if(fails.length >= 3){
    this.isSuspended = true;
  }
};

Student.prototype.honored = function(){
  if (this.average() >= 95){
    this.isHonor = true;
  } 
};

Student.prototype.addTest = function(score){
  this.tests.push(score);
};

Student.prototype.save = function(cb){
  Student.collection.save(this, cb);
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

module.exports = Student;

//PRIVATE FUNCTIONS//

function changePrototype(obj){
  var student = _.create(Student.prototype, obj);
  return student;
}
