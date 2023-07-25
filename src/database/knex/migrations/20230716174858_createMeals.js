exports.up = knex => knex.schema.createTable("meals", table => {
    table.increments("id");
    table.text("title").notNullable();
    table.text("description").notNullable();
    table.text("category").notNullable();
    table.text("image");
    table.decimal("price", 14,2).notNullable();
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("meals");
