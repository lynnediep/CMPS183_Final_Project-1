@auth.requires_signature()
def get_user_pref():
    # get user's name on top
    for r in db(db.auth_user.id == auth.user.id).select():
        t = dict(
            first_name=r.first_name,
            last_name=r.last_name,
        )
    return response.json(dict(t))


@auth.requires_signature()
def update_user_pref():
    q = (db.auth_user.id == auth.user.id)
    row = db(q).select().first()
    row.update_record(
        first_name=request.vars.user_first_name,
        last_name=request.vars.user_last_name,
    )


@auth.requires_signature()
def get_user_avatar():
    row = db(db.user_avatar.belongs_to == auth.user.id).select()
    if (row):
        for r in db(db.user_avatar.belongs_to == auth.user.id).select():
            t = dict(
                image_url=r.image_url,
            )
    else:
        t = dict(
            image_url="https://image.flaticon.com/icons/svg/145/145867.svg",
        )

    return response.json(dict(t))



@auth.requires_signature()
def update_avatar():
    row = db(db.user_avatar.belongs_to == auth.user.id).select()
    if (row):
        q = (db.user_avatar.belongs_to == auth.user.id)
        row = db(q).select().first()
        row.update_record(
            image_url=request.vars.image_url,
        )

    else:
        t_id = db.user_avatar.insert(
            image_url=request.vars.image_url,
        )
        t = db.user_avatar(t_id)
    return response.json(dict(image=t))
