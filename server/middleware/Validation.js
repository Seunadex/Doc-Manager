import omit from 'omit';
/**
 *
 * @class Validation
 */
class Validation {
  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {json} returns the error (if there's any) in a JSON format
   * @memberof Validation
   */
  validateUser(req, res, next) {
    req.checkBody('fullName', 'Fullname is required').notEmpty();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('email', 'email is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      const unwanted = ['param', 'value'];
      const errorMsg = errors.map(omit(unwanted));
      return res.status(400).json(errorMsg);
    }
    return next();
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {JSON} returns the error (if there's any) in a JSON format
   * @memberof Validation
   */
  validateDocuments(req, res, next) {
    req.checkBody('title', 'Document title must be entered').notEmpty();
    req.checkBody('content', 'Content is required').notEmpty();
    req.checkBody('access', 'Access can not be an integer').isAlpha();
    req.checkBody('access', 'Access is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
      const unwanted = ['param', 'value'];
      const errorMsg = errors.map(omit(unwanted));
      return res.status(400).json(errorMsg);
    }
    next();
  }
}

export default new Validation();
