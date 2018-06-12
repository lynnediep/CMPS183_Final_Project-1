import tempfile

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid

# Here go your api methods.

import traceback


@auth.requires_signature(hash_vars=False)
def get_images():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    imagelist = []
    # end_idx+1 is a trick to see if there's more items
    rows = db().select(db.user_images.ALL, orderby=~db.user_images.created_on, limitby=(start_idx, end_idx + 1))

    # enumerate automatically assigns an index i to item r
    for i, r in enumerate(rows):
        # check if there is 1 more item
        if i < end_idx - start_idx:
            qname = (r.created_by == db.auth_user.id)

            t = dict(
                id=r.id,
                image_url=r.image_url,
                image_description=r.description,
                created_on=r.created_on.strftime('%-I:%M%p %b %d %Y'),
                show_des=False,
                first_name=db(qname).select(db.auth_user.first_name).first(),
                last_name=db(qname).select(db.auth_user.last_name).first()
            )
            imagelist.append(t)
        else:
            has_more = True
    logged_in = auth.user is not None

    # below are data paramters when getJSON is called
    return response.json(dict(
        imagelist=imagelist,
    ))


@auth.requires_signature()
def add_image():
    t_id = db.user_images.insert(
        # paramters synchronous with post request in add_image JS function
        image_url=request.vars.image_url,
        description=request.vars.image_description
    )
    t = db.user_images(t_id)
    return response.json(dict(image=t))
