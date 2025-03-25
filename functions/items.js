const _ = require('lodash');
let items = require('../init_data.json').data;
let curId = _.size(items);

exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/items', '');
  const segments = path.split('/').filter(Boolean);
  
  try {
    switch (event.httpMethod) {
      case 'GET':
        if (segments.length === 0) {
          return {
            statusCode: 200,
            body: JSON.stringify(_.toArray(items))
          };
        } else if (segments.length === 1) {
          const item = items[segments[0]];
          if (!item) {
            return { statusCode: 404, body: 'Item not found' };
          }
          return {
            statusCode: 200,
            body: JSON.stringify(item)
          };
        }
        break;
        
      case 'POST':
        if (segments.length === 0) {
          const item = JSON.parse(event.body);
          curId += 1;
          item.id = curId;
          items[item.id] = item;
          return {
            statusCode: 200,
            body: JSON.stringify(item)
          };
        }
        break;
        
      case 'DELETE':
        if (segments.length === 1) {
          const item = items[segments[0]];
          if (!item) {
            return { statusCode: 404, body: 'Item not found' };
          }
          delete items[segments[0]];
          return {
            statusCode: 204,
            body: ''
          };
        }
        break;
    }
    
    return {
      statusCode: 400,
      body: 'Invalid request'
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Internal server error: ' + error.message
    };
  }
};