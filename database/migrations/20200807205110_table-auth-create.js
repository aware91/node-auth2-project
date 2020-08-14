exports.up = async function(knex) {
	await knex.schema.createTable('users', (table) => {
		table.increments()
		table.text('firstname').notNull()
		table.text('lastname').notNull()
		table.text('username').notNull().unique()
		table.text('password').notNull()
		table.text('department').default('administration')
		table.text('role').notNull()
	})
}

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('users')
}