import pagination from '../helper/pagination';

const Document = require('../models').Document;
const User = require('../models').User;

const DocumentControllers = {
  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object.
   */
  create(req, res) {
    const authorId = res.locals.decoded.UserId;
    return Document.create({
      title: req.body.title,
      content: req.body.content,
      UserId: authorId,
      access: req.body.access
    })
    .then(document => res.status(201).send({
      message: 'Document successfully created',
      document,
    })
    )
    .catch(() => res.status(400).send({
      message: 'Verify your input'
    }));
  },

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the list of documents available
   */
  listDocuments(req, res) {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).send({
        message: 'limit and offset must be an integer'
      });
    }
    if (req.query) {
      return Document.findAndCount({
        limit,
        offset,
      })
    .then(document => res.status(200).send({
      pagination: {
        row: document.rows,
        paginationDetails: pagination(document.count, limit, offset)
      }
    }))
    .catch(() => res.status(403).send({
      message: 'limits and offsets must be number'
    }));
    }
  },

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the requested document
   */
  getDocument(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        message: 'id must be an integer'
      });
    }
    return User
    .findById(res.locals.decoded.UserId, {
      include: [{
        model: Document,
        as: 'documents',
      }],
      attributes: ['fullname', 'username', 'email']
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return res.status(200).send({
        message: `These are the documents created by ${res.locals.decoded.userFullname}`,
        user,
      });
    })
    .catch(error => res.status(400).send(error));
  },

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the updated document
   */
  updateDocument(req, res) {
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({
        message: 'Invalid document id'
      });
    }
    return Document
      .find({
        where: {
          id: req.params.id,
        },
      })
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'The Document does not exist',
          });
        }
        if (req.body.title) {
          req.body.title = (req.body.title).toLowerCase();
        }
        return document
          .update(req.body, { fields: Object.keys(req.body) })
          .then(() => res.status(200).send({
            message: 'The Document successfully updated',
            id: document.id,
            title: document.title,
            content: document.content,
            access: document.access,
            document,
          }))
          .catch(() => res.status(400).send({
            message: 'Document not found',
          }));
      })
      .catch(() => res.status(400).send({
        message: 'Connection Error, please try again',
      }));
  },

  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {void}
   */
  destroy(req, res) {
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({
        message: 'Invalid document id'
      });
    }
    return Document
    .find({
      where: {
        id: req.params.id,
      },
    })
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          message: 'Document does not exist',
        });
      }
      return document.destroy()
        .then(() => res.status(200).send({
          message: 'Document succesfully deleted',
          status: 'No content',
        }))
        .catch(error => res.status(400).send(error));
    })
    .catch(() => res.status(400).send({
      message: 'connection error, please try again'
    }));
  },

  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Response} Response object
   */
  searchDocument(req, res) {
    const searchKey = `%${req.query.q}%` || `%${req.body.search}%`;
    const verifiedRoleId = res.locals.decoded.userRoleId;
    const userId = res.locals.decoded.UserId;
    const searchAttributes = verifiedRoleId === 1 ? {
      $or: [{ title: { $iLike: searchKey } }]
    }
    :
    {
      $or: [{ access: { $or: ['public', 'role'] } }, { userId }],
      title: { $iLike: searchKey }
    };
    return Document.findAll({
      attributes: ['title', 'content', 'access', 'UserId', 'createdAt', 'updatedAt'],
      where: searchAttributes,
      include: [
        {
          model: User,
          attributes: ['username', 'RoleId']
        }
      ]
    })
    .then(documents => res.status(200).send({
      documents: documents.filter(document => !(document.User.RoleId === verifiedRoleId && document.User.RoleId === 'role')),
    }))
    .catch(() => res.status(403).send({
      message: 'Forbidden'
    }));
  }
};

export default DocumentControllers;
