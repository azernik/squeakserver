

valid_params = {'host', 'database', 'user', 'password'}


def parse_db_params(config, section='postgresql'):
    # get section, default to postgresql
    db = {}
    if config.has_section(section):
        params = config.items(section)
        for param in params:
            if param[0] in valid_params:
                db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
    return db