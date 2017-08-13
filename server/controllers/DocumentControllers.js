import pagination from '../helper/pagination';
import { Document } from '../models';
import { isUser } from '../helper/helper';

const DocumentControllers = {
  /**
   * @description Creates a new document
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object.
   */
  create(req, res) {
    const authorId = req.decoded.userId;
    Document.findOne({
      where: {
        title: req.body.title
      }
    })
    .then((documents) => {
      if (documents) {
        return res.status(409).send({
          message: 'A document already exist with same title',
        });
      }
      Document.create({
        title: req.body.title,
        content: req.body.content,
        userId: authorId,
        access: req.body.access
      })
    .then(document => res.status(201).send(
      {
        document,
      }))
    .catch(() => res.status(400).send(
      {
        message: 'Access field must be either PUBLIC, PRIVATE or ROLE'
      }));
    });
  },

  /**
   * @description Fetch all documents
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the list of documents available
   */

  index(req, res) {
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
          document: document.rows,
          paginationDetails: pagination(document.count, limit, offset)
        }
      }))
      .catch(() => res.status(403).send({
        message: 'limits and offsets must be number'
      }));
    }
  },

  /**
   * @description find document by id
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the requested document
   */
  show(req, res) {
    Document.findById(req.params.id)
      .then((document) => {
        if (isUser(document.userId, req.decoded.id) ||
          document.access === 'private') {
          return res.status(401).send({
            message: "You don't have permission to access this document"
          });
        }

        return res.status(200).send({
          document,
        });
      });
  },

  /**
   * @description Updates the document
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the updated document
   */
  update(req, res) {
    return Document.find({
      where: {
        id: req.params.id,
      },
    })
      .then((document) => {
        if (document) {
          return document.update(req.body, { fields: Object.keys(req.body) })
          .then(() => res.status(200).send({
            document,
          }));
        }
      });
  },

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a message indicating
   * that a document has been deleted
   */
  destroy(req, res) {
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({
        message: 'Invalid document id'
      });
    }
    return Document.find({
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
        }))
        .catch(() => res.status(400).send({
          message: 'Problem encountered, please try again'
        }));
    })
    .catch(() => res.status(500).send({
      message: 'Server error, please try again'
    }));
  },

  /**
   * @description Deletes a document
   * @param {Object} req
   * @param {Object} res
   * @returns {Response} Response object
   */
  search(req, res) {
    const verifiedRoleId = req.decoded.userRoleId;
    const userId = req.decoded.userId;
    let searchKey = '%%';
    if (req.query.q) {
      searchKey = `%${req.query.q}%` || `%${req.body.search}%`;
    }
    const searchParam = verifiedRoleId === 1 ? {
      $or: [{ title: { $iLike: searchKey } }]
    }
      :
    {
      $or: [{ access: { $or: ['public', 'role'] } }, { userId }],
      title: { $iLike: searchKey }
    };

    return Document
    .findAll({
      attributes: [
        'title',
        'content',
        'access',
        'userId',
        'createdAt',
        'updatedAt'],
      where: searchParam,
      order: [['createdAt', 'DESC']]
    })
    .then(documents => res.status(200).send({
      count: documents.length,
      documents
    }))
    .catch(error => res.status(400).send(error.message));
  },
};

export default DocumentControllers;
