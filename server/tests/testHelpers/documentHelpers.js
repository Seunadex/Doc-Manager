export default {
  document1: {
    title: 'test doc',
    content: 'test running it',
    access: 'public',
    userId: 1,
    roleId: 1
  },

  sameTitle: {
    title: 'test doc',
    content: 'testing testing 123',
    access: 'public',
    userId: 2,
    roleId: 1
  },

  document2: {
    title: 'document two',
    content: 'jkhfaskldjabksjd',
    access: 'public',
    userId: 1,
    roleId: 1,
  },

  document3: {
    title: 'document three',
    content: 'lkajksdhlvkdjsnlkd',
    access: 'public',
    userId: 1,
    roleId: 1,
  },
  privateDoc: {
    title: 'private doc',
    content: 'lkajksdhlvkdjsnlkd',
    access: 'private',
    userId: 1,
    roleId: 1,
  },

  emptyDoc: {
    title: '',
    content: '',
    access: ''
  },

  invalidAccess: {
    title: 'one title',
    content: 'still running some Tests',
    access: 'normal'
  },

  validDoc: {
    title: 'New doc',
    content: 'the future is now',
    access: 'public',
    userId: 2,
    roleId: 2,
  },

  titleString: {
    title: 233,
    content: 'the future is now',
    access: 'public',
    userId: 2,
    roleId: 2,
  }
};
