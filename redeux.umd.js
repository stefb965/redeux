!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.redeux=e()}}(function(){return function e(t,n,r){function o(f,u){if(!n[f]){if(!t[f]){var a="function"==typeof require&&require;if(!u&&a)return a(f,!0);if(i)return i(f,!0);var s=new Error("Cannot find module '"+f+"'");throw s.code="MODULE_NOT_FOUND",s}var c=n[f]={exports:{}};t[f][0].call(c.exports,function(e){var n=t[f][1][e];return o(n?n:e)},c,c.exports,e,t,n,r)}return n[f].exports}for(var i="function"==typeof require&&require,f=0;f<r.length;f++)o(r[f]);return o}({1:[function(e,t,n){t.exports=function(){function e(e){if("function"==typeof e)return u.push(e),t;throw TypeError("subscribe requires a listener function with the signature: function(state) {}")}function t(e){if("function"==typeof e)return u.splice(u.indexOf(e),1);throw TypeError("unsubscribe requires a listener function with the signature: function(state) {}")}function n(e){var t,n;if(!e||"string"!=typeof e.type)throw Error('action has the required signature: {type:"string"}');t=r(),i.forEach(function(n){f[n.name]=n(e,t[n.name])}),n=r(),u.forEach(function(e){e(n)})}function r(){return Object.assign({},f)}if(!arguments.length)throw Error("store requires at least one reducer with the signature: function(action, state) {} and can optionally be passed an initial state object as the last argument");var o,i,f={},u=[];return"object"==typeof arguments[arguments.length-1]&&(o=Array.prototype.pop.call(arguments)),i=Array.prototype.map.call(arguments,function(e){if(e){if(o){if(!o.hasOwnProperty(e.name))throw Error("initialState keys do not match reduced state keys.");f[e.name]=e(o[e.name])}else f[e.name]=e();return e}}),{subscribe:e,dispatch:n,getState:r}}},{}]},{},[1])(1)});
