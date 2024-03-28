/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `annotation_tool`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    {
      resolve: `gatsby-source-mysql`,
      options: {
        connectionDetails: {
          host: '127.0.0.1',
          user: 'lasse',
          password: '1234',
          database: 'annotation_tool_db'
        },
        queries: [
          {
            statement: 'SELECT * FROM users',
            idFieldName: 'id',
            name: 'users'
          },
          {
            statement: 'SELECT * FROM annotations',
            idFieldName: 'id',
            name: 'annotations',
            parentName: 'users',
            foreignKey: 'user_id',
            cardinality: 'OneToMany',
          },
        ]
      }
    }
  ],
}
