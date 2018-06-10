# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

def get_user_email():
    return auth.user.email if auth.user is not None else None


db.define_table('checklist',
                Field('user_email', default=get_user_email()),
                Field('title'),
                Field('memo', 'text'),
                Field('datetime', 'text'),
                Field('time_of_event', 'text'),
                Field('area', 'text'),
                Field('allergens', 'text'),
                Field('updated_on', 'datetime', update=datetime.datetime.utcnow()),
                Field('is_public', 'boolean', default=True)
                )

# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)

db.define_table('post',
                Field('user_email', default=auth.user.email if auth.user_id else None),
                Field('post_content', 'text'),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                )

# I don't want to display the user email by default in all forms.
db.post.user_email.readable = db.post.user_email.writable = False
db.post.post_content.requires = IS_NOT_EMPTY()
db.post.created_on.readable = db.post.created_on.writable = False
