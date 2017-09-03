import pagination from '../helper/pagination';
import { Document } from '../models';
import { isAdmin, generateDocumentDetails } from '../helper/helper';
import DocumentHelper from '../helper/DocumentHelper';
import errorMsg from '../helper/errorMsg';

const { serverError, documentError } = errorMsg;

const DocumentControllers = {
  /**
   * @description Creates a new document
   * @param {Object} request request from client
   * @param {Object} response response from server
   * @returns {Object} returns a response object.
   */
  create(request, response) {
    const authorId = request.decoded.userId;
    const title = request.body.title;
    if (!DocumentHelper.titleIsString(request, response, title)) {
      return Document.findOne({
        where: {
          title: request.body.title
        }
      })
    .then((documents) => {
      if (!DocumentHelper.titleExist(request, response, documents)) {
        return Document.create({
          title: request.body.title,
          content: request.body.content,
          userId: authorId,
          access: (request.body.access).toLowerCase(),
          roleId: request.decoded.userRoleId
        })
    .then(document => response.status(201).send({
      document,
    }))
    .catch(() => response.status(400).send({
      message: 'Access field must be either PUBLIC, PRIVATE or ROLE'
    }));
      }
    })
    .catch(() => response.status(500).send({
      message: serverError.internalServerError
    }));
    }
  },

  /**
   * @description Fetch all documents
   * @param {Object} request request from client
   * @param {Object} response response from server
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
    if (!isAdmin(request.decoded.userRoleId)) {
      return Document.findAndCount({
        where: {
          $or: [{ access: 'public' },
          { access: 'role', $and: { roleId: request.decoded.userRoleId } },
          { access: 'private', $and: { userId: request.decoded.userId } }]
        },
        attributes: {
          exclude: ['roleId']
        },
        limit,
        offset,
      })
      .then(documents => response.status(200).send({
        documents: documents.rows,
        metadata: pagination(documents.count, limit, offset)
      }))
      .catch(() => DocumentHelper.serverError(response));
    }
    return Document.findAndCount({
      limit,
      offset,
    })
    .then(documents => response.status(200).send({
      documents: documents.rows,
      metadata: pagination(documents.count, limit, offset)
    }))
   .catch(() => DocumentHelper.serverError(response));
  },

  /**
   * @description find document by id
   * @param {Object} request request from client
   * @param {Object} response response from server
   * @returns {Object} returns the requested document
   */
  show(request, response) {
    if (!DocumentHelper.invalidDocumentId(
      request, response, request.params.id)) {
      return Document.find({
        where: {
          id: request.params.id,
          $or: [{ access: 'public' },
          { access: 'role', $and: { roleId: request.decoded.userRoleId } },
          { access: 'private', $and: { userId: request.decoded.userId } }]
        },
        attributes: {
          exclude: ['roleId']
        }
      })
      .then((document) => {
        if (!DocumentHelper.noAccess(request,
          response, document)) {
          return response.status(200).send({
            document: generateDocumentDetails(document)
          });
        }
      })
      .catch(() => DocumentHelper.serverError(response));
    }
  },

  /**
   * @description Updates the document
   * @param {Object} request request from client
   * @param {Object} response request from server
   * @returns {Object} returns the updated document
   */
  update(request, response) {
    if (typeof request.body.title !== 'string') {
      return response.status(400).send({
        message: documentError.titleIsString
      });
    }
    Document.findOne({
      where: {
        title: request.body.title,
        content: request.body.content,
      },
      attributes: {
        exclude: ['roleId']
      }
    })
    .then((documents) => {
      if (!DocumentHelper.titleExist(request, response, documents)) {
        return Document.find({
          where: {
            id: request.params.id,
          },
        })
      .then((document) => {
        if (document) {
          return document.update({
            title: request.body.title || document.title,
            content: request.body.content || document.content,
            access: request.body.access || document.access,
          })
          .then(() => response.status(200).send({
            document: generateDocumentDetails(document),
          }))
          .catch(error => response.status(500).send({
            message: error
          }));
        }
      })
      .catch(() => DocumentHelper.serverError(response));
      }
    })
    .catch(() => DocumentHelper.serverError(response));
  },

  /**
   * @param {Object} request request from client
   * @param {Object} response response from server
   * @returns {Object} returns a message indicating
   * that a document has been deleted
   */
  destroy(request, response) {
    if (!DocumentHelper.invalidDocumentId(
      request, response, request.params.id)) {
      return Document.find({
        where: {
          id: request.params.id,
          userId: request.decoded.userId
        },
      })
    .then((document) => {
      if (!DocumentHelper.documentExist(request, response, document)) {
        return document.destroy()
        .then(() => response.status(200).send({
          message: 'Document succesfully deleted',
        }))
        .catch(() => DocumentHelper.serverError(response));
      }
    })
    .catch(() => DocumentHelper.serverError(response));
    }
  },

  /**
   * @description Deletes a document
   * @param {Object} request request from client
   * @param {Object} response server response
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
    .catch(() => DocumentHelper.serverError(response));
  },
};

export default DocumentControllers;
