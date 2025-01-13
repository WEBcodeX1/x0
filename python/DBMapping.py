mapping = {
    'test_dynpulldown1': {
        'sql': """ SELECT
                   testkey AS Display,
                   testvalue AS Value
                   FROM
                   integrationtest.dynpulldown
                   WHERE "group" = 'dynpulldown1'
                   ORDER BY id ASC""",
        'params': [
        ]
    }
}
