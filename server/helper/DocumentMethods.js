
/**
 * @export
 * @class DocumentMethods
 */
export default class DocumentMethods {


  /**
   * @description verify if the document exist in the database
   * @static
   * @param {Object} request request from the client
   * @param {Object} response server response
   * @param {Object} document
   * @returns {Boolean} return true or false
   * @memberof DocumentMethods
   */
  static documentExist(request, response, document) {
    if (!document) {
      response.status(404).send({
        message: 'Document does not exist',
      });
      return true;
    }
    return false;
  }
}
