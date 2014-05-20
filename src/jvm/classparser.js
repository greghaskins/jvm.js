define(function(){

  function makeReader(buffer){
    var uint8View = new Uint8Array(buffer);
    var position = 0;

    function readUint8(){
      return uint8View[position++];
    }
    function readUint16(){
      var high = readUint8();
      var low = readUint8();
      return (high << 8) + low;
    }
    function readUint32(){
      var a = readUint8();
      var b = readUint8();
      var c = readUint8();
      var d = readUint8();
      return (a << 24) + (b << 16) + (c << 8) + d;
    }
    function readUint8Array(length){
      var arr = new Uint8Array(buffer, position, length);
      position += length;
      return arr;
    }

    return {
      readUint8: readUint8,
      readUint16: readUint16,
      readUint32: readUint32,
      readUint8Array: readUint8Array,
    };
  }

  function readConstantPool(reader, constant_pool_count){
    var CONSTANT_Class = 7;
    // var CONSTANT_Fieldref = 9;
    var CONSTANT_Methodref = 10;
    // var CONSTANT_InterfaceMethodref = 11;
    // var CONSTANT_String = 8;
    // var CONSTANT_Integer = 3;
    // var CONSTANT_Float = 4;
    // var CONSTANT_Long = 5;
    // var CONSTANT_Double = 6;
    var CONSTANT_NameAndType = 12;
    var CONSTANT_Utf8 = 1;
    // var CONSTANT_MethodHandle = 15;
    // var CONSTANT_MethodType = 16;
    // var CONSTANT_InvokeDynamic = 18;

    var constInfoFactories = {};
    constInfoFactories[CONSTANT_Methodref] = function(){
      return {
        tag: CONSTANT_Methodref,
        class_index: reader.readUint16(),
        name_and_type_index: reader.readUint16(),
      };
    };
    constInfoFactories[CONSTANT_Class] = function(){
      return {
        tag: CONSTANT_Class,
        name_index: reader.readUint16(),
      };
    };
    constInfoFactories[CONSTANT_Utf8] = function(){
      var length = reader.readUint16();
      return {
        tag: CONSTANT_Utf8,
        length: length,
        bytes: reader.readUint8Array(length),
      };
    };
    constInfoFactories[CONSTANT_NameAndType] = function(){
      return {
        tag: CONSTANT_NameAndType,
        name_index: reader.readUint16(),
        descriptor_index: reader.readUint16(),
      };
    };

    var constantPoolSize = constant_pool_count - 1;
    var constantPool = [undefined];

    for(var i = 0; i < constantPoolSize; i++){
      var tag = reader.readUint8();
      var const_info = constInfoFactories[tag]();
      constantPool.push(const_info);
    }

    return constantPool;
  }

  function readMethods(reader, methodCount){
    /* jshint unused: false */

    var method = {};
    method.access_flags = reader.readUint16();
    method.name_index = reader.readUint16();
    method.descriptor_index = reader.readUint16();
    method.attributes_count = reader.readUint16();
    method.attributes = readAttributes(reader, method.attributes_count);

    var methods = [method];
    return methods;
  }

  function readAttributes(reader, attributesCount){
    /* jshint unused: false */
    var attribute = {};
    attribute.attribute_name_index = reader.readUint16();
    return [attribute];
  }

  return {
    parse: function(arrayBuffer){
      var reader = makeReader(arrayBuffer);

      var klass = {};
      klass.magic = reader.readUint32();
      klass.minor_version = reader.readUint16();
      klass.major_version = reader.readUint16();
      klass.constant_pool_count = reader.readUint16();
      klass.constant_pool = readConstantPool(reader, klass.constant_pool_count);
      klass.access_flags = reader.readUint16();
      klass.this_class = reader.readUint16();
      klass.super_class = reader.readUint16();

      klass.interfaces_count = reader.readUint16();
      klass.interfaces = [];
      klass.fields_count = reader.readUint16();
      klass.fields = [];

      klass.methods_count = reader.readUint16();
      klass.methods = readMethods(reader, klass.method_count);


      return klass;

    }
  };
});
