import pagination from '../helper/pagination';
import { Document } from '../models';
import { isUser } from '../helper/helper';
import errorMsg from '../helper/errorMsg';

const { serverError } = errorMsg;

const DocumentControllers = {
  /**
   * @description Creates a new document
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a response object.
   */
  create(request, response) {
    const authorId = request.decoded.userId;
    Document.findOne({
      where: {
        title: request.body.title
      }
    })
    .then((documents) => {
      if (documents) {
        return response.status(409).send({
          message: 'A document already exist with same title',
        });
      }
      Document.create({
        title: request.body.title,
        content: request.body.content,
        userId: authorId,
        access: request.body.access
      })
    .then(document => response.status(201).send(
      {
        document,
      }))
    .catch(() => response.status(400).send(
      {
        message: 'Access field must be either PUBLIC, PRIVATE or ROLE'
      }));
    });
  },

  /**
   * @description Fetch all documents
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns the list of documents available
   */

  index(request, response) {
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;

    if (isNaN(limit) || isNaN(offset)) {
      return response.status(400).send({
        message: 'limit and offset must be an integer'
      });
    }
    if (request.query) {
      return Document.findAndCount({
        where: {
          access: 'public'
        },
        limit,
        offset,
      })
      .then(document => response.status(200).send({
        pagination: {
          document: document.rows,
          paginationDetails: pagination(document.count, limit, offset)
        }
      }))
      .catch(() => response.status(400).send({
        message: 'limits and offsets must be number'
      }));
    }
  },

  /**
   * @description find document by id
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns the requested document
   */
  show(request, response) {
    Document.findById(request.params.id)
      .then((document) => {
        if (isUser(document.userId, request.decoded.id) ||
          document.access === 'private') {
          return response.status(403).send({
            message: "You don't have permission to access this document"
          });
        }

        return response.status(200).send({
          document,
        });
      });
  },

  /**
   * @description Updates the document
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns the updated document
   */
  update(request, response) {
    return Document.find({
      where: {
        id: request.params.id,
      },
    })
      .then((document) => {
        if (document) {
          return document.update(request.body, { fields:
            Object.keys(request.body) })
          .then(() => response.status(200).send({
            document,
          }));
        }
      });
  },

  /**
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a message indicating
   * that a document has been deleted
   */
  destroy(request, response) {
    if (isNaN(Number(request.params.id))) {
      return response.status(400).json({
        message: 'Invalid document id'
      });
    }
    return Document.find({
      where: {
        id: request.params.id,
      },
    })
    .then((document) => {
      if (!document) {
        return response.status(404).send({
          message: 'Document does not exist',
        });
      }
      return document.destroy()
        .then(() => response.status(200).send({
          message: 'Document succesfully deleted',
        }))
        .catch(() => response.status(400).send({
          message: 'Problem encountered, please try again'
        }));
    })
    .catch(() => response.status(500).send({
      message: serverError.internalServerError
    }));
  },

  /**
   * @description Deletes a document
   * @param {Object} request
   * @param {Object} response
   * @returns {Response} Response object
   */
  search(request, response) {
    const verifiedRoleId = request.decoded.userRoleId;
    const userId = request.decoded.userId;
    let searchKey = '%%';
    if (request.query.q) {
      searchKey = `%${request.query.q}%` || `%${request.body.search}%`;
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
    .then(documents => response.status(200).send({
      count: documents.length,
      documents
    }))
    .catch(error => response.status(400).send(error.message));
  },
};

export default DocumentControllers;
