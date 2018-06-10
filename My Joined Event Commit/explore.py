import random
import time


# Mocks implementation.

def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])

@auth.requires_signature(hash_vars=False)
def get_memos():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    memolist = []
    has_more = False

    # end_idx+1 is a trick to see if there's more items
    rows = db().select(db.checklist.ALL, limitby=(start_idx, end_idx + 1))

    # enumerate automatically assigns an index i to item r
    for i, r in enumerate(rows):
        # check if there is 1 more item
        name = get_user_name_from_email(r.user_email)
        if i < end_idx - start_idx:
            t = dict(
                id=r.id,
                user_email=r.user_email,
                title=r.title,
                memo=r.memo,
                datetime=r.datetime,
                area=r.area,
                time_of_event=r.time_of_event,
                allergens=r.allergens,
                time=r.updated_on,
                is_public=r.is_public,
                is_being_edited=False,
                first_name=name,
            )
            memolist.append(t)
        else:
            has_more = True
    logged_in = auth.user is not None

    # below are data paramters when getJSON is called
    return response.json(dict(
        memolist=memolist,
        logged_in=logged_in,
        has_more=has_more,
    ))

@auth.requires_signature()
def toggle_post():
    if request.vars.m_id is None:
        raise HTTP(500)
    q = ((db.checklist.id == request.vars.m_id))
    row = db(q).select().first()
    row.update_record(is_public = not row.is_public)

@auth.requires_signature()
def toggle_post2():
    print("well i got here, post below")
    cl = db(db.checklist.id == request.vars.id).select().first()
    print cl
    if cl.is_public is True:
        cl.update_record(is_public = False)
    else:
        cl.update_record(is_public = True)
    #post.update_record(is_public = not post.is_public)
    print cl
    print ("TOGGLED IS_PUBLIC")
    #redirect(URL('default', 'index'))
    #return response.json(dict(post=post))
    return dict()
