@auth.requires_signature()
def get_user_pref():
    # get user's name on top
    for r in db(db.auth_user.id == auth.user.id).select():
        t = dict(
            first_name=r.first_name,
            last_name=r.last_name,
        )

    return response.json(dict(t))


def update_user_pref():
    q = (db.auth_user.id == auth.user.id)
    row = db(q).select().first()
    row.update_record(
        first_name=request.vars.user_first_name,
        last_name=request.vars.user_last_name,
    )
