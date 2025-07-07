const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Document",
  tableName: "documents",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
    },
    description: {
      type: "text",
      nullable: true,
    },
    category: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    s3_key: {
      type: "varchar",
      length: 255,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
});
