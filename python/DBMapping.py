mapping = {
        'demo_sql_dynpulldown': {
        'sql': """ SELECT
                   testvalue AS value
                   FROM
                   tablename
                   WHERE id = %(DBPrimaryKeyValue)s
                   ORDER BY id ASC""",
        'params': [
            'DBPrimaryKeyValue'
        ]
    },
}
