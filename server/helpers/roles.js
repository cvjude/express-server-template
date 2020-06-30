// roles use hieracial inheritance in piling up functionality
// can is where you list the permissions
// for scalability this will be stored ina database and be retrived during log in of users
// operation should be of format operation:crud e.g content:create
export default {
  rbac: {
    guest: {
      can: [''],
    },
    user: {
      can: ['organization:create', 'organization:invite', 'organization:join'],
      inherits: ['guest'],
    },
    staff: {
      can: [{ name: 'content:crud', when: async (params) => params.isAllowed }],
      inherits: ['user'],
    },
    admin: {
      can: ['content:*'],
      inherits: ['staff'],
    },
    owner: {
      can: [
        {
          name: 'organization:invite',
          when: async (params) => params.id === params.ownerId,
        },
      ],
      inherits: ['admin'],
    },
    god: {
      can: [''],
      inherits: ['owner'],
    },
  },
};
