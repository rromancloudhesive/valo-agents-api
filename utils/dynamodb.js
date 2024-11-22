
/**
 *Auxiliar function to generate expressions to update an item fields depending on what fields are passed through the request 
 * @param {Object} item 
 * @returns {Object} that contains updateExpression, expressionAttribute and expressionAttributeNames
 */
 const createUpdateExpressions = (item) => {
    const updateExpression = [];
    const expressionAttribute = {};
    const expressionAttributeNames = {};
    Object.keys(item).map((key) => {
      if(item[key] !== undefined) {
        const placeholder = `:${key}`;
        const alias = `#${key}`;
        updateExpression.push(`${alias} = ${placeholder}`);
        expressionAttribute[placeholder] = item[key];
        expressionAttributeNames[alias] = key;
      }
    });
    return { updateExpression, expressionAttribute, expressionAttributeNames };
  }
  
  module.exports = {
    createUpdateExpressions,
  }