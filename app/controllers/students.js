'use strict';

var Student = require('../models/student');
var studentHelper = require('../helpers/student_helper');

exports.init = function(req, res){
  res.render('students/init');
};

exports.create = function(req, res){
  var student = new Student(req.body);
  student.save(function(){
    res.redirect('/students');
  });
};

exports.index = function(req, res){
  Student.all(function(students){
    res.render('students/index', {students:students, studentHelper:studentHelper});
  });
};

exports.show = function(req, res){
  Student.findById(req.params.id, function(student){
    res.render('students/show', {student:student, studentHelper:studentHelper});
  });
};

exports.test = function(req, res){
  Student.findById(req.params.id, function(student){
    res.render('students/test', {student:student});
  });
};

exports.addTest = function(req, res){
  var score = req.body;
  Student.findById(req.params.id, function(student){
    student.addTest(req.body.score, function(){
      res.redirect('/students/' + req.params.id);
    });
  });
};
