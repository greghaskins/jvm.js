/* global jvm */
'use strict';

describe('class parser', function(){

  var classParser = jvm.classParser;

  describe('loading an empty class', function(){

    var klass;

    beforeEach(function(){
      var emptyClassFile = new Uint8Array([
        0xCA, 0xFE, 0xBA, 0xBE, 0x00, 0x00, 0x00, 0x33,
        0x00, 0x0D, 0x0A, 0x00, 0x03, 0x00, 0x0A, 0x07,
        0x00, 0x0B, 0x07, 0x00, 0x0C, 0x01, 0x00, 0x06,
        0x3C, 0x69, 0x6E, 0x69, 0x74, 0x3E, 0x01, 0x00,
        0x03, 0x28, 0x29, 0x56, 0x01, 0x00, 0x04, 0x43,
        0x6F, 0x64, 0x65, 0x01, 0x00, 0x0F, 0x4C, 0x69,
        0x6E, 0x65, 0x4E, 0x75, 0x6D, 0x62, 0x65, 0x72,
        0x54, 0x61, 0x62, 0x6C, 0x65, 0x01, 0x00, 0x0A,
        0x53, 0x6F, 0x75, 0x72, 0x63, 0x65, 0x46, 0x69,
        0x6C, 0x65, 0x01, 0x00, 0x0F, 0x45, 0x6D, 0x70,
        0x74, 0x79, 0x43, 0x6C, 0x61, 0x73, 0x73, 0x2E,
        0x6A, 0x61, 0x76, 0x61, 0x0C, 0x00, 0x04, 0x00,
        0x05, 0x01, 0x00, 0x0A, 0x45, 0x6D, 0x70, 0x74,
        0x79, 0x43, 0x6C, 0x61, 0x73, 0x73, 0x01, 0x00,
        0x10, 0x6A, 0x61, 0x76, 0x61, 0x2F, 0x6C, 0x61,
        0x6E, 0x67, 0x2F, 0x4F, 0x62, 0x6A, 0x65, 0x63,
        0x74, 0x00, 0x20, 0x00, 0x02, 0x00, 0x03, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
        0x04, 0x00, 0x05, 0x00, 0x01, 0x00, 0x06, 0x00,
        0x00, 0x00, 0x1D, 0x00, 0x01, 0x00, 0x01, 0x00,
        0x00, 0x00, 0x05, 0x2A, 0xB7, 0x00, 0x01, 0xB1,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x07, 0x00, 0x00,
        0x00, 0x06, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x00, 0x01, 0x00, 0x08, 0x00, 0x00, 0x00, 0x02,
        0x00, 0x09 ]).buffer;

        klass = classParser.parse(emptyClassFile);
    });

    it('should have the correct major_version', function(){
      expect(klass.major_version).toBe(51);
    });

    it('should have twelve items in the constant pool array', function(){
      var count_one_more_than_pool_size = 12 + 1;
      expect(klass.constant_pool_count).toBe(count_one_more_than_pool_size);
    });

    it('should have the <init> methodref constant first', function(){
      var CONSTANT_Methodref = 10;
      var const_info = klass.constant_pool[1];
      expect(const_info.tag).toBe(CONSTANT_Methodref);
      expect(const_info.class_index).toBe(3);
      expect(const_info.name_and_type_index).toBe(10);
    });

    it('should have its own class reference second', function(){
      var CONSTANT_Class = 7;
      var const_info = klass.constant_pool[2];
      expect(const_info.tag).toBe(CONSTANT_Class);
      expect(const_info.name_index).toBe(11);
    });

    it('should have its super class reference third', function(){
      var CONSTANT_Class = 7;
      var const_info = klass.constant_pool[3];
      expect(const_info.tag).toBe(CONSTANT_Class);
      expect(const_info.name_index).toBe(12);
    });

    it('should have the <init> method name fourth', function(){
      checkUtf8Constant(4, '<init>');
    });

    it('should have the <init> method signature fifth', function(){
      checkUtf8Constant(5, '()V');
    });

    it('should have the Code constant sixth', function(){
      checkUtf8Constant(6, 'Code');
    });

    it('should have the LineNumberTable constant seventh', function(){
      checkUtf8Constant(7, 'LineNumberTable');
    });

    it('should have the SourceFile constant eighth', function(){
      checkUtf8Constant(8, 'SourceFile');
    });

    it('should have the source filename ninth', function(){
      checkUtf8Constant(9, 'EmptyClass.java');
    });

    it('should have the <init> name and type tenth', function(){
      var CONSTANT_NameAndType = 12;
      var const_info = klass.constant_pool[10];
      expect(const_info.tag).toBe(CONSTANT_NameAndType);
      expect(const_info.name_index).toBe(4);
      expect(const_info.descriptor_index).toBe(5);
    });

    it('should have the class name eleventh', function(){
      checkUtf8Constant(11, 'EmptyClass');
    });

    it('should have the super class name twelth', function(){
      checkUtf8Constant(12, 'java/lang/Object');
    });

    function checkUtf8Constant(index, expectedValue){
      var CONSTANT_Utf8 = 1;
      var const_info = klass.constant_pool[index];
      expect(const_info.tag).toBe(CONSTANT_Utf8);
      expect(const_info.length).toBe(expectedValue.length);
      var text = simpleBytesToString(const_info.bytes);
      expect(text).toBe(expectedValue);
    }
  });

  function simpleBytesToString(uint8Array){
    var identity = function(b){ return b; };
    var bytes = Array.prototype.map.call(uint8Array, identity);
    return String.fromCharCode.apply(null, bytes);
  }

});
