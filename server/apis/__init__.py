from flask_restplus import Api
from apis.menu import menu 
from apis.order import order
from apis.about import about
from apis.auth import auth, authorizations
from apis.reservation import reservation

# from .auth import api as auth_service
# from .order import api as order_service

api = Api(
    title= 'Meja Backend Service',
    description= 'Backend server for Meja App',
    authorizations= authorizations
)

api.add_namespace(menu)

api.add_namespace(order)
api.add_namespace(about)
api.add_namespace(auth)
api.add_namespace(reservation)