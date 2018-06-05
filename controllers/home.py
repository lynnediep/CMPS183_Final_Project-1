import random
import time


# Mocks implementation.

def get_memos():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    memolist = []
    has_more = False

    q = db.checklist.is_public == True

    # end_idx+1 is a trick to see if there's more items
    rows = db(q).select(db.checklist.ALL, limitby=(start_idx, end_idx + 1))

    # enumerate automatically assigns an index i to item r
    for i, r in enumerate(rows):
        # check if there is 1 more item
        if i < end_idx - start_idx:
            print r.time_of_event
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
            )
            memolist.append(t)
        else:
            has_more = True
    logged_in = auth.user is not None

    # below are data paramters when getJSON is called
    return response.json(dict(
        memolist=memolist,
        has_more=has_more,
    ))