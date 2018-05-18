import random
import time


# Mocks implementation.
def get_memos():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    memolist = []
    has_more = False
    if auth.user is not None:
        q = ((db.checklist.user_email == auth.user.email) | (
                    (db.checklist.is_public == True) & (db.checklist.user_email != auth.user.email)))

    else:
        q = db.checklist.is_public == True

    # end_idx+1 is a trick to see if there's more items
    rows = db(q).select(db.checklist.ALL, limitby=(start_idx, end_idx + 1))

    # enumerate automatically assigns an index i to item r
    for i, r in enumerate(rows):
        # check if there is 1 more item

        if i < end_idx - start_idx:
            t = dict(
                id=r.id,
                user_email=r.user_email,
                title=r.title,
                memo=r.memo,
                datetime=r.dateime,
                time=r.updated_on,
                is_public=r.is_public,
                is_being_edited=False,
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
def add_memo():
    t_id = db.checklist.insert(
        # paramters synchronous with post request in add_memo JS function
        title=request.vars.title,
        memo=request.vars.memo
    )
    t = db.checklist(t_id)
    # to make edit work right after adding a memo
    t.is_being_edited = False
    return response.json(dict(memo=t))


@auth.requires_signature()
def del_memo():
    db((db.checklist.user_email == auth.user.email) & (db.checklist.id == request.vars.memo_id)).delete()
    return "ok"


@auth.requires_signature()
def edit_memo():
    q = ((db.checklist.user_email == auth.user.email) &
         (db.checklist.id == request.vars.memo_id))
    row = db(q).select().first()

    t_id = row.update_record(
        title=request.vars.title,
        memo=request.vars.memo
    )

    print('done')
    return response.json(dict(memo=t_id))


@auth.requires_signature()
def toggle_visibility():
    q = ((db.checklist.user_email == auth.user.email) &
         (db.checklist.id == request.vars.memo_id))
    # serialize the query result
    row = db(q).select().first()
    # toggling between True and False
    toggleVal = True if row.is_public == False else False
    row.update_record(is_public=toggleVal)
    return response.json(dict(is_public=toggleVal))
