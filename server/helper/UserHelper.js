import errorMsg from '../helper/errorMsg';
import { isUser } from '../helper/helper';

const { serverError } = errorMsg;
/**
 * @export
 * @class UserHelper
 */
export default class UserHelper {
  /**
   *
   * @description Checks if a user is allowed to view a page
   * @static
   * @param {Object} request client request
   * @param {Object} response response server response
   * @param {Integer} id
   * @returns {boolean} return either true or false
   * @memberof UserHelper
   */
  static notAllowed(request, response, id) {
    if (!isUser(Number(id), request.decoded.userId) &&
      (request.decoded.userRoleId !== 1)) {
      response.status(403).send({
        message: 'Oops, You are not allowed to view this page'
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
   * @memberof UserHelper
   */
  static serverError(response) {
    return response.status(500).send({
      message: serverError.internalServerError
    });
  }

   /**
   * @description verify if a user has any document
   * @static
   * @param {Object} request request from the client
   * @param {Object} response server response
   * @param {Object} documents
   * @returns {Boolean} return true or false
   * @memberof UserHelper
   */
  static userHasNoDocument(request, response, documents) {
    if (documents.length === 0) {
      response.status(404).send({
        message: 'No document found for this user'
      });
      return true;
    }
    return false;
  }

}
