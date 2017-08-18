import omit from 'omit';
/**
 *
 * @class Validation
 */
class Validation {
  /**
   *
   *
   * @param {Object} request
   * @param {Object} response
   * @param {callback} next
   * @returns {json} returns the error (if there's any) in a JSON format
   * @memberof Validation
   */
  validateUser(request, response, next) {
    request.checkBody('fullName', 'Fullname is required').notEmpty();
    request.checkBody('username', 'username is required').notEmpty();
    request.checkBody('password', 'password is required').notEmpty();
    request.checkBody('email', 'Invalid email').isEmail();
    request.checkBody('email', 'email is required').notEmpty();

    const errors = request.validationErrors();
    if (errors) {
      const unwanted = ['param', 'value'];
      const errorMsg = errors.map(omit(unwanted));
      return response.status(400).json(errorMsg);
    }
    return next();
  }

  /**
   *
   *
   * @param {Object} request
   * @param {Object} response
   * @param {callback} next
   * @returns {json} returns the error (if there's any) in a JSON format
   * @memberof Validation
   */
  validateLoginInput(request, response, next) {
    request.checkBody('username', 'username is required').notEmpty();
    request.checkBody('password', 'password is required').notEmpty();

    const errors = request.validationErrors();
    if (errors) {
      const unwanted = ['param', 'value'];
      const errorMsg = errors.map(omit(unwanted));
      return response.status(400).json(errorMsg);
    }
    return next();
  }

  /**
   *
   * @param {Object} request
   * @param {Object} response
   * @param {callback} next
   * @returns {JSON} returns the error (if there's any) in a JSON format
   * @memberof Validation
   */
  validateDocuments(request, response, next) {
    request.checkBody('title', 'Document title must be entered').notEmpty();
    request.checkBody('content', 'Content is required').notEmpty();
    request.checkBody('access', 'Access can not be an integer').isAlpha();
    request.checkBody('access', 'Access is required').notEmpty();

    const errors = request.validationErrors();

    if (errors) {
      const unwanted = ['param', 'value'];
      const errorMsg = errors.map(omit(unwanted));
      return response.status(400).json(errorMsg);
    }
    next();
  }
}

export default new Validation();
