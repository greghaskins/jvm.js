/* exported jvm */
'use strict';
var jvm = jvm || {};
jvm.classParser = (function(){

  function make_reader(buffer){
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

    return {
      readUint8: readUint8,
      readUint16: readUint16,
      readUint32: readUint32,
    };
  }


  return {
    parse: function(arrayBuffer){
      var reader = make_reader(arrayBuffer);

      return {
        magic: reader.readUint32(),
        minor_version: reader.readUint16(),
        major_version: reader.readUint16(),
        constant_pool_count: reader.readUint16(),
        constant_pool: (function(){

        })(),
      };

    }
  };
})();
