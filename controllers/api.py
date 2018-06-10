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

def get_memos():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    memolist = []
    has_more = False
    if auth.user is not None:
        q = (db.checklist.user_email == auth.user.email)

    else:
        q = db.checklist.is_public == True

    # end_idx+1 is a trick to see if there's more items
    rows = db(q).select(db.checklist.ALL, limitby=(start_idx, end_idx + 1))

    # enumerate automatically assigns an index i to item r
    for i, r in enumerate(rows):
        # check if there is 1 more item
        name = get_user_name_from_email(r.user_email)
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
def add_memo():
    t_id = db.checklist.insert(
        # paramters synchronous with post request in add_memo JS function
        title=request.vars.title,
        memo=request.vars.memo,
        datetime=request.vars.datetime,
        area=request.vars.area,
        allergens=request.vars.allergens,
        time_of_event=request.vars.time_of_event,
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
        memo=request.vars.memo,
        datetime=request.vars.datetime,
        area=request.vars.area,
        allergens=request.vars.allergens,
        time_of_event=request.vars.time_of_event,
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

#################### Global Chat #########################

def get_posts():
    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""
    # Implement me!
    print "Made it to the get posts api"
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    posts = []
    has_more = False

    rows = db().select(db.post.ALL)
    for i, r in enumerate(rows):

        print r
    #if i < end_idx - start_idx:
        t = dict(
            id=r.id,
            user_email=r.user_email,
            content=r.post_content,
            created_on=r.created_on,

        )
        print("HERER MAN")
        print(t)
        posts.append(t)
       # else:
          #  has_more = True
    logged_in = auth.user_id is not None
    posts.reverse()
    return response.json(dict(
        posts=posts,
        logged_in=logged_in,
        has_more=has_more,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    user_email = auth.user.email or None
    p_id = db.post.insert(post_content=request.vars.content, title=request.vars.content2)
    p = db.post(p_id)
    post = dict(
            id=p.id,
            user_email=p.user_email,
            content=p.post_content,
            created_on=p.created_on,
    )
    #post = db(db.post.id == request.vars.id).select().first()
    #post.update_record(title = request.vars.content2)
    print("ADD_POST")
    print p
    return response.json(dict(post=post))



@auth.requires_signature()
def del_post():
    """Used to delete a post."""
    # Implement me!
    db(db.post.id == request.vars.post_id).delete()
    return "ok"

