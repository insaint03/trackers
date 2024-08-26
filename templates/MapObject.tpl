___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "MACRO",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "MapObject",
  "description": "Mapping sourceVariable (js object) via mappingTable",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "TEXT",
    "name": "sourceVariable",
    "displayName": "Source Variable",
    "simpleValueType": true,
    "valueValidators": [
      {
        "type": "NON_EMPTY"
      }
    ],
    "help": "Object type variable or corresponding JSON string"
  },
  {
    "type": "SIMPLE_TABLE",
    "name": "mappingTable",
    "displayName": "Mapping Table",
    "simpleTableColumns": [
      {
        "defaultValue": "",
        "displayName": "Source Key",
        "name": "src",
        "type": "TEXT"
      },
      {
        "defaultValue": "",
        "displayName": "Target Key",
        "name": "trg",
        "type": "TEXT"
      }
    ],
    "help": "Source - Target key mapping. Only the keys listed on the  mappingTable will be extracted from the source. leave Target Key blank to use the key name as-is..Plus, dot (.) seperators to map nested Objects.\n\ni.e.) \nsourceVariable: {key: \u0027#1\u0027, profile: {url: \u0027etc\u0027, alt: \u0027title\u0027}, contact: {email: \u0027e\u0027, cell: \u0027phone\u0027}}\nmappingTable: \n - key \u003e (blank)\n - profile.url \u003e profile.link\n - contact \u003e contacts\n--- Will produce: \n{\n  key: \u0027#1\u0027,\n  profile: { link: \u0027etc\u0027 },\n  contacts: { email: \u0027e\u0027, cell: \u0027phone\u0027 }\n}"
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

/*
 * Map Object (variable template)
 *  yg.song / dxnlab
 */
const log = require('logToConsole');
const JSON = require('JSON');
const assert = require('assertThat');

// sourceVariable must be set
assert(data.sourceVariable!=null, 
       'Source Variable must be set');
// mappingTable must be set
assert(data.mappingTable && 0<data.mappingTable.length, 
       'Mapping Table must have item');

// prepare source data
var _source = typeof(data.sourceVariable)==='object'
 ? data.sourceVariable
 : JSON.parse(data.sourceVariable);

assert(_source!=null && typeof(_source)==='object', 
       'Source Variable ought to be Object');

// convert
const output= data.mappingTable.reduce(function(agg, m){
  const trg = (m.trg || m.src).split('.');
  const src = m.src.split('.');
  
  // find the value
  const val = src.reduce(function(cursor, k){ 
    return cursor!=null ? cursor[k] : null;
  }, _source);
  
  // skip if the value not presented on the source
  if(val==null) { return agg; }
  // put the target copy
  let cmp = _source;
  const out = trg.reduce(function(cursor, k, ki, ka){
    // move source cursor to test if its array
    cmp = cmp[k];
    // set value at last key, others set empty object/array
    cursor[k] = ka.length-1 <= ki ? val : {};
    return cursor[k];
  }, agg);
  return agg;
}, {});

return output;


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "logging",
        "versionId": "1"
      },
      "param": [
        {
          "key": "environments",
          "value": {
            "type": 1,
            "string": "debug"
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios:
- name: simple run
  code: |-
    const mockData = {
      sourceVariable: {key: '1'},
      mappingTable: [
        {src: 'key', trg: 'id'}
      ]
    };

    // Call runCode to run the template's code.
    let variableResult = runCode(mockData);

    // Verify that the variable returns a result.
    assertThat(variableResult).isNotEqualTo(undefined);
    assertThat(variableResult).isEqualTo({id:'1'});
- name: multi elements
  code: |-
    const mockData = {
      sourceVariable: {
        name: 'test',
        type: 'test',
        values: [1,2,3],
      },
      mappingTable: [
        {src: 'name', trg: 'key'},
        {src: 'values', trg: 'val'}
     ]
    };
    let result = runCode(mockData);
    assertThat(result).isEqualTo({key: 'test', val: [1,2,3]});
- name: nested elements
  code: |-
    const mockData = {
      // Mocked field values
      sourceVariable: {
        name: 'joe',
        profile: {
          location: 'somewhere',
          alt: 'text'
        }
      },
      mappingTable: [
        {src: 'name', trg: 'nick'},
        {src: 'profile.location', trg: 'profile.url' }
      ]
    };

    // Call runCode to run the template's code.
    let variableResult = runCode(mockData);

    // Verify that the variable returns a result.
    assertThat(variableResult).isNotEqualTo(undefined);
    assertThat(variableResult).isEqualTo({
      nick: 'joe',
      profile: {url: 'somewhere'},
    });
- name: null as-is
  code: |-
    const mockData = {
      sourceVariable: {
        key: {
          value: 1
        },
        ignore: false,
      },
      mappingTable: [
        {src: 'key.value', trg: ''},
      ],
    };

    // Call runCode to run the template's code.
    let variableResult = runCode(mockData);

    // Verify that the variable returns a result.
    assertThat(variableResult).isNotEqualTo(undefined);
    assertThat(variableResult).isEqualTo({key: { value: 1 }});
- name: mapping help
  code: |-
    const mockData = {
      sourceVariable: {key: '#1', profile: {url: 'etc', alt: 'title'}, contact: {email: 'e', cell: 'phone'}},
      mappingTable: [
        {src: 'key', trg: null},
        {src: 'profile.url', trg: 'profile.link' },
        {src: 'contact', trg: 'contacts'},
     ]
    };

    // Call runCode to run the template's code.
    let variableResult = runCode(mockData);

    // Verify that the variable returns a result.
    assertThat(variableResult).isNotEqualTo(undefined);
    assertThat(variableResult).isEqualTo({
      key: '#1',
      profile: {link: 'etc'},
      contacts: {email: 'e', cell: 'phone'},
    });
- name: skip none exists
  code: "const mockData = {\n  sourceVariable: {\n    key: 'value', \n    number:\
    \ 123,\n    nested: {\n      index: 1,\n      value: false,\n    }\n  },\n  mappingTable:\
    \ [\n    { src: 'key', trg: null },\n    { src: 'id', trg: 'clear' },\n    { src:\
    \ 'nested.flag', trg: null },\n  ],\n};\n\n// Call runCode to run the template's\
    \ code.\nlet variableResult = runCode(mockData);\n\n// Verify that the variable\
    \ returns a result.\nassertThat(variableResult).isNotEqualTo(undefined);\nassertThat(variableResult).isEqualTo({key:\
    \ 'value',});\n  "
setup: |-
  // imports
  const log = require('logToConsole');
  const Object = require('Object');


___NOTES___

Created on 2024. 8. 2. 오후 3:23:06


