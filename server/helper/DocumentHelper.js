import errorMsg from '../helper/errorMsg';

const { serverError, documentError } = errorMsg;
/**
 * @export
 * @class DocumentHelper
 */
export default class DocumentHelper {


  /**
   * @description verify if the document exist in the database
   * @static
   * @param {Object} request request from the client
   * @param {Object} response server response
   * @param {Object} document
   * @returns {Boolean} return true or false
   * @memberof DocumentHelper
   */
  static documentExist(request, response, document) {
    if (!document) {
      response.status(404).send({
        message: documentError.documentNotFound
      });
      return true;
    }
    return false;
  }

  /**
   *
   * @description verifies if document Id is invalid
   * @static
   * @param {Object} request request from the client
   * @param {Object} response server response
   * @param {Object} id represents the document id
   * @returns {Boolean} return true or false
   * @memberof DocumentHelper
   */
  static invalidDocumentId(request, response, id) {
    if (isNaN(Number(id))) {
      response.status(400).send({
        message: documentError.invalidDocumentId
      });
      return true;
    }
    return false;
  }

  /**
   *
   * @description restrict access to a document
   * @static
   * @param {Object} request request from the client
   * @param {Object} response server response
   * @param {Object} document
   * @returns {Boolean} return true or false
   * @memberof DocumentHelper
   */
  static noAccess(request, response, document) {
    if (document === null) {
      response.status(403).send({
        message: documentError.accessDenied
      });
      return true;
    }
    return false;
  }

  /**
   * @static
   * @param {Object} request request from the client
   * @param {Object} response server response
   * @param {Object} title represents the title of the document
   * @returns {Boolean} return true or false
   * @memberof DocumentHelper
   */
  static titleIsString(request, response, title) {
    if (typeof title !== 'string') {
      response.status(400).send({
        message: documentError.titleIsString
      });
      return true;
    }
    return false;
  }

  /**
   * @description Sends a server error message
   * @static
   * @param {Object} response server response
   * @returns {Object} response message
   * @memberof DocumentHelper
   */
  static serverError(response) {
    return response.status(500).send({
      message: serverError.internalServerError
    });
  }

  /**
   * @description checks if a document title already exist
   * @static
   * @param {Object} request request from the client
   * @param {Object} response server response
   * @param {Object} documents represents the title of the document
   * @returns {Boolean} return true or false
   * @memberof DocumentHelper
   */
  static titleExist(request, response, documents) {
    if (documents) {
      response.status(409).send({
        message: documentError.titleConflict
      });
      return true;
    }
    return false;
  }
}
